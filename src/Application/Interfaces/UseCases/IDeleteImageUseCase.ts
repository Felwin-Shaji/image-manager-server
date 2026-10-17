
import type { DeleteImageInputDTO } from "../../DTOs/Images/DeleteImageDTO";

export interface IDeleteImageUseCase {
    execute(input: DeleteImageInputDTO): Promise<void>;
}
