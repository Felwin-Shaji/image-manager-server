import { AppError } from "../../Errors/AppError";
import type { IUserRepository } from "../../Interfaces/Repositories/IUserRepository";
import type { IJwtService } from "../../Interfaces/Services/IJwtService";
import type { IPasswordService } from "../../Interfaces/Services/IPasswordService";
import type { ILoginUserUseCase } from "../../Interfaces/UseCases/ILoginUserUseCase";
import type { LoginUserInputDTO, LoginUserOutputDTO } from "../../DTOs/Auth/LoginUserDTO";

export class LoginUserUseCase implements ILoginUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly jwtService: IJwtService
    ) { }

    async execute(input: LoginUserInputDTO): Promise<LoginUserOutputDTO> {
        const email = input.email.trim().toLowerCase();
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const passwordMatches = await this.passwordService.compare(
            input.password,
            user.password
        );

        if (!passwordMatches) {
            throw new AppError("Invalid email or password", 401);
        }

        if (!user.id) {
            throw new AppError("Unable to complete login", 500);
        }

        return {
            id: user.id,
            email: user.email,
            phone: user.phone,
            accessToken: this.jwtService.generateAccessToken(user.id),
            refreshToken: this.jwtService.generateRefreshToken(user.id)
        };
    }
}
