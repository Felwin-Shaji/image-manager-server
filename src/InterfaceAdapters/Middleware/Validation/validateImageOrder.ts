import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../../Application/Errors/AppError";
import { STATUS_CODE } from "../../../Application/Constants/HttpStatusCode";
import { IMAGE_MESSAGES } from "../../../Application/Constants/Messages/ImageMessages";

interface UpdateImageOrderRequestBody {
    imageIds: string[];
}

export const validateImageOrder = (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    const body = req.body as Partial<UpdateImageOrderRequestBody>;
    const { imageIds } = body;

    if (
        !Array.isArray(imageIds) ||
        imageIds.length === 0 ||
        imageIds.some(
            (id) => typeof id !== "string" || !id.trim(),
        )
    ) {
        throw new AppError(
            IMAGE_MESSAGES.VALID_IMAGE_IDS_REQUIRED,
            STATUS_CODE.BAD_REQUEST,
        );
    }

    if (new Set(imageIds).size !== imageIds.length) {
        throw new AppError(
            IMAGE_MESSAGES.DUPLICATE_IMAGE_IDS,
            STATUS_CODE.BAD_REQUEST,
        );
    }

    next();
};
