import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { IUploadImageUseCase } from "../../../Application/Interfaces/UseCases/IUploadImageUseCase";
import { BulkUploadImageRequestBody } from "../../../Application/DTOs/Images/UploadImageDTO";

export class UploadImageController {
    constructor(
        private readonly uploadImageUseCase: IUploadImageUseCase
    ) {}

    handle = async (
        req: Request<ParamsDictionary, unknown, BulkUploadImageRequestBody>,
        res: Response
    ): Promise<void> => {
        const files = req.files;

        if (!Array.isArray(files)) {
            throw new Error("Uploaded images are missing");
        }

        const result = await this.uploadImageUseCase.execute({
            userId: req.auth!.userId,
            images: files.map((file, index) => ({
                title: req.body.titles[index],
                file: file.buffer,
                mimeType: file.mimetype,
            })),
        });

        res.status(201).json({
            success: true,
            message: "Images uploaded successfully",
            data: result,
        });
    };
}