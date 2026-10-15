import { fileTypeFromBuffer } from "file-type";
import { ALLOWED_IMAGE_MIME_TYPES, AllowedImageMimeType } from "../../Application/Policies/ImageUploadPolicy";



export const validateImageMimeType = async (
    buffer: Buffer,
    declaredMimeType: string,
): Promise<boolean> => {
    const detectedType = await fileTypeFromBuffer(buffer);

    if (!detectedType) {
        return false;
    }

    const detectedMimeType = detectedType.mime;

    const isAllowedMimeType: boolean =
        ALLOWED_IMAGE_MIME_TYPES.includes(
            detectedMimeType as AllowedImageMimeType,
        );

    if (!isAllowedMimeType) {
        return false;
    }

    return detectedMimeType === declaredMimeType.toLowerCase();
};
