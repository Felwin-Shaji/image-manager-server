
import { AppError } from "../../Errors/AppError";
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
            throw new AppError("Refresh token is required", 401);
        }

        let payload: { userId: string };

        try {
            payload = this.jwtService.verifyRefreshToken(refreshToken);
        } catch {
            throw new AppError("Invalid or expired refresh token", 401);
        }

        const user = await this.userRepository.findById(payload.userId);

        if (!user || !user.id) {
            throw new AppError("User not found", 401);
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
