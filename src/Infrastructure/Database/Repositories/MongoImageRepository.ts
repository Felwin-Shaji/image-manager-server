import type { IImageRepository, ReplaceImageData } from "../../../Application/Interfaces/Repositories/IImageRepository";
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
        return this.toDomain(document);
    }


    async deleteById(id: string, ownerId: string): Promise<void> {
        await ImageModel.deleteOne({
            _id: id,
            ownerId,
        });
    };

    async findByOwnerId(ownerId: string): Promise<Image[]> {
        const documents = await ImageModel.find({ ownerId })
            .sort({ order: 1 })
            .lean();

        return documents.map((document) => this.toDomain(document));
    }

    async findByImageId(imageId: string): Promise<Image | null> {
        const document = await ImageModel.findOne({ _id: imageId }).lean();

        if (!document) {
            return null;
        }

        return this.toDomain(document);
    }


    async updateTitleById(id: string, ownerId: string, title: string): Promise<Image | null> {

        const document = await ImageModel.findOneAndUpdate(
            { _id: id, ownerId },
            { $set: { title } },
            { new: true, runValidators: true }
        ).lean();

        if (!document) {
            return null;
        }

        return this.toDomain(document);
    }

    async replaceImageById(
        id: string,
        ownerId: string,
        image: ReplaceImageData,
    ): Promise<Image | null> {
        const document = await ImageModel.findOneAndUpdate(
            { _id: id, ownerId },
            {
                $set: {
                    publicId: image.publicId,
                    secureUrl: image.secureUrl,
                    format: image.format,
                    bytes: image.bytes,
                    width: image.width,
                    height: image.height,
                },
            },
            {
                returnDocument: "after",
                runValidators: true,
            },
        ).lean();

        if (!document) {
            return null;
        }

        return this.toDomain(document);
    }


    private toDomain(document: {
        _id: { toString(): string };
        ownerId: { toString(): string };
        title: string;
        publicId: string;
        secureUrl: string;
        format: string;
        bytes: number;
        width: number;
        height: number;
        order: number;
        createdAt?: Date;
        updatedAt?: Date;
    }): Image {
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
            updatedAt: document.updatedAt,
        });
    }

}
