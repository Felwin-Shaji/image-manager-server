import assert from "node:assert/strict";
import test from "node:test";
import "reflect-metadata";
import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { container } from "tsyringe";

import { AppError } from "../src/Application/Errors/AppError";
import type { LoginUserInputDTO, LoginUserOutputDTO } from "../src/Application/DTOs/Auth/LoginUserDTO";
import type { IUserRepository } from "../src/Application/Interfaces/Repositories/IUserRepository";
import type { IJwtService } from "../src/Application/Interfaces/Services/IJwtService";
import type { IPasswordService } from "../src/Application/Interfaces/Services/IPasswordService";
import type { ILoginUserUseCase } from "../src/Application/Interfaces/UseCases/ILoginUserUseCase";
import { RegisterUserUseCase } from "../src/Application/UseCases/Auth/RegisterUserUseCase";
import { LoginUserUseCase } from "../src/Application/UseCases/Auth/LoginUserUseCase";
import { User } from "../src/Domain/Entities/User";
import { LoginUserController } from "../src/InterfaceAdapters/Controllers/Auth/LoginUserController";
import { errorHandler } from "../src/InterfaceAdapters/Middleware/errorHandler";
import { validateLoginRequest } from "../src/InterfaceAdapters/Middleware/Validation/validateLoginRequest";
import { ControllerRegistry } from "../src/Infrastructure/DI/ControllerRegistry";
import { CONTROLLER_TOKENS } from "../src/Infrastructure/DI/Tokens/ControllerTokens";
import { REPOSITORY_TOKENS } from "../src/Infrastructure/DI/Tokens/RepositoryTokens";
import { SERVICE_TOKENS } from "../src/Infrastructure/DI/Tokens/ServiceTokens";
import { USECASE_TOKENS } from "../src/Infrastructure/DI/Tokens/UseCaseTokens";
import { UseCaseRegistry } from "../src/Infrastructure/DI/UseCaseRegistry";

interface LoginFixture {
    useCase: LoginUserUseCase;
    findByEmailCalls: string[];
    hashCalls: string[];
    compareCalls: Array<{ password: string; hashedPassword: string }>;
    accessTokenCalls: string[];
    refreshTokenCalls: string[];
}

interface MockResponse {
    statusCode: number;
    jsonBody: unknown;
    status(code: number): MockResponse;
    json(body: unknown): MockResponse;
}

interface ValidationResult {
    request: Request<ParamsDictionary, unknown, LoginUserInputDTO>;
    error: unknown;
}

const makeUser = (id: string | null = "user-123"): User => new User({
    id,
    email: "person@example.com",
    phone: "555-0100",
    password: "stored-password-hash"
});

const createFixture = (
    user: User | null = makeUser(),
    passwordMatches = true
): LoginFixture => {
    const findByEmailCalls: string[] = [];
    const hashCalls: string[] = [];
    const compareCalls: Array<{ password: string; hashedPassword: string }> = [];
    const accessTokenCalls: string[] = [];
    const refreshTokenCalls: string[] = [];

    const userRepository: IUserRepository = {
        create: async (newUser) => newUser,
        findByEmail: async (email) => {
            findByEmailCalls.push(email);
            return user;
        },
        findById: async () => null,
        existsByEmail: async () => false
    };

    const passwordService: IPasswordService = {
        hash: async (password) => {
            hashCalls.push(password);
            return `hash:${password}`;
        },
        compare: async (password, hashedPassword) => {
            compareCalls.push({ password, hashedPassword });
            return passwordMatches;
        }
    };

    const jwtService: IJwtService = {
        generateAccessToken: (userId) => {
            accessTokenCalls.push(userId);
            return `access:${userId}`;
        },
        generateRefreshToken: (userId) => {
            refreshTokenCalls.push(userId);
            return `refresh:${userId}`;
        },
        verifyAccessToken: (token) => ({ userId: token }),
        verifyRefreshToken: (token) => ({ userId: token })
    };

    return {
        useCase: new LoginUserUseCase(userRepository, passwordService, jwtService),
        findByEmailCalls,
        hashCalls,
        compareCalls,
        accessTokenCalls,
        refreshTokenCalls
    };
};

const createRequest = (
    body: unknown
): Request<ParamsDictionary, unknown, LoginUserInputDTO> =>
    ({ body } as unknown as Request<ParamsDictionary, unknown, LoginUserInputDTO>);

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

const validateLoginBody = (body: unknown): ValidationResult => {
    const request = createRequest(body);
    let validationError: unknown;
    const next: NextFunction = (error?: unknown) => {
        validationError = error;
    };

    validateLoginRequest(request, createResponse() as unknown as Response, next);

    return { request, error: validationError };
};

test("successful login returns the flat safe output DTO and generates both tokens", async () => {
    const fixture = createFixture();
    const result = await fixture.useCase.execute({
        email: "  PERSON@Example.com ",
        password: "plain-password"
    });

    assert.deepEqual(fixture.findByEmailCalls, ["person@example.com"]);
    assert.deepEqual(fixture.compareCalls, [{
        password: "plain-password",
        hashedPassword: "stored-password-hash"
    }]);
    assert.deepEqual(fixture.hashCalls, []);
    assert.deepEqual(fixture.accessTokenCalls, ["user-123"]);
    assert.deepEqual(fixture.refreshTokenCalls, ["user-123"]);
    assert.deepEqual(result, {
        id: "user-123",
        email: "person@example.com",
        phone: "555-0100",
        accessToken: "access:user-123",
        refreshToken: "refresh:user-123"
    });
    assert.equal("password" in result, false);
    assert.equal("passwordHash" in result, false);
});

test("unknown email returns the generic authentication error without comparing a password", async () => {
    const fixture = createFixture(null);

    await assert.rejects(
        fixture.useCase.execute({ email: "person@example.com", password: "wrong" }),
        (error: unknown) => error instanceof AppError
            && error.statusCode === 401
            && error.message === "Invalid email or password"
    );
    assert.equal(fixture.compareCalls.length, 0);
    assert.equal(fixture.accessTokenCalls.length, 0);
    assert.equal(fixture.refreshTokenCalls.length, 0);
});

test("incorrect password returns the same generic authentication error", async () => {
    const fixture = createFixture(makeUser(), false);

    await assert.rejects(
        fixture.useCase.execute({ email: "person@example.com", password: "wrong" }),
        (error: unknown) => error instanceof AppError
            && error.statusCode === 401
            && error.message === "Invalid email or password"
    );
    assert.equal(fixture.accessTokenCalls.length, 0);
    assert.equal(fixture.refreshTokenCalls.length, 0);
});

test("controller passes the validated body and returns the use-case DTO without mapping it", async () => {
    const input: LoginUserInputDTO = {
        email: "person@example.com",
        password: "plain-password"
    };
    const validation = validateLoginBody(input);
    assert.equal(validation.error, undefined);

    const output: LoginUserOutputDTO = {
        id: "user-123",
        email: "person@example.com",
        phone: "555-0100",
        accessToken: "access-token",
        refreshToken: "refresh-token"
    };
    let receivedInput: LoginUserInputDTO | undefined;
    const useCase: ILoginUserUseCase = {
        execute: async (request) => {
            receivedInput = request;
            return output;
        }
    };
    const controller = new LoginUserController(useCase);
    const response = createResponse();

    await controller.handle(validation.request, response as unknown as Response);

    assert.strictEqual(receivedInput, input);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.jsonBody, {
        success: true,
        message: "Login successful",
        data: output
    });
    const responseBody = response.jsonBody as { data: unknown };
    assert.strictEqual(responseBody.data, output);
    assert.equal(JSON.stringify(response.jsonBody).includes("password"), false);
});

test("validation rejects invalid fields and non-object bodies with HTTP 400 before the use case", async () => {
    let useCaseCalls = 0;
    const useCase: ILoginUserUseCase = {
        execute: async () => {
            useCaseCalls += 1;
            return {
                id: "user-123",
                email: "person@example.com",
                phone: "555-0100",
                accessToken: "access-token",
                refreshToken: "refresh-token"
            };
        }
    };
    const controller = new LoginUserController(useCase);
    const invalidBodies: unknown[] = [
        null,
        [],
        "not-an-object",
        {},
        { email: "not-an-email", password: "secret" },
        { email: "person@example.com" },
        { email: "person@example.com", password: "" }
    ];

    for (const body of invalidBodies) {
        const validation = validateLoginBody(body);
        assert.ok(validation.error instanceof AppError);

        const response = createResponse();
        errorHandler(
            validation.error,
            validation.request,
            response as unknown as Response,
            (() => undefined) as NextFunction
        );
        assert.equal(response.statusCode, 400);

        if (validation.error === undefined) {
            await controller.handle(validation.request, response as unknown as Response);
        }
    }

    assert.equal(useCaseCalls, 0);
});

test("registration continues normalizing and hashing passwords with a safe output", async () => {
    const createdUsers: User[] = [];
    const hashCalls: string[] = [];
    const userRepository: IUserRepository = {
        create: async (user) => {
            const createdUser = new User({
                id: "new-user",
                email: user.email,
                phone: user.phone,
                password: user.password
            });
            createdUsers.push(createdUser);
            return createdUser;
        },
        findByEmail: async () => null,
        findById: async () => null,
        existsByEmail: async () => false
    };
    const passwordService: IPasswordService = {
        hash: async (password) => {
            hashCalls.push(password);
            return `hash:${password}`;
        },
        compare: async () => false
    };
    const useCase = new RegisterUserUseCase(userRepository, passwordService);

    const result = await useCase.execute({
        email: "  PERSON@Example.com ",
        phone: " 555-0100 ",
        password: "plain-password"
    });

    assert.deepEqual(hashCalls, ["plain-password"]);
    assert.equal(createdUsers[0].email, "person@example.com");
    assert.equal(createdUsers[0].phone, "555-0100");
    assert.equal(createdUsers[0].password, "hash:plain-password");
    assert.deepEqual(result, {
        id: "new-user",
        email: "person@example.com",
        phone: "555-0100"
    });
    assert.equal("password" in result, false);
});

test("dependency registries resolve the login controller without missing tokens", () => {
    container.reset();

    const userRepository: IUserRepository = {
        create: async (user) => user,
        findByEmail: async () => null,
        findById: async () => null,
        existsByEmail: async () => false
    };
    const passwordService: IPasswordService = {
        hash: async (password) => `hash:${password}`,
        compare: async () => false
    };
    const jwtService: IJwtService = {
        generateAccessToken: () => "access-token",
        generateRefreshToken: () => "refresh-token",
        verifyAccessToken: (token) => ({ userId: token }),
        verifyRefreshToken: (token) => ({ userId: token })
    };

    try {
        container.register<IUserRepository>(REPOSITORY_TOKENS.IUserRepository, { useValue: userRepository });
        container.register<IPasswordService>(SERVICE_TOKENS.IPasswordService, { useValue: passwordService });
        container.register<IJwtService>(SERVICE_TOKENS.IJwtService, { useValue: jwtService });

        UseCaseRegistry.register();
        ControllerRegistry.register();

        assert.ok(container.isRegistered(USECASE_TOKENS.ILoginUserUseCase));
        assert.ok(container.isRegistered(CONTROLLER_TOKENS.LoginUserController));
        assert.ok(container.resolve<LoginUserController>(CONTROLLER_TOKENS.LoginUserController));
    } finally {
        container.reset();
    }
});
