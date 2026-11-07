import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { AppError } from "../../../Application/Errors/AppError";
import { STATUS_CODE } from "../../../Application/Constants/HttpStatusCode";
import { COMMON_MESSAGES } from "../../../Application/Constants/Messages/CommonMessages";

export type RequestBodyValidator<TBody> = (body: unknown) => body is TBody;

export const validateRequestBody = <TBody>(
    isValidBody: RequestBodyValidator<TBody>,
    errorMessage = COMMON_MESSAGES.INVALID_REQUEST_BODY
): RequestHandler<ParamsDictionary, unknown, TBody> => {
    return (req, _res, next): void => {
        const body: unknown = req.body;

        if (!isValidBody(body)) {
            next(new AppError(errorMessage, STATUS_CODE.BAD_REQUEST));
            return;
        }

        req.body = body;
        next();
    };
};
