
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { LoginUserInputDTO } from "../../../Application/DTOs/Auth/LoginUserDTO";
import type { ILoginUserUseCase } from "../../../Application/Interfaces/UseCases/ILoginUserUseCase";

export class LoginUserController {
    constructor(
        private readonly loginUserUseCase: ILoginUserUseCase
    ) { }

    handle = async (
        req: Request<ParamsDictionary, unknown, LoginUserInputDTO>,
        res: Response
    ): Promise<void> => {
        const result = await this.loginUserUseCase.execute(req.body);

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/api/auth",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: result.id,
                email: result.email,
                phone: result.phone,
                accessToken: result.accessToken,
            },
        });
    };
}
