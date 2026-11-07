
import type { RequestHandler } from "express";
import multer from "multer";
import { AppError } from "../../Application/Errors/AppError";
import { STATUS_CODE } from "../../Application/Constants/HttpStatusCode";
import { IMAGE_MESSAGES } from "../../Application/Constants/Messages/ImageMessages";
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
                next(
                    new AppError(
                        IMAGE_MESSAGES.AN_IMAGE_SIZE_EXCEEDED(
                            MAX_IMAGE_SIZE_BYTES / (1024 * 1024),
                        ),
                        STATUS_CODE.PAYLOAD_TOO_LARGE,
                    ),
                );
                return;
            }

            if (
                error.code === "LIMIT_FILE_COUNT" ||
                error.code === "LIMIT_UNEXPECTED_FILE"
            ) {
                next(
                    new AppError(
                        IMAGE_MESSAGES.MAXIMUM_IMAGES_PER_REQUEST(MAX_IMAGE_COUNT),
                        STATUS_CODE.BAD_REQUEST,
                    ),
                );
                return;
            }

            next(new AppError(IMAGE_MESSAGES.INVALID_MULTIPART_UPLOAD, STATUS_CODE.BAD_REQUEST));
            return;
        }

        if (error instanceof AppError) {
            next(error);
            return;
        }

        next(new AppError(IMAGE_MESSAGES.INVALID_MULTIPART_UPLOAD, STATUS_CODE.BAD_REQUEST));
    });
};
