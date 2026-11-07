
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { UpdateImageTitleRequestBody } from "../../../Application/DTOs/Images/UpdateImageTitleDTO";
import type { IUpdateImageTitleUseCase } from "../../../Application/Interfaces/UseCases/IUpdateImageTitleUseCase";
import { AppError } from "../../../Application/Errors/AppError";
import { STATUS_CODE } from "../../../Application/Constants/HttpStatusCode";
import { IMAGE_MESSAGES } from "../../../Application/Constants/Messages/ImageMessages";

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
            throw new AppError(IMAGE_MESSAGES.VALID_IMAGE_ID_REQUIRED, STATUS_CODE.BAD_REQUEST);
        }

        const result = await this.updateImageTitleUseCase.execute({
            imageId,
            ownerId: req.auth!.userId,
            title: req.body.title,
        });

        res.status(STATUS_CODE.OK).json({
            success: true,
            message: IMAGE_MESSAGES.IMAGE_TITLE_UPDATE_SUCCESS,
            data: result,
        });
    };
}
