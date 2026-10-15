import type { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { AppError } from "../../Application/Errors/AppError";
import type { IJwtService } from "../../Application/Interfaces/Services/IJwtService";
import { SERVICE_TOKENS } from "../../Infrastructure/DI/Tokens/ServiceTokens";

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {

    try {
        const authorization = req.headers.authorization;
        const match = authorization?.match(/^Bearer +([^\s]+)$/i);

        if (!match) {
            next(new AppError("Unauthorized", 401));
            return;
        }

        const jwtService = container.resolve<IJwtService>(
            SERVICE_TOKENS.IJwtService
        );

        const user = jwtService.verifyAccessToken(match[1]);

        if (!user.userId) {
            next(new AppError("Unauthorized", 401));
            return;
        }

        req.auth = { userId: user.userId };

        next();
    } catch (error) {
        next(new AppError("Unauthorized", 401));
    }
};