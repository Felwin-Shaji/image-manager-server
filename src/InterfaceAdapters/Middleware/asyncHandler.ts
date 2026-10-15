import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

type AsyncController<TBody> = (
    req: Request<ParamsDictionary, unknown, TBody>,
    res: Response,
    next: NextFunction
) => Promise<void>;

export const asyncHandler = <TBody = unknown>(
    controller: AsyncController<TBody>
): RequestHandler<ParamsDictionary, unknown, TBody> => {
    return (req, res, next): void => {
        Promise.resolve(controller(req, res, next)).catch(next);
    };
};