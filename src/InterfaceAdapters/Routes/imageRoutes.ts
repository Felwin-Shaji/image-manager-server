import { Router } from "express";
import { deleteImageController, getUserImagesController, replaceImageController, updateImageOrderController, updateImageTitleController, uploadImageController } from "../../Infrastructure/DI/Resolver";
import { asyncHandler } from "../Middleware/asyncHandler";
import { authenticate } from "../Middleware/authenticateAccessToken";
import { parseImageUpload } from "../Middleware/parseImageUpload";
import { validateImageUpload } from "../Middleware/Validation/validateImageUpload";
import { parseImageReplacement } from "../Middleware/parseImageReplacement";
import { validateImageReplacement } from "../Middleware/Validation/validateImageReplacement";
import { validateImageOrder } from "../Middleware/Validation/validateImageOrder";

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

router.patch(
    "/:id/title",
    authenticate,
    asyncHandler(updateImageTitleController.handle),
);

router.patch(
    "/:id/replace",
    authenticate,
    parseImageReplacement,
    validateImageReplacement,
    asyncHandler(replaceImageController.handle),
);

router.delete(
    "/:id",
    authenticate,
    asyncHandler(deleteImageController.handle),
);

router.patch(
    "/order",
    authenticate,
    validateImageOrder,
    asyncHandler(updateImageOrderController.handle),

);

export default router;
