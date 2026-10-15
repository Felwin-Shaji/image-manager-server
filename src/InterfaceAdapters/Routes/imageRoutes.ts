import { Router } from "express";
import { authenticate } from "../Middleware/authenticateAccessToken";

const router = Router();

// Example of applying authentication to an individual image route.
router.get("/example", authenticate, (req, res): void => {
    res.status(200).json({
        success: true,
        message: "Authenticated image route example",
        userId: req.auth?.userId
    });
});

export default router;
