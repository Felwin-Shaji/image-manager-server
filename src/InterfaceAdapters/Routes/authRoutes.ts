import { Router } from "express";

import { registerUserController } from "../../Infrastructure/DI/Resolver";
import { asyncHandler } from "../Middleware/asyncHandler";

const router = Router();

router.post("/register", asyncHandler(registerUserController.handle)
);

export default router;