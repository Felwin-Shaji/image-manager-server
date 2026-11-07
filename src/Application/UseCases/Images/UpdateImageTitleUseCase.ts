
import { AppError } from "../../Errors/AppError";
import { STATUS_CODE } from "../../Constants/HttpStatusCode";
import { COMMON_MESSAGES } from "../../Constants/Messages/CommonMessages";
import { IMAGE_MESSAGES } from "../../Constants/Messages/ImageMessages";
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

        if (!imageId) throw new AppError(IMAGE_MESSAGES.IMAGE_ID_REQUIRED, STATUS_CODE.BAD_REQUEST);

        if (!ownerId) throw new AppError(COMMON_MESSAGES.UNABLE_TO_IDENTIFY_IMAGE_OWNER, STATUS_CODE.UNAUTHORIZED);

        if (!title) throw new AppError(IMAGE_MESSAGES.IMAGE_TITLE_REQUIRED, STATUS_CODE.BAD_REQUEST);

        if (title.length > MAX_IMAGE_TITLE_LENGTH) {
            throw new AppError(
                IMAGE_MESSAGES.IMAGE_TITLE_TOO_LONG(MAX_IMAGE_TITLE_LENGTH),
                STATUS_CODE.BAD_REQUEST,
            );
        }

        const currentImage = await this.imageRepository.findByImageId(imageId);
        if (!currentImage) throw new AppError(IMAGE_MESSAGES.IMAGE_NOT_FOUND, STATUS_CODE.NOT_FOUND);

        const updatedImage = await this.imageRepository.updateTitleById(
            imageId,
            ownerId,
            title,
        );

        if (!updatedImage) throw new AppError(IMAGE_MESSAGES.IMAGE_NOT_FOUND, STATUS_CODE.NOT_FOUND);


        if (typeof updatedImage.id !== "string" || !updatedImage.id) {
            throw new AppError(IMAGE_MESSAGES.UNABLE_TO_RETRIEVE_UPDATED_IMAGE, STATUS_CODE.INTERNAL_SERVER_ERROR);
        }

        return ImageMapper.toOutputDTO(updatedImage as typeof updatedImage & { id: string });
    }
}
