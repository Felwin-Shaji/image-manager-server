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

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    };
}
