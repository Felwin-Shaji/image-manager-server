import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { AppError } from "../../../Application/Errors/AppError";

export type RequestBodyValidator<TBody> = (body: unknown) => body is TBody;

export const validateRequestBody = <TBody>(
    isValidBody: RequestBodyValidator<TBody>,
    errorMessage = "Invalid request body"
): RequestHandler<ParamsDictionary, unknown, TBody> => {
    return (req, _res, next): void => {
        const body: unknown = req.body;

        if (!isValidBody(body)) {
            next(new AppError(errorMessage, 400));
            return;
        }

        req.body = body;
        next();
    };
};
