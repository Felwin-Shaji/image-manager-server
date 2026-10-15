import "reflect-metadata";
import express from "express";

import { connectDatabase } from "./Infrastructure/Database/MongoDB";
import env from "./Infrastructure/Config/env";

import { loggerMiddleware } from "./InterfaceAdapters/Middleware/loggerMiddleware";
import authRoutes from "./InterfaceAdapters/Routes/authRoutes";
import imageRoutes from "./InterfaceAdapters/Routes/imageRoutes";
import { errorHandler } from "./InterfaceAdapters/Middleware/errorHandler";

const app = express();

// 1. Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Log requests
app.use(loggerMiddleware);

// 3. routes (the resolver registers dependencies before resolving controllers)
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

// 4. Handle errors after routes
app.use(errorHandler);

const startServer = async (): Promise<void> => {
    await connectDatabase();

    app.listen(env.port, () => {
        console.log(`Server running on http://localhost:${env.port}`);
    });
};

void startServer();
