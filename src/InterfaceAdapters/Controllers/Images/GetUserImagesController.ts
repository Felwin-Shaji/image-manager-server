import type { Request, Response } from "express";
import type { IGetUserImagesUseCase } from "../../../Application/Interfaces/UseCases/IGetUserImagesUseCase";

export class GetUserImagesController {
    constructor(
        private readonly getUserImagesUseCase: IGetUserImagesUseCase,
    ) { }

    handle = async (req: Request, res: Response): Promise<void> => {
        const result = await this.getUserImagesUseCase.execute(
            req.auth!.userId,
        );

        res.status(200).json({
            success: true,
            message: "Images retrieved successfully",
            data: result,
        });
    };
}