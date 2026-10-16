
import type { RefreshTokenOutputDTO } from "../../DTOs/Auth/RefreshTokenDTO";

export interface IRefreshTokenUseCase {
    execute(refreshToken: string): Promise<RefreshTokenOutputDTO>;
}
