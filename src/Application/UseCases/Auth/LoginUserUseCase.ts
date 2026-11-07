import { AppError } from "../../Errors/AppError";
import { STATUS_CODE } from "../../Constants/HttpStatusCode";
import { AUTH_MESSAGES } from "../../Constants/Messages/AuthMessages";
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
            throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, STATUS_CODE.UNAUTHORIZED);
        }

        const passwordMatches = await this.passwordService.compare(
            input.password,
            user.password
        );

        if (!passwordMatches) {
            throw new AppError(AUTH_MESSAGES.INVALID_PASSWORD, STATUS_CODE.UNAUTHORIZED);
        }

        if (!user.id) {
            throw new AppError(AUTH_MESSAGES.UNABLE_TO_COMPLETE_LOGIN, STATUS_CODE.INTERNAL_SERVER_ERROR);
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
