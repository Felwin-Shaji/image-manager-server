import { Router } from "express";

import { loginUserController, refreshTokenController, registerUserController } from "../../Infrastructure/DI/Resolver";
import { asyncHandler } from "../Middleware/asyncHandler";
import { validateLoginRequest } from "../Middleware/Validation/validateLoginRequest";

const router = Router();

router.post("/register", asyncHandler(registerUserController.handle));
router.post("/login", validateLoginRequest, asyncHandler(loginUserController.handle));
router.post("/refresh", asyncHandler(refreshTokenController.handle));

export default router;
