import express from "express";
import { connectDatabase } from "./Infrastructure/Database/MongoDB";
import env from "./Infrastructure/Config/env";


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Image Manager Server is running"
    });
});

const startServer = async (): Promise<void> => {
    await connectDatabase();

    app.listen(env.port, () => {
        console.log(`Server running on http://localhost:${env.port}`);
    });
};

startServer();