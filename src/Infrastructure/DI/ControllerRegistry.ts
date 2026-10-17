import { container } from "tsyringe";

import { CONTROLLER_TOKENS } from "./Tokens/ControllerTokens";
import { USECASE_TOKENS } from "./Tokens/UseCaseTokens";

import { RegisterUserController } from "../../InterfaceAdapters/Controllers/Auth/RegisterUserController";
import { LoginUserController } from "../../InterfaceAdapters/Controllers/Auth/LoginUserController";
import { UploadImageController } from "../../InterfaceAdapters/Controllers/Images/UploadImageController";
import type { IRegisterUserUseCase } from "../../Application/Interfaces/UseCases/IRegisterUserUseCase";
import type { ILoginUserUseCase } from "../../Application/Interfaces/UseCases/ILoginUserUseCase";
import type { IUploadImageUseCase } from "../../Application/Interfaces/UseCases/IUploadImageUseCase";
import { GetUserImagesController } from "../../InterfaceAdapters/Controllers/Images/GetUserImagesController";
import { IGetUserImagesUseCase } from "../../Application/Interfaces/UseCases/IGetUserImagesUseCase";
import { RefreshTokenController } from "../../InterfaceAdapters/Controllers/Auth/RefreshTokenController";
import { IRefreshTokenUseCase } from "../../Application/Interfaces/UseCases/IRefreshTokenUseCase";
import { UpdateImageTitleController } from "../../InterfaceAdapters/Controllers/Images/UpdateImageTitleController";
import { IUpdateImageTitleUseCase } from "../../Application/Interfaces/UseCases/IUpdateImageTitleUseCase";
import { ReplaceImageController } from "../../InterfaceAdapters/Controllers/Images/ReplaceImageController";
import { IReplaceImageUseCase } from "../../Application/Interfaces/UseCases/IReplaceImageUseCase";
import { DeleteImageController } from "../../InterfaceAdapters/Controllers/Images/DeleteImageController";
import { IDeleteImageUseCase } from "../../Application/Interfaces/UseCases/IDeleteImageUseCase";

export class ControllerRegistry {
    static register(): void {

        container.register<RegisterUserController>(
            CONTROLLER_TOKENS.RegisterUserController,
            {
                useFactory: (dependencyContainer) => {
                    const registerUserUseCase =
                        dependencyContainer.resolve<IRegisterUserUseCase>(
                            USECASE_TOKENS.IRegisterUserUseCase
                        );

                    return new RegisterUserController(registerUserUseCase);
                }
            }
        );

        container.register<LoginUserController>(
            CONTROLLER_TOKENS.LoginUserController,
            {
                useFactory: (dependencyContainer) => {
                    const loginUserUseCase =
                        dependencyContainer.resolve<ILoginUserUseCase>(
                            USECASE_TOKENS.ILoginUserUseCase
                        );

                    return new LoginUserController(loginUserUseCase);
                }
            }
        );

        container.register<UploadImageController>(
            CONTROLLER_TOKENS.UploadImageController,
            {
                useFactory: (dependencyContainer) => {
                    const uploadImageUseCase =
                        dependencyContainer.resolve<IUploadImageUseCase>(
                            USECASE_TOKENS.IUploadImageUseCase
                        );

                    return new UploadImageController(uploadImageUseCase);
                }
            }
        );

        container.register<GetUserImagesController>(
            CONTROLLER_TOKENS.GetUserImagesController,
            {
                useFactory: (dependencyContainer) => {
                    const getUserImagesUseCase =
                        dependencyContainer.resolve<IGetUserImagesUseCase>(
                            USECASE_TOKENS.IGetUserImagesUseCase,
                        );

                    return new GetUserImagesController(getUserImagesUseCase);
                },
            },
        );


        container.register<RefreshTokenController>(
            CONTROLLER_TOKENS.RefreshTokenController,
            {
                useFactory: (dependencyContainer) => {
                    const refreshTokenUseCase =
                        dependencyContainer.resolve<IRefreshTokenUseCase>(
                            USECASE_TOKENS.IRefreshTokenUseCase,
                        );

                    return new RefreshTokenController(refreshTokenUseCase);
                },
            },
        );

        container.register<UpdateImageTitleController>(
            CONTROLLER_TOKENS.UpdateImageTitleController,
            {
                useFactory: (dependencyContainer) => {
                    const updateImageTitleUseCase =
                        dependencyContainer.resolve<IUpdateImageTitleUseCase>(
                            USECASE_TOKENS.IUpdateImageTitleUseCase
                        );

                    return new UpdateImageTitleController(updateImageTitleUseCase);
                },
            }
        );

        container.register<ReplaceImageController>(
            CONTROLLER_TOKENS.ReplaceImageController,
            {
                useFactory: (dependencyContainer) => {
                    const replaceImageUseCase =
                        dependencyContainer.resolve<IReplaceImageUseCase>(
                            USECASE_TOKENS.IReplaceImageUseCase,
                        );

                    return new ReplaceImageController(replaceImageUseCase);
                },
            },
        );

        container.register<DeleteImageController>(
            CONTROLLER_TOKENS.DeleteImageController,
            {
                useFactory: (dependencyContainer) => {
                    const deleteImageUseCase =
                        dependencyContainer.resolve<IDeleteImageUseCase>(
                            USECASE_TOKENS.IDeleteImageUseCase,
                        );

                    return new DeleteImageController(deleteImageUseCase);
                },
            },
        );


    }
}
