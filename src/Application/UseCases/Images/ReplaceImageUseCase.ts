
import { AppError } from "../../Errors/AppError";
import type { ImageOutputDTO } from "../../DTOs/Images/UploadImageDTO";
import { ImageMapper } from "../../Mappers/Images/ImageMapper";
import type { IImageRepository } from "../../Interfaces/Repositories/IImageRepository";
import type { IImageStorageService } from "../../Interfaces/Services/IImageStorageService";
import type { IReplaceImageUseCase } from "../../Interfaces/UseCases/IReplaceImageUseCase";
import { ReplaceImageInputDTO } from "../../DTOs/Images/UpdateImageTitleDTO";

export class ReplaceImageUseCase implements IReplaceImageUseCase {
    constructor(
        private readonly imageRepository: IImageRepository,
        private readonly imageStorageService: IImageStorageService,
    ) { }

    async execute(input: ReplaceImageInputDTO,): Promise<ImageOutputDTO> {
        const imageId = input.imageId.trim();
        const ownerId = input.ownerId.trim();

        if (!imageId) throw new AppError("Image ID is required", 400);

        if (!ownerId) throw new AppError("Unable to identify image owner", 401);
        const userImages = await this.imageRepository.findByOwnerId(ownerId);

        const existingImage = userImages.find(
            (image) => image.id === imageId,
        );

        if (!existingImage) throw new AppError("Image not found", 404);
        const oldPublicId = existingImage.publicId;

        const storageResult = await this.imageStorageService.upload(input.file,);

        let updatedImage;

        try {
            updatedImage = await this.imageRepository.replaceImageById(
                imageId,
                ownerId,
                {
                    publicId: storageResult.publicId,
                    secureUrl: storageResult.secureUrl,
                    format: storageResult.format,
                    bytes: storageResult.bytes,
                    width: storageResult.width,
                    height: storageResult.height,
                },
            );

            if (!updatedImage) throw new AppError("Image not found", 404);

        } catch (error: unknown) {
            try {
                await this.imageStorageService.delete(
                    storageResult.publicId,
                );
            } catch {
                // Preserve the original database error.
            }

            throw error;
        }

        if (oldPublicId !== storageResult.publicId) {
            try {
                await this.imageStorageService.delete(oldPublicId);
            } catch {
                // Replacement succeeded; old asset cleanup can be retried.
            }
        }

        if (
            typeof updatedImage.id !== "string" ||
            !updatedImage.id
        ) {
            throw new AppError(
                "Unable to retrieve the updated image",
                500,
            );
        }

        return ImageMapper.toOutputDTO(
            updatedImage as typeof updatedImage & { id: string },
        );
    }
}
