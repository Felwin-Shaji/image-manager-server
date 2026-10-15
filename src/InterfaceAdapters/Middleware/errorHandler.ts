import { ErrorRequestHandler } from "express";
import { AppError } from "../../Application/Errors/AppError";

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

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};