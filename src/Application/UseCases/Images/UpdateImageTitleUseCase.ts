
import { AppError } from "../../Errors/AppError";
import type { UpdateImageTitleInputDTO } from "../../DTOs/Images/UpdateImageTitleDTO";
import { ImageMapper } from "../../Mappers/Images/ImageMapper";
import type { ImageOutputDTO } from "../../DTOs/Images/UploadImageDTO";
import type { IImageRepository } from "../../Interfaces/Repositories/IImageRepository";
import type { IUpdateImageTitleUseCase } from "../../Interfaces/UseCases/IUpdateImageTitleUseCase";
import { MAX_IMAGE_TITLE_LENGTH } from "../../Policies/ImageUploadPolicy";

export class UpdateImageTitleUseCase implements IUpdateImageTitleUseCase {
    constructor(
        private readonly imageRepository: IImageRepository,
    ) { }

    async execute(input: UpdateImageTitleInputDTO): Promise<ImageOutputDTO> {
        const imageId = input.imageId.trim();
        const ownerId = input.ownerId.trim();
        const title = input.title.trim();

        if (!imageId) throw new AppError("Image ID is required", 400);

        if (!ownerId) throw new AppError("Unable to identify image owner", 401);

        if (!title) throw new AppError("Image title is required", 400);

        if (title.length > MAX_IMAGE_TITLE_LENGTH) {
            throw new AppError(
                `Image title must not exceed ${MAX_IMAGE_TITLE_LENGTH} characters`,
                400,
            );
        }

        const currentImage = await this.imageRepository.findByImageId(imageId);
        if (!currentImage) throw new AppError("Image not found", 404);

        const updatedImage = await this.imageRepository.updateTitleById(
            imageId,
            ownerId,
            title,
        );

        if (!updatedImage) throw new AppError("Image not found", 404);


        if (typeof updatedImage.id !== "string" || !updatedImage.id) {
            throw new AppError("Unable to retrieve updated image", 500);
        }

        return ImageMapper.toOutputDTO(updatedImage as typeof updatedImage & { id: string });
    }
}
