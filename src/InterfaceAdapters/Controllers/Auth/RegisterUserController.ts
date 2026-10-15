import { Request, Response } from "express";
import { IRegisterUserUseCase } from "../../../Application/Interfaces/UseCases/IRegisterUserUseCase";

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



        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        });
    };
}