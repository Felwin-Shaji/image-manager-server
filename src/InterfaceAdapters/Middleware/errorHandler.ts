import { ErrorRequestHandler } from "express";
import { AppError } from "../../Application/Errors/AppError";
import { STATUS_CODE } from "../../Application/Constants/HttpStatusCode";
import { COMMON_MESSAGES } from "../../Application/Constants/Messages/CommonMessages";

export const errorHandler: ErrorRequestHandler = (
    err: unknown,
    _req,
    res,
    _next
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.details !== undefined && {
                details: err.details
            })
        });
        return;
    }

    console.error("Unexpected error:", err);

    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: COMMON_MESSAGES.INTERNAL_SERVER_ERROR
    });
};
