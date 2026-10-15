import { container } from "tsyringe";
import { DependencyContainer } from "./DependencyContainer";

import { RegisterUserController } from "../../InterfaceAdapters/Controllers/Auth/RegisterUserController";
import { LoginUserController } from "../../InterfaceAdapters/Controllers/Auth/LoginUserController";
import { UploadImageController } from "../../InterfaceAdapters/Controllers/Images/UploadImageController";
import { CONTROLLER_TOKENS } from "./Tokens/ControllerTokens";

DependencyContainer.registerDependencies();

export const registerUserController = container.resolve<RegisterUserController>(CONTROLLER_TOKENS.RegisterUserController);
export const loginUserController = container.resolve<LoginUserController>(CONTROLLER_TOKENS.LoginUserController);
export const uploadImageController = container.resolve<UploadImageController>(CONTROLLER_TOKENS.UploadImageController);
