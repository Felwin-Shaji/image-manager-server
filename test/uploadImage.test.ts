import assert from "node:assert/strict";
import test from "node:test";
import "reflect-metadata";
import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import { AppError } from "../src/Application/Errors/AppError";
import type { IImageRepository } from "../src/Application/Interfaces/Repositories/IImageRepository";
import type { UploadImageInputDTO } from "../src/Application/DTOs/Images/UploadImageDTO";
import { ImageMapper } from "../src/Application/Mappers/Images/ImageMapper";
import type { IImageStorageService, ImageStorageResult } from "../src/Application/Interfaces/Services/IImageStorageService";
import { UploadImageUseCase } from "../src/Application/UseCases/Images/UploadImageUseCase";
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_TITLE_LENGTH } from "../src/Application/UseCases/Images/UploadImageUseCase";
import { Image } from "../src/Domain/Entities/Image";
import { UploadImageController } from "../src/InterfaceAdapters/Controllers/Images/UploadImageController";
import { authenticate } from "../src/InterfaceAdapters/Middleware/authenticateAccessToken";

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const STORED_IMAGE: ImageStorageResult = {
    publicId: "users/user-123/image-abc",
    secureUrl: "https://images.example/image-abc.png",
    format: "png",
    bytes: PNG_SIGNATURE.length,
    width: 640,
    height: 480
};
const CREATED_AT = new Date("2026-01-10T12:00:00.000Z");

interface FixtureOptions {
    uploadFailure?: unknown;
    persistenceFailure?: unknown;
    cleanupFailure?: unknown;
    nextOrder?: number;
    missingSavedId?: boolean;
}

interface UploadFixture {
    useCase: UploadImageUseCase;
    uploadCalls: Array<{ file: Buffer; folder?: string }>;
    deleteCalls: string[];
    persistenceCalls: Image[];
    orderOwnerIds: string[];
}

interface MockResponse {
    statusCode: number;
    jsonBody: unknown;
    status(code: number): MockResponse;
    json(body: unknown): MockResponse;
}

const createSavedImage = (image: Image): Image & { id: string } => new Image({
    ...image,
    id: "mongo-image-1",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT
}) as Image & { id: string };

const createFixture = (options: FixtureOptions = {}): UploadFixture => {
    const uploadCalls: Array<{ file: Buffer; folder?: string }> = [];
    const deleteCalls: string[] = [];
    const persistenceCalls: Image[] = [];
    const orderOwnerIds: string[] = [];

    const imageRepository: IImageRepository = {
        getNextOrder: async (ownerId) => {
            orderOwnerIds.push(ownerId);
            return options.nextOrder ?? 0;
        },
        create: async (image) => {
            persistenceCalls.push(image);
            if (options.persistenceFailure !== undefined) {
                throw options.persistenceFailure;
            }

            if (options.missingSavedId) {
                return new Image({ ...image, id: null });
            }

            return createSavedImage(image);
        }
    };

    const imageStorageService: IImageStorageService = {
        upload: async (file, folder) => {
            uploadCalls.push({ file, folder });
            if (options.uploadFailure !== undefined) {
                throw options.uploadFailure;
            }

            return STORED_IMAGE;
        },
        delete: async (publicId) => {
            deleteCalls.push(publicId);
            if (options.cleanupFailure !== undefined) {
                throw options.cleanupFailure;
            }
        }
    };

    return {
        useCase: new UploadImageUseCase(imageRepository, imageStorageService),
        uploadCalls,
        deleteCalls,
        persistenceCalls,
        orderOwnerIds
    };
};

const validInput = (overrides: Partial<UploadImageInputDTO> = {}): UploadImageInputDTO => ({
    userId: "user-123",
    title: "  A test image  ",
    file: PNG_SIGNATURE,
    mimeType: "image/png",
    ...overrides
});

const createResponse = (): MockResponse => ({
    statusCode: 0,
    jsonBody: undefined,
    status(code) {
        this.statusCode = code;
        return this;
    },
    json(body) {
        this.jsonBody = body;
        return this;
    }
});

test("successful upload stores image metadata and returns a clean DTO", async () => {
    const fixture = createFixture({ nextOrder: 4 });
    const result = await fixture.useCase.execute(validInput());

    assert.deepEqual(fixture.orderOwnerIds, ["user-123"]);
    assert.deepEqual(fixture.uploadCalls, [{ file: PNG_SIGNATURE, folder: "users/user-123" }]);
    assert.equal(fixture.persistenceCalls.length, 1);
    assert.deepEqual(fixture.persistenceCalls[0], new Image({
        id: null,
        ownerId: "user-123",
        title: "A test image",
        publicId: STORED_IMAGE.publicId,
        secureUrl: STORED_IMAGE.secureUrl,
        format: STORED_IMAGE.format,
        bytes: STORED_IMAGE.bytes,
        width: STORED_IMAGE.width,
        height: STORED_IMAGE.height,
        order: 4
    }));
    assert.deepEqual(result, {
        id: "mongo-image-1",
        title: "A test image",
        order: 4,
        secureUrl: STORED_IMAGE.secureUrl,
        format: STORED_IMAGE.format,
        bytes: STORED_IMAGE.bytes,
        width: STORED_IMAGE.width,
        height: STORED_IMAGE.height,
        createdAt: CREATED_AT,
        updatedAt: CREATED_AT
    });
    assert.equal("publicId" in result, false);
    assert.equal("ownerId" in result, false);
});

test("image mapper converts storage metadata and maps saved images to upload DTOs", () => {
    const image = ImageMapper.fromStorageResult({
        ownerId: "user-123",
        title: "A title",
        order: 0,
        storageResult: STORED_IMAGE
    });
    const savedImage = createSavedImage(image);

    assert.equal(image.id, null);
    assert.equal(image.title, "A title");
    assert.equal(image.order, 0);
    assert.deepEqual(ImageMapper.toUploadOutputDTO(savedImage), {
        id: "mongo-image-1",
        title: "A title",
        order: 0,
        secureUrl: STORED_IMAGE.secureUrl,
        format: STORED_IMAGE.format,
        bytes: STORED_IMAGE.bytes,
        width: STORED_IMAGE.width,
        height: STORED_IMAGE.height,
        createdAt: CREATED_AT,
        updatedAt: CREATED_AT
    });
});

test("missing image file returns HTTP 400 before calling the use case", async () => {
    let useCaseCalls = 0;
    const controller = new UploadImageController({
        execute: async () => {
            useCaseCalls += 1;
            throw new Error("The use case should not be called without a file");
        }
    });
    const request = {
        auth: { userId: "user-123" }
    } as unknown as Request<ParamsDictionary, unknown, unknown>;

    await assert.rejects(
        controller.handle(request, createResponse() as unknown as Response),
        (error: unknown) => error instanceof AppError
            && error.statusCode === 400
            && error.message === "Image file is required"
    );
    assert.equal(useCaseCalls, 0);
});

test("upload controller passes the multipart title and authenticated owner to the use case", async () => {
    const receivedInputs: UploadImageInputDTO[] = [];
    const controller = new UploadImageController({
        execute: async (input) => {
            receivedInputs.push(input);
            return {
                id: "mongo-image-1",
                title: input.title,
                order: 0,
                secureUrl: STORED_IMAGE.secureUrl,
                format: STORED_IMAGE.format,
                bytes: STORED_IMAGE.bytes,
                width: STORED_IMAGE.width,
                height: STORED_IMAGE.height
            };
        }
    });
    const request = {
        auth: { userId: "authenticated-user" },
        body: { title: "My image", ownerId: "untrusted-owner", order: 999 },
        file: { buffer: PNG_SIGNATURE, mimetype: "image/png" }
    } as unknown as Request<ParamsDictionary, unknown, unknown>;

    await controller.handle(request, createResponse() as unknown as Response);

    assert.equal(receivedInputs.length, 1);
    assert.equal(receivedInputs[0].userId, "authenticated-user");
    assert.equal(receivedInputs[0].title, "My image");
    assert.equal("order" in receivedInputs[0], false);
});

test("unsupported image content is rejected before Cloudinary upload", async () => {
    const fixture = createFixture();

    await assert.rejects(
        fixture.useCase.execute(validInput({
            file: Buffer.from("not an image"),
            mimeType: "image/png"
        })),
        (error: unknown) => error instanceof AppError
            && error.statusCode === 400
            && error.message === "Unsupported image type"
    );
    assert.equal(fixture.uploadCalls.length, 0);
});

test("missing or overly long titles are rejected before Cloudinary upload", async () => {
    const fixture = createFixture();

    await assert.rejects(
        fixture.useCase.execute(validInput({ title: "  " })),
        (error: unknown) => error instanceof AppError && error.statusCode === 400
    );
    await assert.rejects(
        fixture.useCase.execute(validInput({ title: "x".repeat(MAX_IMAGE_TITLE_LENGTH + 1) })),
        (error: unknown) => error instanceof AppError && error.statusCode === 400
    );
    assert.equal(fixture.uploadCalls.length, 0);
    assert.equal(fixture.orderOwnerIds.length, 0);
});

test("files larger than the configured limit are rejected before Cloudinary upload", async () => {
    const fixture = createFixture();
    const oversizedPng = Buffer.alloc(MAX_IMAGE_SIZE_BYTES + 1);
    PNG_SIGNATURE.copy(oversizedPng);

    await assert.rejects(
        fixture.useCase.execute(validInput({ file: oversizedPng })),
        (error: unknown) => error instanceof AppError && error.statusCode === 413
    );
    assert.equal(fixture.uploadCalls.length, 0);
});

test("unauthenticated requests are rejected before image upload processing", () => {
    const request = { headers: {} } as Request;
    let forwardedError: unknown;
    const next: NextFunction = (error?: unknown) => {
        forwardedError = error;
    };

    authenticate(request, {} as Response, next);

    assert.ok(forwardedError instanceof AppError);
    assert.equal(forwardedError.statusCode, 401);
});

test("Cloudinary upload failures are propagated without attempting persistence", async () => {
    const storageFailure = new AppError("Failed to upload image", 502);
    const fixture = createFixture({ uploadFailure: storageFailure });

    await assert.rejects(fixture.useCase.execute(validInput()), (error: unknown) =>
        error === storageFailure
    );
    assert.equal(fixture.persistenceCalls.length, 0);
    assert.equal(fixture.deleteCalls.length, 0);
});

test("MongoDB persistence failures trigger Cloudinary cleanup and preserve the error", async () => {
    const persistenceFailure = new Error("database detail that must not be replaced");
    const fixture = createFixture({ persistenceFailure });

    await assert.rejects(fixture.useCase.execute(validInput()), (error: unknown) =>
        error === persistenceFailure
    );
    assert.deepEqual(fixture.deleteCalls, [STORED_IMAGE.publicId]);
});

test("a missing saved ID triggers Cloudinary cleanup", async () => {
    const fixture = createFixture({ missingSavedId: true });

    await assert.rejects(
        fixture.useCase.execute(validInput()),
        (error: unknown) => error instanceof AppError
            && error.statusCode === 500
            && error.message === "Unable to save image metadata"
    );
    assert.deepEqual(fixture.deleteCalls, [STORED_IMAGE.publicId]);
});

test("cleanup failures are logged without replacing the persistence error", async () => {
    const persistenceFailure = new Error("original persistence failure");
    const cleanupFailure = new Error("provider response with sensitive details");
    const fixture = createFixture({ persistenceFailure, cleanupFailure });
    const logCalls: unknown[][] = [];
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]): void => {
        logCalls.push(args);
    };

    try {
        await assert.rejects(fixture.useCase.execute(validInput()), (error: unknown) =>
            error === persistenceFailure
        );
    } finally {
        console.error = originalConsoleError;
    }

    assert.deepEqual(fixture.deleteCalls, [STORED_IMAGE.publicId]);
    assert.deepEqual(logCalls, [[
        "Cloudinary cleanup failed after image metadata persistence failed."
    ]]);
});
