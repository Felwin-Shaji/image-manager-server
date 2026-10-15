import type { IImageRepository } from "../../../Application/Interfaces/Repositories/IImageRepository";
import { Image } from "../../../Domain/Entities/Image";
import { ImageModel } from "../Models/ImageModel";

export class MongoImageRepository implements IImageRepository {
    async getNextOrder(ownerId: string): Promise<number> {
        const lastImage = await ImageModel.findOne({ ownerId })
            .sort({ order: -1 })
            .select({ order: 1 })
            .lean();

        return (lastImage?.order ?? -1) + 1;
    }

    async create(image: Image): Promise<Image> {
        const document = await ImageModel.create({
            ownerId: image.ownerId,
            title: image.title,
            publicId: image.publicId,
            secureUrl: image.secureUrl,
            format: image.format,
            bytes: image.bytes,
            width: image.width,
            height: image.height,
            order: image.order
        });

        return new Image({
            id: document._id.toString(),
            ownerId: document.ownerId.toString(),
            title: document.title,
            publicId: document.publicId,
            secureUrl: document.secureUrl,
            format: document.format,
            bytes: document.bytes,
            width: document.width,
            height: document.height,
            order: document.order,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt
        });
    }


    async deleteById(id: string, ownerId: string): Promise<void> {
        await ImageModel.deleteOne({
            _id: id,
            ownerId,
        });
    };

}
