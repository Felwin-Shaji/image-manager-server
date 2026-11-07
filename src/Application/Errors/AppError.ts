import { STATUS_CODE } from "../Constants/HttpStatusCode";

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: unknown;

    constructor(
        message: string,
        statusCode: number = STATUS_CODE.INTERNAL_SERVER_ERROR,
        isOperational = true,
        details?: unknown
    ) {
        super(message);

        this.name = "AppError";
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
