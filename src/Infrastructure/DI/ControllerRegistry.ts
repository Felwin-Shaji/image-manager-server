import { container } from "tsyringe";

import { CONTROLLER_TOKENS } from "./Tokens/ControllerTokens";
import { USECASE_TOKENS } from "./Tokens/UseCaseTokens";

import { RegisterUserController } from "../../InterfaceAdapters/Controllers/Auth/RegisterUserController";
import type { IRegisterUserUseCase } from "../../Application/Interfaces/UseCases/IRegisterUserUseCase";

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

    }
}