import { UpdateImageTitleInputDTO } from "../../DTOs/Images/UpdateImageTitleDTO";
import { ImageOutputDTO } from "../../DTOs/Images/UploadImageDTO";

export interface IUpdateImageTitleUseCase {
    execute(input: UpdateImageTitleInputDTO): Promise<ImageOutputDTO>;
}