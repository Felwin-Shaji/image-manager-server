
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { AppError } from "../../../Application/Errors/AppError";
import type { IDeleteImageUseCase } from "../../../Application/Interfaces/UseCases/IDeleteImageUseCase";

export class DeleteImageController {
    constructor(
        private readonly deleteImageUseCase: IDeleteImageUseCase,
    ) { }

    handle = async (
        req: Request<ParamsDictionary>,
        res: Response,
    ): Promise<void> => {
        const imageId = req.params.id;

        if (typeof imageId !== "string" || !imageId.trim()) {
            throw new AppError("Valid image ID is required", 400);
        }

        await this.deleteImageUseCase.execute({
            imageId: imageId.trim(),
            ownerId: req.auth!.userId,
        });

        res.status(200).json({
            success: true,
            message: "Image deleted successfully",
        });
    };
}
