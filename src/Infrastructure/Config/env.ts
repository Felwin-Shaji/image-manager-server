import dotenv from "dotenv";

dotenv.config();

const env = {
    port: Number(process.env.PORT) || 3000,

    mongoUri: process.env.MONGO_URI || "",

    jwtSecret: process.env.JWT_SECRET || "",

    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",

    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.CLOUDINARY_API_KEY || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || ""
    }
};

if (!env.mongoUri) {
    throw new Error("MONGO_URI is not defined");
}

if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
}

if (!env.jwtRefreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
}

if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    throw new Error(
        "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be defined"
    );
}
export default env;
