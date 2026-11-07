
import type { RequestHandler } from "express";
import { AppError } from "../../../Application/Errors/AppError";
import { STATUS_CODE } from "../../../Application/Constants/HttpStatusCode";
import { IMAGE_MESSAGES } from "../../../Application/Constants/Messages/ImageMessages";
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
                    IMAGE_MESSAGES.REPLACEMENT_IMAGE_FIELD_REQUIRED,
                    STATUS_CODE.BAD_REQUEST,
                ),
            );
            return;
        }

        if (
            !Buffer.isBuffer(file.buffer) ||
            file.buffer.length === 0
        ) {
            next(new AppError(IMAGE_MESSAGES.IMAGE_FILE_EMPTY_OR_INVALID, STATUS_CODE.BAD_REQUEST));
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

        next();
    } catch (error: unknown) {
        next(error);
    }
};
