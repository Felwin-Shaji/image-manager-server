
import type { Request, Response } from "express";
import type { IRefreshTokenUseCase } from "../../../Application/Interfaces/UseCases/IRefreshTokenUseCase";
import { STATUS_CODE } from "../../../Application/Constants/HttpStatusCode";
import { AUTH_MESSAGES } from "../../../Application/Constants/Messages/AuthMessages";

export class RefreshTokenController {
    constructor(
        private readonly refreshTokenUseCase: IRefreshTokenUseCase,
    ) { }

    handle = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const refreshToken = req.cookies?.refreshToken;

        if (typeof refreshToken !== "string" || !refreshToken) {
            res.status(STATUS_CODE.UNAUTHORIZED).json({
                success: false,
                message: AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED,
            });
            return;
        }

        const result = await this.refreshTokenUseCase.execute(refreshToken);

        res.status(STATUS_CODE.OK).json({
            success: true,
            message: AUTH_MESSAGES.TOKEN_REFRESH_SUCCESS,
            data: result,
        });
    };
}
