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
import { IGetUserImagesUseCase } from "../../Application/Interfaces/UseCases/IGetUserImagesUseCase";
import { GetUserImagesUseCase } from "../../Application/UseCases/Images/GetUserImagesUseCase";
import { IRefreshTokenUseCase } from "../../Application/Interfaces/UseCases/IRefreshTokenUseCase";
import { RefreshTokenUseCase } from "../../Application/UseCases/Auth/RefreshTokenUseCase";
import { IUpdateImageTitleUseCase } from "../../Application/Interfaces/UseCases/IUpdateImageTitleUseCase";
import { UpdateImageTitleUseCase } from "../../Application/UseCases/Images/UpdateImageTitleUseCase";
import { IReplaceImageUseCase } from "../../Application/Interfaces/UseCases/IReplaceImageUseCase";
import { ReplaceImageUseCase } from "../../Application/UseCases/Images/ReplaceImageUseCase";
import { IDeleteImageUseCase } from "../../Application/Interfaces/UseCases/IDeleteImageUseCase";
import { DeleteImageUseCase } from "../../Application/UseCases/Images/DeleteImageUseCase";
import { IUpdateImageOrderUseCase } from "../../Application/Interfaces/UseCases/IUpdateImageOrderUseCase";
import { UpdateImageOrderUseCase } from "../../Application/UseCases/Images/UpdateImageOrderUseCase";

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

        container.register<IGetUserImagesUseCase>(
            USECASE_TOKENS.IGetUserImagesUseCase,
            {
                useFactory: (dependencyContainer) => {
                    const imageRepository =
                        dependencyContainer.resolve<IImageRepository>(
                            REPOSITORY_TOKENS.IImageRepository,
                        );

                    return new GetUserImagesUseCase(imageRepository);
                },
            },
        );


        container.register<IRefreshTokenUseCase>(
            USECASE_TOKENS.IRefreshTokenUseCase,
            {
                useFactory: (dependencyContainer) => {
                    const userRepository =
                        dependencyContainer.resolve<IUserRepository>(
                            REPOSITORY_TOKENS.IUserRepository,
                        );

                    const jwtService =
                        dependencyContainer.resolve<IJwtService>(
                            SERVICE_TOKENS.IJwtService,
                        );

                    return new RefreshTokenUseCase(
                        userRepository,
                        jwtService,
                    );
                },
            },
        );

        container.register<IUpdateImageTitleUseCase>(
            USECASE_TOKENS.IUpdateImageTitleUseCase,
            {
                useFactory: (dependencyContainer) => {
                    const imageRepository =
                        dependencyContainer.resolve<IImageRepository>(
                            REPOSITORY_TOKENS.IImageRepository,
                        );

                    return new UpdateImageTitleUseCase(imageRepository);
                },
            },
        );

        container.register<IReplaceImageUseCase>(
            USECASE_TOKENS.IReplaceImageUseCase,
            {
                useFactory: (dependencyContainer) => {
                    const imageRepository =
                        dependencyContainer.resolve<IImageRepository>(
                            REPOSITORY_TOKENS.IImageRepository,
                        );

                    const imageStorageService =
                        dependencyContainer.resolve<IImageStorageService>(
                            SERVICE_TOKENS.IImageStorageService,
                        );

                    return new ReplaceImageUseCase(
                        imageRepository,
                        imageStorageService,
                    );
                },
            },
        );

        container.register<IDeleteImageUseCase>(
            USECASE_TOKENS.IDeleteImageUseCase,
            {
                useFactory: (dependencyContainer) => {
                    const imageRepository =
                        dependencyContainer.resolve<IImageRepository>(
                            REPOSITORY_TOKENS.IImageRepository,
                        );

                    const imageStorageService =
                        dependencyContainer.resolve<IImageStorageService>(
                            SERVICE_TOKENS.IImageStorageService,
                        );

                    return new DeleteImageUseCase(
                        imageRepository,
                        imageStorageService,
                    );
                },
            },
        );

        container.register<IUpdateImageOrderUseCase>(
            USECASE_TOKENS.IUpdateImageOrderUseCase,
            {
                useFactory: (dependencyContainer) => {
                    const imageRepository =
                        dependencyContainer.resolve<IImageRepository>(
                            REPOSITORY_TOKENS.IImageRepository,
                        );

                    return new UpdateImageOrderUseCase(imageRepository);
                },
            },
        );

    }
}
