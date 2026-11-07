
import { AppError } from "../../Errors/AppError";
import { STATUS_CODE } from "../../Constants/HttpStatusCode";
import { COMMON_MESSAGES } from "../../Constants/Messages/CommonMessages";
import { IMAGE_MESSAGES } from "../../Constants/Messages/ImageMessages";
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
            throw new AppError(IMAGE_MESSAGES.IMAGE_ID_REQUIRED, STATUS_CODE.BAD_REQUEST);
        }

        if (!ownerId) {
            throw new AppError(COMMON_MESSAGES.UNABLE_TO_IDENTIFY_IMAGE_OWNER, STATUS_CODE.UNAUTHORIZED);
        }

        const userImages =
            await this.imageRepository.findByOwnerId(ownerId);

        const existingImage = userImages.find(
            (image) => image.id === imageId,
        );

        if (!existingImage) {
            throw new AppError(IMAGE_MESSAGES.IMAGE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        await this.imageRepository.deleteById(imageId, ownerId);

        try {
            await this.imageStorageService.delete(existingImage.publicId);
        } catch {
        }
    }
}
