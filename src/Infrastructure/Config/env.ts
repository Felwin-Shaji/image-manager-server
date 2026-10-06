import dotenv from "dotenv";

dotenv.config();

const env = {
    port: Number(process.env.PORT) || 3000,

    mongoUri: process.env.MONGO_URI || "",

    jwtSecret: process.env.JWT_SECRET || "",

    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d"
};

console.log(env)

if (!env.mongoUri) {
    throw new Error("MONGO_URI is not defined");
}

if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
}

export default env;