import { container } from "tsyringe";
import { RegisterUserUseCase } from "../../Application/UseCases/Auth/RegisterUserUseCase";
import type { IUserRepository } from "../../Application/Interfaces/Repositories/IUserRepository";
import type { IPasswordService } from "../../Application/Interfaces/Services/IPasswordService";
import type { IRegisterUserUseCase } from "../../Application/Interfaces/UseCases/IRegisterUserUseCase";
import { USECASE_TOKENS } from "./Tokens/UseCaseTokens";
import { REPOSITORY_TOKENS } from "./Tokens/RepositoryTokens";
import { SERVICE_TOKENS } from "./Tokens/ServiceTokens";

export class UseCaseRegistry {
    static register(): void {

        container.register<IRegisterUserUseCase>(

            USECASE_TOKENS.IRegisterUserUseCase,
            {
                useFactory: (dependencyContainer) => {
                    const userRepository = dependencyContainer.resolve<IUserRepository>(REPOSITORY_TOKENS.IUserRepository);

                    const passwordService = dependencyContainer.resolve<IPasswordService>(SERVICE_TOKENS.IPasswordService);

                    return new RegisterUserUseCase(
                        userRepository,
                        passwordService
                    );
                }
            }

        );


    }
}
