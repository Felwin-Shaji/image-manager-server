
import type { Request, Response } from "express";
import type { IRefreshTokenUseCase } from "../../../Application/Interfaces/UseCases/IRefreshTokenUseCase";

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
            res.status(401).json({
                success: false,
                message: "Refresh token is required",
            });
            return;
        }

        const result = await this.refreshTokenUseCase.execute(refreshToken);

        res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: result,
        });
    };
}
