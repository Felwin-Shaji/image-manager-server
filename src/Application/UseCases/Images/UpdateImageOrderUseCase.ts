import { AppError } from "../../Errors/AppError";
import type { UpdateImageOrderInputDTO } from "../../DTOs/Images/UpdateImageOrderDTO";
import type { IImageRepository } from "../../Interfaces/Repositories/IImageRepository";
import type { IUpdateImageOrderUseCase } from "../../Interfaces/UseCases/IUpdateImageOrderUseCase";

export class UpdateImageOrderUseCase implements IUpdateImageOrderUseCase {
    constructor(
        private readonly imageRepository: IImageRepository,
    ) { }

    async execute(input: UpdateImageOrderInputDTO): Promise<void> {
        const ownerId = input.ownerId.trim();
        if (!ownerId) throw new AppError("Unable to identify image owner", 401);


        if (
            !Array.isArray(input.imageOrders) ||
            input.imageOrders.length === 0
        ) {
            throw new AppError("Image order must not be empty", 400);
        }

        const imageIds = input.imageOrders.map((item) => item.imageId);

        if (
            imageIds.some((id) => typeof id !== "string" || !id.trim()) ||
            new Set(imageIds).size !== imageIds.length
        ) {
            throw new AppError(
                "Image IDs must be valid and unique",
                400,
            );
        }

        const orders = input.imageOrders.map((item) => item.order);

        if (
            orders.some((order) => !Number.isInteger(order) || order < 0,) ||
            new Set(orders).size !== orders.length
        ) {
            throw new AppError(
                "Image positions must be unique non-negative integers",
                400,
            );
        }

        const userImages = await this.imageRepository.findByOwnerId(ownerId);

        if (
            userImages.length !== imageIds.length ||
            !userImages.every((image) => image.id !== null && imageIds.includes(image.id))
        ) {
            throw new AppError(
                "The submitted order must contain all your images",
                400,
            );
        }

        await this.imageRepository.updateImageOrder(
            ownerId,
            input.imageOrders,
        );
    }
}