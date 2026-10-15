import { v2 as cloudinary } from "cloudinary";
import type {
    IImageStorageService,
    ImageStorageResult
} from "../../Application/Interfaces/Services/IImageStorageService";
import { AppError } from "../../Application/Errors/AppError";
import env from "../Config/env";

cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true
});

export class CloudinaryImageStorageService implements IImageStorageService {
    
    async upload(file: Buffer, folder = "image-manager"): Promise<ImageStorageResult> {
        try {
            return await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder,
                        resource_type: "image"
                    },
                    (error, result) => {
                        if (error || !result) {
                            reject(error ?? new Error("Image upload failed"));
                            return;
                        }

                        resolve({
                            publicId: result.public_id,
                            secureUrl: result.secure_url,
                            format: result.format,
                            bytes: result.bytes,
                            width: result.width,
                            height: result.height
                        });
                    }
                );

                uploadStream.end(file);
            });
        } catch {
            throw new AppError("Failed to upload image", 502);
        }
    }

    async delete(publicId: string): Promise<void> {
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: "image"
            });

            if (result.result !== "ok" && result.result !== "not found") {
                throw new Error("Cloudinary deletion failed");
            }
        } catch {
            throw new AppError("Failed to delete image", 502);
        }
    }
}