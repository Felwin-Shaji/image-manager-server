import jwt, { type SignOptions } from "jsonwebtoken";
import env from "../Config/env";
import { IJwtService } from "../../Application/Interfaces/Services/IJwtService";

export class JwtService implements IJwtService {
    generateAccessToken(userId: string): string {
        return jwt.sign(
            { userId, tokenType: "access" },
            env.jwtSecret,
            { expiresIn: "15m" }
        );
    }

    generateRefreshToken(userId: string): string {
        return jwt.sign(
            { userId, tokenType: "refresh" },
            env.jwtRefreshSecret,
            { expiresIn: "7d" }
        );
    }

    verifyAccessToken(token: string): { userId: string } {
        const decoded = jwt.verify(token, env.jwtSecret);

        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "string" ||
            decoded.tokenType !== "access"
        ) {
            throw new Error("Invalid access token");
        }

        return { userId: decoded.userId };
    }

    verifyRefreshToken(token: string): { userId: string } {
        const decoded = jwt.verify(token, env.jwtRefreshSecret);

        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "string" ||
            decoded.tokenType !== "refresh"
        ) {
            throw new Error("Invalid refresh token");
        }

        return { userId: decoded.userId };
    }
}
