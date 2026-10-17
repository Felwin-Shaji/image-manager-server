import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../../Application/Errors/AppError";

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
            "A valid list of image IDs is required",
            400,
        );
    }

    if (new Set(imageIds).size !== imageIds.length) {
        throw new AppError(
            "Duplicate image IDs are not allowed",
            400,
        );
    }

    next();
};