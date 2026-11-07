import { Request, Response } from "express";
import { IRegisterUserUseCase } from "../../../Application/Interfaces/UseCases/IRegisterUserUseCase";
import { STATUS_CODE } from "../../../Application/Constants/HttpStatusCode";
import { AUTH_MESSAGES } from "../../../Application/Constants/Messages/AuthMessages";

export class RegisterUserController {
    constructor(
        private readonly registerUserUseCase: IRegisterUserUseCase
    ) { }

    handle = async (req: Request, res: Response): Promise<void> => {

        const result = await this.registerUserUseCase.execute({
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        });



        res.status(STATUS_CODE.CREATED).json({
            success: true,
            message: AUTH_MESSAGES.USER_REGISTERED_SUCCESS,
            data: result
        });
    };
}
