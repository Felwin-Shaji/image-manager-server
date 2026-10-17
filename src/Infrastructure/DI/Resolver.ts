import { container } from "tsyringe";
import { DependencyContainer } from "./DependencyContainer";

import { RegisterUserController } from "../../InterfaceAdapters/Controllers/Auth/RegisterUserController";
import { LoginUserController } from "../../InterfaceAdapters/Controllers/Auth/LoginUserController";
import { UploadImageController } from "../../InterfaceAdapters/Controllers/Images/UploadImageController";
import { CONTROLLER_TOKENS } from "./Tokens/ControllerTokens";
import { GetUserImagesController } from "../../InterfaceAdapters/Controllers/Images/GetUserImagesController";
import { RefreshTokenController } from "../../InterfaceAdapters/Controllers/Auth/RefreshTokenController";
import { UpdateImageTitleController } from "../../InterfaceAdapters/Controllers/Images/UpdateImageTitleController";
import { ReplaceImageController } from "../../InterfaceAdapters/Controllers/Images/ReplaceImageController";
import { DeleteImageController } from "../../InterfaceAdapters/Controllers/Images/DeleteImageController";
import { UpdateImageOrderController } from "../../InterfaceAdapters/Controllers/Images/UpdateImageOrderController";

DependencyContainer.registerDependencies();

export const registerUserController = container.resolve<RegisterUserController>(CONTROLLER_TOKENS.RegisterUserController);
export const loginUserController = container.resolve<LoginUserController>(CONTROLLER_TOKENS.LoginUserController);
export const refreshTokenController = container.resolve<RefreshTokenController>(CONTROLLER_TOKENS.RefreshTokenController);

export const uploadImageController = container.resolve<UploadImageController>(CONTROLLER_TOKENS.UploadImageController);
export const getUserImagesController = container.resolve<GetUserImagesController>(CONTROLLER_TOKENS.GetUserImagesController);
export const updateImageTitleController = container.resolve<UpdateImageTitleController>(CONTROLLER_TOKENS.UpdateImageTitleController);
export const replaceImageController = container.resolve<ReplaceImageController>(CONTROLLER_TOKENS.ReplaceImageController,);
export const deleteImageController = container.resolve<DeleteImageController>(CONTROLLER_TOKENS.DeleteImageController,);
export const updateImageOrderController = container.resolve<UpdateImageOrderController>(CONTROLLER_TOKENS.UpdateImageOrderController,);
