import { ImageOutputDTO } from "../../DTOs/Images/UploadImageDTO";

export interface IGetUserImagesUseCase {
    execute(userId: string): Promise<ImageOutputDTO[]>;
}