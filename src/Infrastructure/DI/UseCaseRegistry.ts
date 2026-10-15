import { container } from "tsyringe";
import { RegisterUserUseCase } from "../../Application/UseCases/Auth/RegisterUserUseCase";
import { LoginUserUseCase } from "../../Application/UseCases/Auth/LoginUserUseCase";
import { UploadImageUseCase } from "../../Application/UseCases/Images/UploadImageUseCase";
import type { IUserRepository } from "../../Application/Interfaces/Repositories/IUserRepository";
import type { IPasswordService } from "../../Application/Interfaces/Services/IPasswordService";
import type { IJwtService } from "../../Application/Interfaces/Services/IJwtService";
import type { IRegisterUserUseCase } from "../../Application/Interfaces/UseCases/IRegisterUserUseCase";
import type { ILoginUserUseCase } from "../../Application/Interfaces/UseCases/ILoginUserUseCase";
import type { IImageRepository } from "../../Application/Interfaces/Repositories/IImageRepository";
import type { IImageStorageService } from "../../Application/Interfaces/Services/IImageStorageService";
import type { IUploadImageUseCase } from "../../Application/Interfaces/UseCases/IUploadImageUseCase";
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

        container.register<ILoginUserUseCase>(
            USECASE_TOKENS.ILoginUserUseCase,
            {
                useFactory: (dependencyContainer) => {
                    const userRepository = dependencyContainer.resolve<IUserRepository>(REPOSITORY_TOKENS.IUserRepository);
                    const passwordService = dependencyContainer.resolve<IPasswordService>(SERVICE_TOKENS.IPasswordService);
                    const jwtService = dependencyContainer.resolve<IJwtService>(SERVICE_TOKENS.IJwtService);

                    return new LoginUserUseCase(
                        userRepository,
                        passwordService,
                        jwtService
                    );
                }
            }
        );

        container.register<IUploadImageUseCase>(
            USECASE_TOKENS.IUploadImageUseCase,
            {
                useFactory: (dependencyContainer) => {
                    const imageRepository = dependencyContainer.resolve<IImageRepository>(
                        REPOSITORY_TOKENS.IImageRepository
                    );
                    const imageStorageService = dependencyContainer.resolve<IImageStorageService>(
                        SERVICE_TOKENS.IImageStorageService
                    );

                    return new UploadImageUseCase(imageRepository, imageStorageService);
                }
            }
        );

    }
}
