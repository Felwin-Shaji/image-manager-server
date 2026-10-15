
import type { RequestHandler } from "express";
import multer from "multer";
import { AppError } from "../../Application/Errors/AppError";
import { MAX_IMAGE_COUNT, MAX_IMAGE_SIZE_BYTES } from "../../Application/Policies/ImageUploadPolicy";


const parseMultipartImages = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_IMAGE_SIZE_BYTES,
        files: MAX_IMAGE_COUNT,
        fields: 1,
        parts: MAX_IMAGE_COUNT + 1
    }
}).array("images", MAX_IMAGE_COUNT);

export const parseImageUpload: RequestHandler = (req, res, next): void => {
    parseMultipartImages(req, res, (error: unknown): void => {
        if (error === undefined || error === null) {
            next();
            return;
        }

        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                next(new AppError("An image exceeds the 5 MB size limit", 413));
                return;
            }

            if (
                error.code === "LIMIT_FILE_COUNT" ||
                error.code === "LIMIT_UNEXPECTED_FILE"
            ) {
                next(new AppError("Maximum 10 images are allowed per request", 400));
                return;
            }

            next(new AppError("Invalid multipart image upload", 400));
            return;
        }

        if (error instanceof AppError) {
            next(error);
            return;
        }

        next(new AppError("Invalid multipart image upload", 400));
    });
};
