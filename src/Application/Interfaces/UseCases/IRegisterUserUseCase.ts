import { RegisterUserInputDTO, RegisterUserOutputDTO } from "../../DTOs/Auth/RegisterUserDTO";

export interface IRegisterUserUseCase {
    execute(input: RegisterUserInputDTO): Promise<RegisterUserOutputDTO>;
}
