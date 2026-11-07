import { AppError } from "../../Errors/AppError";
import { STATUS_CODE } from "../../Constants/HttpStatusCode";
import { COMMON_MESSAGES } from "../../Constants/Messages/CommonMessages";
import { IMAGE_MESSAGES } from "../../Constants/Messages/ImageMessages";
import type { UpdateImageOrderInputDTO } from "../../DTOs/Images/UpdateImageOrderDTO";
import type { IImageRepository } from "../../Interfaces/Repositories/IImageRepository";
import type { IUpdateImageOrderUseCase } from "../../Interfaces/UseCases/IUpdateImageOrderUseCase";

export class UpdateImageOrderUseCase implements IUpdateImageOrderUseCase {
    constructor(
        private readonly imageRepository: IImageRepository,
    ) { }

    async execute(input: UpdateImageOrderInputDTO): Promise<void> {
        const ownerId = input.ownerId.trim();
        if (!ownerId) throw new AppError(COMMON_MESSAGES.UNABLE_TO_IDENTIFY_IMAGE_OWNER, STATUS_CODE.UNAUTHORIZED);


        if (
            !Array.isArray(input.imageOrders) ||
            input.imageOrders.length === 0
        ) {
            throw new AppError(IMAGE_MESSAGES.IMAGE_ORDER_REQUIRED, STATUS_CODE.BAD_REQUEST);
        }

        const imageIds = input.imageOrders.map((item) => item.imageId);

        if (
            imageIds.some((id) => typeof id !== "string" || !id.trim()) ||
            new Set(imageIds).size !== imageIds.length
        ) {
            throw new AppError(
                IMAGE_MESSAGES.IMAGE_IDS_MUST_BE_VALID_AND_UNIQUE,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        const orders = input.imageOrders.map((item) => item.order);

        if (
            orders.some((order) => !Number.isInteger(order) || order < 0,) ||
            new Set(orders).size !== orders.length
        ) {
            throw new AppError(
                IMAGE_MESSAGES.IMAGE_POSITIONS_MUST_BE_UNIQUE,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        const userImages = await this.imageRepository.findByOwnerId(ownerId);

        if (
            userImages.length !== imageIds.length ||
            !userImages.every((image) => image.id !== null && imageIds.includes(image.id))
        ) {
            throw new AppError(
                IMAGE_MESSAGES.ORDER_MUST_INCLUDE_ALL_IMAGES,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        await this.imageRepository.updateImageOrder(
            ownerId,
            input.imageOrders,
        );
    }
}
