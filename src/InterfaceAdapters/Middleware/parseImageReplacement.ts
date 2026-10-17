
import multer from "multer";
import type { RequestHandler } from "express";
import { AppError } from "../../Application/Errors/AppError";
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
                        `Image must not exceed ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB`,
                        400,
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
                        'Upload one replacement image using the "image" field',
                        400,
                    ),
                );
                return;
            }

            next(new AppError("Invalid image upload request", 400));
            return;
        }

        next(error);
    });
};
