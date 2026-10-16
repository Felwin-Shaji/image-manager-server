import type { Image } from "../../../Domain/Entities/Image";

export interface IImageRepository {
    getNextOrder(ownerId: string): Promise<number>;
    create(image: Image): Promise<Image>;
    deleteById(id: string, ownerId: string): Promise<void>;
    findByOwnerId(ownerId: string): Promise<Image[]>
}
