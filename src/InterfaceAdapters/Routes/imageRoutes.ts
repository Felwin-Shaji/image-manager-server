import { Router } from "express";
import { getUserImagesController, uploadImageController } from "../../Infrastructure/DI/Resolver";
import { asyncHandler } from "../Middleware/asyncHandler";
import { authenticate } from "../Middleware/authenticateAccessToken";
import { parseImageUpload } from "../Middleware/parseImageUpload";
import { validateImageUpload } from "../Middleware/Validation/validateImageUpload";

const router = Router();

router.post(
    "/upload",
    authenticate,
    parseImageUpload,
    validateImageUpload,
    asyncHandler(uploadImageController.handle)
);

router.get(
    "/",
    authenticate,
    asyncHandler(getUserImagesController.handle),
);

export default router;
