import type { UpdateImageOrderInputDTO } from "../../DTOs/Images/UpdateImageOrderDTO";

export interface IUpdateImageOrderUseCase {
    execute(input: UpdateImageOrderInputDTO): Promise<void>;
}