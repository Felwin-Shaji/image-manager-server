
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { AppError } from "../../../Application/Errors/AppError";
import { IReplaceImageUseCase } from "../../../Application/Interfaces/UseCases/IReplaceImageUseCase";
import { STATUS_CODE } from "../../../Application/Constants/HttpStatusCode";
import { IMAGE_MESSAGES } from "../../../Application/Constants/Messages/ImageMessages";

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
            throw new AppError(IMAGE_MESSAGES.VALID_IMAGE_ID_REQUIRED, STATUS_CODE.BAD_REQUEST);
        }

        const file = req.file;

        if (!file) {
            throw new AppError(IMAGE_MESSAGES.REPLACEMENT_IMAGE_REQUIRED, STATUS_CODE.BAD_REQUEST);
        }

        const result = await this.replaceImageUseCase.execute({
            imageId: imageId.trim(),
            ownerId: req.auth!.userId,
            file: file.buffer,
            mimeType: file.mimetype,
        });

        res.status(STATUS_CODE.OK).json({
            success: true,
            message: IMAGE_MESSAGES.IMAGE_REPLACE_SUCCESS,
            data: result,
        });
    };
}
