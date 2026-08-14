import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";

import redisClient from "./redis-client";
import { CONFIG } from "./config";
import { sessionRouter } from "./router/session.router";
import { jwtRouter } from "./router/jwt.router";

const app = express();

// Global middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health-check", (req: Request, res: Response) => {
  res.json("Server up and running...");
});

// Auth Routers
app.use("/auth/session", sessionRouter);
app.use("/auth/jwt", jwtRouter);

// Backwards-compatible legacy session aliases
app.use("/", sessionRouter);

async function startServer() {
  try {
    await redisClient.connect();

    app.listen(CONFIG.PORT, () => {
      console.log(
        `⚡️[server]: Server is running at http://localhost:${CONFIG.PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1);
  }
}

startServer();
