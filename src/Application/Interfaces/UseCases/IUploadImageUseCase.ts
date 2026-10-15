import type {
    UploadImageInputDTO,
    UploadImageOutputDTO
} from "../../DTOs/Images/UploadImageDTO";

export interface IUploadImageUseCase {
    execute(input: UploadImageInputDTO): Promise<UploadImageOutputDTO[]>;
}
