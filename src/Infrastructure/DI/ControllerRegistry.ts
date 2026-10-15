import { container } from "tsyringe";

import { CONTROLLER_TOKENS } from "./Tokens/ControllerTokens";
import { USECASE_TOKENS } from "./Tokens/UseCaseTokens";

import { RegisterUserController } from "../../InterfaceAdapters/Controllers/Auth/RegisterUserController";
import { LoginUserController } from "../../InterfaceAdapters/Controllers/Auth/LoginUserController";
import type { IRegisterUserUseCase } from "../../Application/Interfaces/UseCases/IRegisterUserUseCase";
import type { ILoginUserUseCase } from "../../Application/Interfaces/UseCases/ILoginUserUseCase";

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

    }
}
