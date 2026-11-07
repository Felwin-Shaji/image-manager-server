
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { LoginUserInputDTO } from "../../../Application/DTOs/Auth/LoginUserDTO";
import type { ILoginUserUseCase } from "../../../Application/Interfaces/UseCases/ILoginUserUseCase";
import { STATUS_CODE } from "../../../Application/Constants/HttpStatusCode";
import { AUTH_MESSAGES } from "../../../Application/Constants/Messages/AuthMessages";

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
            secure: true,
            sameSite: "none",
            path: "/api/auth",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(STATUS_CODE.OK).json({
            success: true,
            message: AUTH_MESSAGES.LOGIN_SUCCESS,
            data: {
                id: result.id,
                email: result.email,
                phone: result.phone,
                accessToken: result.accessToken,
            },
        });
    };
}
