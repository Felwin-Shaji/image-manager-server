
import type { RequestHandler } from "express";
import { AppError } from "../../../Application/Errors/AppError";
import { validateImageMimeType } from "../../../Infrastructure/Utils/validateImageMimeType";

export const validateImageReplacement: RequestHandler = async (
    req,
    _res,
    next,
): Promise<void> => {
    try {
        const file = req.file;

        if (!file) {
            next(
                new AppError(
                    'A replacement image is required in the "image" field',
                    400,
                ),
            );
            return;
        }

        if (
            !Buffer.isBuffer(file.buffer) ||
            file.buffer.length === 0
        ) {
            next(new AppError("Invalid or empty image file", 400));
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

        next();
    } catch (error: unknown) {
        next(error);
    }
};
