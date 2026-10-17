
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { AppError } from "../../../Application/Errors/AppError";
import { IReplaceImageUseCase } from "../../../Application/Interfaces/UseCases/IReplaceImageUseCase";

export class ReplaceImageController {
    constructor(
        private readonly replaceImageUseCase: IReplaceImageUseCase,
    ) {}

    handle = async (
        req: Request<ParamsDictionary>,
        res: Response,
    ): Promise<void> => {
        const imageId = req.params.id;

        if (typeof imageId !== "string" || !imageId.trim()) {
            throw new AppError("Valid image ID is required", 400);
        }

        const file = req.file;

        if (!file) {
            throw new AppError("Replacement image is required", 400);
        }

        const result = await this.replaceImageUseCase.execute({
            imageId: imageId.trim(),
            ownerId: req.auth!.userId,
            file: file.buffer,
            mimeType: file.mimetype,
        });

        res.status(200).json({
            success: true,
            message: "Image replaced successfully",
            data: result,
        });
    };
}
