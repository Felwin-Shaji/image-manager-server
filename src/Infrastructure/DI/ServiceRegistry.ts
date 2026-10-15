import { container } from "tsyringe";
import { BcryptPasswordService } from "../Services/BcryptPasswordService";
import { JwtService } from "../Services/JwtService";
import { SERVICE_TOKENS } from "./Tokens/ServiceTokens";

export class ServiceRegistry {
    static register(): void {

        container.register(
            SERVICE_TOKENS.IPasswordService,
            { useClass: BcryptPasswordService }
        );

        container.register(
            SERVICE_TOKENS.IJwtService,
            { useClass: JwtService }
        );

    }
}
