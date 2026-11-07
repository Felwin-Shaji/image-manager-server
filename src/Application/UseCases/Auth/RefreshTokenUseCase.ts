
import { AppError } from "../../Errors/AppError";
import { STATUS_CODE } from "../../Constants/HttpStatusCode";
import { AUTH_MESSAGES } from "../../Constants/Messages/AuthMessages";
import { USER_MESSAGES } from "../../Constants/Messages/UserMessages";
import type { IUserRepository } from "../../Interfaces/Repositories/IUserRepository";
import type { IJwtService } from "../../Interfaces/Services/IJwtService";
import type { IRefreshTokenUseCase } from "../../Interfaces/UseCases/IRefreshTokenUseCase";
import type { RefreshTokenOutputDTO } from "../../DTOs/Auth/RefreshTokenDTO";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly jwtService: IJwtService,
    ) { }

    async execute(refreshToken: string): Promise<RefreshTokenOutputDTO> {
        if (!refreshToken.trim()) {
            throw new AppError(AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED, STATUS_CODE.UNAUTHORIZED);
        }

        let payload: { userId: string };

        try {
            payload = this.jwtService.verifyRefreshToken(refreshToken);
        } catch {
            throw new AppError(AUTH_MESSAGES.INVALID_OR_EXPIRED_REFRESH_TOKEN, STATUS_CODE.UNAUTHORIZED);
        }

        const user = await this.userRepository.findById(payload.userId);

        if (!user || !user.id) {
            throw new AppError(USER_MESSAGES.USER_NOT_FOUND, STATUS_CODE.UNAUTHORIZED);
        }

        return {
            accessToken: this.jwtService.generateAccessToken(user.id),
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
            },
        };
    }
}
