import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { IUpdateImageOrderUseCase } from "../../../Application/Interfaces/UseCases/IUpdateImageOrderUseCase";
import { STATUS_CODE } from "../../../Application/Constants/HttpStatusCode";
import { IMAGE_MESSAGES } from "../../../Application/Constants/Messages/ImageMessages";

interface UpdateImageOrderRequestBody {
    imageIds: string[];
}

export class UpdateImageOrderController {
    constructor(
        private readonly updateImageOrderUseCase: IUpdateImageOrderUseCase,
    ) { }

    handle = async (
        req: Request<ParamsDictionary, unknown, UpdateImageOrderRequestBody>,
        res: Response,
    ): Promise<void> => {
        const { imageIds } = req.body;

        await this.updateImageOrderUseCase.execute({
            ownerId: req.auth!.userId,
            imageOrders: imageIds.map((imageId, index) => ({
                imageId,
                order: index,
            })),
        });

        res.status(STATUS_CODE.OK).json({
            success: true,
            message: IMAGE_MESSAGES.IMAGE_ORDER_UPDATE_SUCCESS,
        });
    };
}
