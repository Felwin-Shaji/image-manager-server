
import { ReplaceImageInputDTO } from "../../DTOs/Images/UpdateImageTitleDTO";
import type { ImageOutputDTO } from "../../DTOs/Images/UploadImageDTO";

export interface IReplaceImageUseCase {
    execute(input: ReplaceImageInputDTO): Promise<ImageOutputDTO>;
}
