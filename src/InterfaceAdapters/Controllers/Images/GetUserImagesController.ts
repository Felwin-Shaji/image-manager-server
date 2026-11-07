import type { Request, Response } from "express";
import type { IGetUserImagesUseCase } from "../../../Application/Interfaces/UseCases/IGetUserImagesUseCase";
import { STATUS_CODE } from "../../../Application/Constants/HttpStatusCode";
import { IMAGE_MESSAGES } from "../../../Application/Constants/Messages/ImageMessages";

export class GetUserImagesController {
    constructor(
        private readonly getUserImagesUseCase: IGetUserImagesUseCase,
    ) { }

    handle = async (req: Request, res: Response): Promise<void> => {
        const result = await this.getUserImagesUseCase.execute(
            req.auth!.userId,
        );

        res.status(STATUS_CODE.OK).json({
            success: true,
            message: IMAGE_MESSAGES.IMAGES_RETRIEVED_SUCCESS,
            data: result,
        });
    };
}
