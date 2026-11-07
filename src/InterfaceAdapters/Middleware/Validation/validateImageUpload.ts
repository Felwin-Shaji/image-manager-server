
import type { RequestHandler } from "express";
import { AppError } from "../../../Application/Errors/AppError";
import { STATUS_CODE } from "../../../Application/Constants/HttpStatusCode";
import { IMAGE_MESSAGES } from "../../../Application/Constants/Messages/ImageMessages";
import { MAX_IMAGE_COUNT, MAX_IMAGE_TITLE_LENGTH } from "../../../Application/Policies/ImageUploadPolicy";
import { validateImageMimeType } from "../../../Infrastructure/Utils/validateImageMimeType";

export const validateImageUpload: RequestHandler = async (
    req,
    _res,
    next,
): Promise<void> => {
    try {
        const files = req.files;

        if (!Array.isArray(files) || files.length === 0) {
            next(new AppError(IMAGE_MESSAGES.AT_LEAST_ONE_IMAGE_REQUIRED, STATUS_CODE.BAD_REQUEST));
            return;
        }

        if (files.length > MAX_IMAGE_COUNT) {
            next(
                new AppError(
                    IMAGE_MESSAGES.MAXIMUM_IMAGES_PER_REQUEST(MAX_IMAGE_COUNT),
                    STATUS_CODE.BAD_REQUEST,
                ),
            );
            return;
        }

        for (const file of files) {
            if (
                !Buffer.isBuffer(file.buffer) ||
                file.buffer.length === 0
            ) {
                next(new AppError(IMAGE_MESSAGES.IMAGE_FILE_INVALID, STATUS_CODE.BAD_REQUEST));
                return;
            }

            const isValidImage = await validateImageMimeType(
                file.buffer,
                file.mimetype,
            );

            if (!isValidImage) {
                next(new AppError(IMAGE_MESSAGES.UNSUPPORTED_IMAGE_TYPE, STATUS_CODE.BAD_REQUEST));
                return;
            }
        }

        const rawTitles: unknown = req.body?.titles;

        if (typeof rawTitles !== "string") {
            next(
                new AppError(
                    IMAGE_MESSAGES.TITLES_JSON_ARRAY_REQUIRED,
                    STATUS_CODE.BAD_REQUEST,
                ),
            );
            return;
        }

        let parsedTitles: unknown;

        try {
            parsedTitles = JSON.parse(rawTitles);
        } catch {
            next(new AppError(IMAGE_MESSAGES.INVALID_TITLES_JSON, STATUS_CODE.BAD_REQUEST));
            return;
        }

        if (
            !Array.isArray(parsedTitles) ||
            !parsedTitles.every(
                (title: unknown) => typeof title === "string",
            )
        ) {
            next(
                new AppError(
                    IMAGE_MESSAGES.TITLES_MUST_BE_STRINGS,
                    STATUS_CODE.BAD_REQUEST,
                ),
            );
            return;
        }

        if (parsedTitles.length !== files.length) {
            next(
                new AppError(
                    IMAGE_MESSAGES.TITLE_FOR_EACH_IMAGE_REQUIRED,
                    STATUS_CODE.BAD_REQUEST,
                ),
            );
            return;
        }

        const titles: string[] = [];

        for (const title of parsedTitles as string[]) {
            const normalizedTitle = title.trim();

            if (!normalizedTitle) {
                next(
                    new AppError(
                        IMAGE_MESSAGES.IMAGE_TITLES_CANNOT_BE_EMPTY,
                        STATUS_CODE.BAD_REQUEST,
                    ),
                );
                return;
            }

            if (normalizedTitle.length > MAX_IMAGE_TITLE_LENGTH) {
                next(
                    new AppError(
                        IMAGE_MESSAGES.IMAGE_TITLES_TOO_LONG(MAX_IMAGE_TITLE_LENGTH),
                        STATUS_CODE.BAD_REQUEST,
                    ),
                );
                return;
            }

            titles.push(normalizedTitle);
        }

        req.body.titles = titles;
        next();
    } catch (error: unknown) {
        next(error);
    }
};
