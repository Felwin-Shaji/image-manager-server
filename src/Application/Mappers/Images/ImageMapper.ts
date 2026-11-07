
import type { ImageOutputDTO, UploadImageOutputDTO } from "../../DTOs/Images/UploadImageDTO";
import type { ImageStorageResult } from "../../Interfaces/Services/IImageStorageService";
import { Image } from "../../../Domain/Entities/Image";

export class ImageMapper {
    static toDomainImage(input: {
        ownerId: string;
        title: string;
        order: number;
        storageResult: ImageStorageResult;
    }): Image {
        return new Image(
            null,
            input.ownerId,
            input.title,
            input.storageResult.publicId,
            input.storageResult.secureUrl,
            input.storageResult.format,
            input.storageResult.bytes,
            input.storageResult.width,
            input.storageResult.height,
            input.order,
        );
    }

    static toOutputDTO(image: Image & { id: string }): ImageOutputDTO {
        return {
            id: image.id,
            title: image.title,
            order: image.order,
            secureUrl: image.secureUrl,
            format: image.format,
            bytes: image.bytes,
            width: image.width,
            height: image.height,
            ...(image.createdAt && { createdAt: image.createdAt }),
            ...(image.updatedAt && { updatedAt: image.updatedAt }),
        };
    }

    static toUploadOutputDTO(
        image: Image & { id: string },
    ): UploadImageOutputDTO {
        return this.toOutputDTO(image);
    }
}
