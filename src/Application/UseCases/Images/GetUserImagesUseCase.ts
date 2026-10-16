import { ImageOutputDTO } from "../../DTOs/Images/UploadImageDTO";
import { AppError } from "../../Errors/AppError";
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
            throw new AppError("Unable to identify image owner", 401);
        }

        const images = await this.imageRepository.findByOwnerId(ownerId);

        return images.map((image) => {
            if (typeof image.id !== "string" || !image.id) {
                throw new AppError("Invalid image record", 500);
            }

            return ImageMapper.toOutputDTO({
                ...image,
                id: image.id,
            });
        });
    }
}