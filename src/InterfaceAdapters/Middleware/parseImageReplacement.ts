
import multer from "multer";
import type { RequestHandler } from "express";
import { AppError } from "../../Application/Errors/AppError";
import { STATUS_CODE } from "../../Application/Constants/HttpStatusCode";
import { IMAGE_MESSAGES } from "../../Application/Constants/Messages/ImageMessages";
import { MAX_IMAGE_SIZE_BYTES } from "../../Application/Policies/ImageUploadPolicy";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_IMAGE_SIZE_BYTES,
        files: 1,
    },
});

export const parseImageReplacement: RequestHandler = (
    req,
    res,
    next,
): void => {
    upload.single("image")(req, res, (error: unknown) => {
        if (!error) {
            next();
            return;
        }

        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                next(
                    new AppError(
                        IMAGE_MESSAGES.IMAGE_SIZE_LIMIT(MAX_IMAGE_SIZE_BYTES / (1024 * 1024)),
                        STATUS_CODE.BAD_REQUEST,
                    ),
                );
                return;
            }

            if (
                error.code === "LIMIT_UNEXPECTED_FILE" ||
                error.code === "LIMIT_FILE_COUNT"
            ) {
                next(
                    new AppError(
                        IMAGE_MESSAGES.UPLOAD_ONE_REPLACEMENT_IMAGE,
                        STATUS_CODE.BAD_REQUEST,
                    ),
                );
                return;
            }

            next(new AppError(IMAGE_MESSAGES.INVALID_IMAGE_UPLOAD_REQUEST, STATUS_CODE.BAD_REQUEST));
            return;
        }

        next(error);
    });
};
