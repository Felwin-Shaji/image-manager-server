
import { AppError } from "../../Errors/AppError";
import type { DeleteImageInputDTO } from "../../DTOs/Images/DeleteImageDTO";
import type { IImageRepository } from "../../Interfaces/Repositories/IImageRepository";
import type { IImageStorageService } from "../../Interfaces/Services/IImageStorageService";
import type { IDeleteImageUseCase } from "../../Interfaces/UseCases/IDeleteImageUseCase";

export class DeleteImageUseCase implements IDeleteImageUseCase {
    constructor(
        private readonly imageRepository: IImageRepository,
        private readonly imageStorageService: IImageStorageService,
    ) { }

    async execute(input: DeleteImageInputDTO): Promise<void> {
        const imageId = input.imageId.trim();
        const ownerId = input.ownerId.trim();

        if (!imageId) {
            throw new AppError("Image ID is required", 400);
        }

        if (!ownerId) {
            throw new AppError("Unable to identify image owner", 401);
        }

        const userImages =
            await this.imageRepository.findByOwnerId(ownerId);

        const existingImage = userImages.find(
            (image) => image.id === imageId,
        );

        if (!existingImage) {
            throw new AppError("Image not found", 404);
        }

        await this.imageRepository.deleteById(imageId, ownerId);

        try {
            await this.imageStorageService.delete(existingImage.publicId);
        } catch {
        }
    }
}
