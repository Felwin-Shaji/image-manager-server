
import { AppError } from "../../Errors/AppError";
import type {
    UploadImageInputDTO,
    UploadImageOutputDTO,
} from "../../DTOs/Images/UploadImageDTO";
import { ImageMapper } from "../../Mappers/Images/ImageMapper";
import type { IImageRepository } from "../../Interfaces/Repositories/IImageRepository";
import type { IImageStorageService } from "../../Interfaces/Services/IImageStorageService";
import type { IUploadImageUseCase } from "../../Interfaces/UseCases/IUploadImageUseCase";
import { Image } from "../../../Domain/Entities/Image";
import { MAX_IMAGE_COUNT, MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_TITLE_LENGTH } from "../../Policies/ImageUploadPolicy";

const isPersistedImage = (
    image: Image,
): image is Image & { id: string } =>
    typeof image.id === "string" && image.id.length > 0;

export class UploadImageUseCase implements IUploadImageUseCase {
    constructor(
        private readonly imageRepository: IImageRepository,
        private readonly imageStorageService: IImageStorageService,
    ) { }

    async execute(input: UploadImageInputDTO,): Promise<UploadImageOutputDTO[]> {
        const userId = input.userId.trim();
        if (!userId) throw new AppError("Unable to identify image owner", 401);

        if (
            !Array.isArray(input.images) ||
            input.images.length === 0 ||
            input.images.length > MAX_IMAGE_COUNT
        ) {
            throw new AppError(
                `Upload between 1 and ${MAX_IMAGE_COUNT} images`,
                400,
            );
        }

        for (const image of input.images) {
            if (!image.title.trim()) throw new AppError("Image title is required", 400);

            if (image.title.trim().length > MAX_IMAGE_TITLE_LENGTH) {
                throw new AppError(
                    `Image title must not exceed ${MAX_IMAGE_TITLE_LENGTH} characters`,
                    400,
                );
            }

            if (
                !Buffer.isBuffer(image.file) ||
                image.file.length === 0
            ) {
                throw new AppError("Image file is required", 400);
            }

            if (image.file.length > MAX_IMAGE_SIZE_BYTES) {
                throw new AppError(
                    "Image exceeds the 5 MB size limit",
                    413,
                );
            }
        }

        const startingOrder = await this.imageRepository.getNextOrder(userId);

        const storedPublicIds: string[] = [];
        const savedImages: (Image & { id: string })[] = [];

        try {
            for (const [index, imageInput] of input.images.entries()) {
                const title = imageInput.title.trim();

                const storedImage = await this.imageStorageService.upload(
                    imageInput.file,
                    `users/${userId}`,
                );

                storedPublicIds.push(storedImage.publicId);

                const image = ImageMapper.toDomainImage({
                    ownerId: userId,
                    title,
                    order: startingOrder + index,
                    storageResult: storedImage,
                });

                const createdImage =
                    await this.imageRepository.create(image);

                if (!isPersistedImage(createdImage)) {
                    throw new AppError(
                        "Unable to save image metadata",
                        500,
                    );
                }

                savedImages.push(createdImage);
            }
        } catch (error: unknown) {
            for (const savedImage of savedImages) {
                try {
                    await this.imageRepository.deleteById(
                        savedImage.id,
                        userId,
                    );
                } catch {
                    console.error(
                        "Failed to clean up image metadata after bulk upload failure.",
                    );
                }
            }

            for (const publicId of storedPublicIds) {
                try {
                    await this.imageStorageService.delete(publicId);
                } catch {
                    console.error(
                        "Cloudinary cleanup failed after bulk upload failure.",
                    );
                }
            }

            throw error;
        }

        return savedImages.map((image) =>
            ImageMapper.toUploadOutputDTO(image),
        );
    }
}
