import { ImageOutputDTO } from "../../DTOs/Images/UploadImageDTO";
import { AppError } from "../../Errors/AppError";
import { STATUS_CODE } from "../../Constants/HttpStatusCode";
import { COMMON_MESSAGES } from "../../Constants/Messages/CommonMessages";
import { IMAGE_MESSAGES } from "../../Constants/Messages/ImageMessages";
import type { IImageRepository } from "../../Interfaces/Repositories/IImageRepository";
import type { IGetUserImagesUseCase } from "../../Interfaces/UseCases/IGetUserImagesUseCase";
import { ImageMapper } from "../../Mappers/Images/ImageMapper";

export class GetUserImagesUseCase implements IGetUserImagesUseCase {
    constructor(
        private readonly imageRepository: IImageRepository,
    ) { }

    async execute(userId: string): Promise<ImageOutputDTO[]> {
        const ownerId = userId.trim();

        if (!ownerId) {
            throw new AppError(COMMON_MESSAGES.UNABLE_TO_IDENTIFY_IMAGE_OWNER, STATUS_CODE.UNAUTHORIZED);
        }

        const images = await this.imageRepository.findByOwnerId(ownerId);

        return images.map((image) => {
            if (typeof image.id !== "string" || !image.id) {
                throw new AppError(IMAGE_MESSAGES.INVALID_IMAGE_RECORD, STATUS_CODE.INTERNAL_SERVER_ERROR);
            }

            return ImageMapper.toOutputDTO({
                ...image,
                id: image.id,
            });
        });
    }
}
