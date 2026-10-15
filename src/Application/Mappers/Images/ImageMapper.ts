import type { UploadImageOutputDTO } from "../../DTOs/Images/UploadImageDTO";
import type { ImageStorageResult } from "../../Interfaces/Services/IImageStorageService";
import { Image } from "../../../Domain/Entities/Image";

export class ImageMapper {
    static toDomainImage(input: {
        ownerId: string;
        title: string;
        order: number;
        storageResult: ImageStorageResult;
    }): Image {
        return new Image({
            id: null,
            ownerId: input.ownerId,
            title: input.title,
            publicId: input.storageResult.publicId,
            secureUrl: input.storageResult.secureUrl,
            format: input.storageResult.format,
            bytes: input.storageResult.bytes,
            width: input.storageResult.width,
            height: input.storageResult.height,
            order: input.order
        });
    }

    static toUploadOutputDTO(image: Image & { id: string }): UploadImageOutputDTO {
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
            ...(image.updatedAt && { updatedAt: image.updatedAt })
        };
    }
}
