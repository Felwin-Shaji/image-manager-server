
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { UpdateImageTitleRequestBody } from "../../../Application/DTOs/Images/UpdateImageTitleDTO";
import type { IUpdateImageTitleUseCase } from "../../../Application/Interfaces/UseCases/IUpdateImageTitleUseCase";
import { AppError } from "../../../Application/Errors/AppError";

export class UpdateImageTitleController {
    constructor(
        private readonly updateImageTitleUseCase: IUpdateImageTitleUseCase,
    ) { }

    handle = async (
        req: Request<ParamsDictionary, unknown, UpdateImageTitleRequestBody>,
        res: Response,
    ): Promise<void> => {
        const imageId = req.params.id;
        
        if (typeof imageId !== "string" || !imageId.trim()) {
            throw new AppError("Valid image ID is required", 400);
        }

        const result = await this.updateImageTitleUseCase.execute({
            imageId,
            ownerId: req.auth!.userId,
            title: req.body.title,
        });

        res.status(200).json({
            success: true,
            message: "Image title updated successfully",
            data: result,
        });
    };
}
