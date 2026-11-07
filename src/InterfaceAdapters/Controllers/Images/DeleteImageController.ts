
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { AppError } from "../../../Application/Errors/AppError";
import type { IDeleteImageUseCase } from "../../../Application/Interfaces/UseCases/IDeleteImageUseCase";
import { STATUS_CODE } from "../../../Application/Constants/HttpStatusCode";
import { IMAGE_MESSAGES } from "../../../Application/Constants/Messages/ImageMessages";

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
            throw new AppError(IMAGE_MESSAGES.VALID_IMAGE_ID_REQUIRED, STATUS_CODE.BAD_REQUEST);
        }

        await this.deleteImageUseCase.execute({
            imageId: imageId.trim(),
            ownerId: req.auth!.userId,
        });

        res.status(STATUS_CODE.OK).json({
            success: true,
            message: IMAGE_MESSAGES.IMAGE_DELETE_SUCCESS,
        });
    };
}
