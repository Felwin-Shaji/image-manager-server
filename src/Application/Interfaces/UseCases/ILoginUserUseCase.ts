import type { LoginUserInputDTO, LoginUserOutputDTO } from "../../DTOs/Auth/LoginUserDTO";

export interface ILoginUserUseCase {
    execute(input: LoginUserInputDTO): Promise<LoginUserOutputDTO>;
}
