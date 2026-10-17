import type { Image } from "../../../Domain/Entities/Image";

export interface ReplaceImageData {
    publicId: string;
    secureUrl: string;
    format: string;
    bytes: number;
    width: number;
    height: number;
}

export interface ImageOrderUpdate {
    imageId: string;
    order: number;
}

export interface IImageRepository {
    getNextOrder(ownerId: string): Promise<number>;
    create(image: Image): Promise<Image>;
    deleteById(id: string, ownerId: string): Promise<void>;
    findByOwnerId(ownerId: string): Promise<Image[]>;
    findByImageId(imageId: string): Promise<Image | null>;
    updateTitleById(id: string, ownerId: string, title: string): Promise<Image | null>;
    replaceImageById(id: string, ownerId: string, image: ReplaceImageData,): Promise<Image | null>;
    updateImageOrder(ownerId: string, imageOrders: ImageOrderUpdate[],): Promise<void>;

}
