
import type { RequestHandler } from "express";
import { AppError } from "../../../Application/Errors/AppError";
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
            next(new AppError("At least one image is required", 400));
            return;
        }

        if (files.length > MAX_IMAGE_COUNT) {
            next(
                new AppError(
                    `Maximum ${MAX_IMAGE_COUNT} images are allowed per request`,
                    400,
                ),
            );
            return;
        }

        for (const file of files) {
            if (
                !Buffer.isBuffer(file.buffer) ||
                file.buffer.length === 0
            ) {
                next(new AppError("Invalid image file", 400));
                return;
            }

            const isValidImage = await validateImageMimeType(
                file.buffer,
                file.mimetype,
            );

            if (!isValidImage) {
                next(new AppError("Unsupported image type", 400));
                return;
            }
        }

        const rawTitles: unknown = req.body?.titles;

        if (typeof rawTitles !== "string") {
            next(
                new AppError(
                    "Titles must be provided as a JSON array",
                    400,
                ),
            );
            return;
        }

        let parsedTitles: unknown;

        try {
            parsedTitles = JSON.parse(rawTitles);
        } catch {
            next(new AppError("Invalid titles JSON format", 400));
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
                    "Titles must be an array of strings",
                    400,
                ),
            );
            return;
        }

        if (parsedTitles.length !== files.length) {
            next(
                new AppError(
                    "Each image must have exactly one title",
                    400,
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
                        "Image titles cannot be empty",
                        400,
                    ),
                );
                return;
            }

            if (normalizedTitle.length > MAX_IMAGE_TITLE_LENGTH) {
                next(
                    new AppError(
                        `Image titles must not exceed ${MAX_IMAGE_TITLE_LENGTH} characters`,
                        400,
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
