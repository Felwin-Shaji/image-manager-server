import { container } from "tsyringe";
import { DependencyContainer } from "./DependencyContainer";

import { RegisterUserController } from "../../InterfaceAdapters/Controllers/Auth/RegisterUserController";
import { CONTROLLER_TOKENS } from "./Tokens/ControllerTokens";

DependencyContainer.registerDependencies();

export const registerUserController = container.resolve<RegisterUserController>(CONTROLLER_TOKENS.RegisterUserController);