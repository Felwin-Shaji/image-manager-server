import type { LoginUserInputDTO } from "../../../Application/DTOs/Auth/LoginUserDTO";
import { validateRequestBody } from "./validateRequestBody";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const isLoginUserInput = (body: unknown): body is LoginUserInputDTO => {
    if (!isRecord(body)) {
        return false;
    }

    return typeof body.email === "string"
        && EMAIL_PATTERN.test(body.email.trim())
        && typeof body.password === "string"
        && body.password.length > 0;
};

export const validateLoginRequest = validateRequestBody(
    isLoginUserInput,
    "Invalid login request"
);
