import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";

import redisClient from "./redis-client";
import { generateSessionId, hashPassword } from "./util";

const app = express();
const PORT = process.env.PORT || 3000;

// global middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parses URL encoded data

app.get("/health-check", (req: Request, res: Response) => {
  res.json("Server up and running...");
});

app.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Email and password are required!");
  }

  try {
    const existingUser = await redisClient.hGet(
      `user:${email}`,
      "hasedPassword",
    );
    if (existingUser) {
      return res.status(409).json("User already exists!");
    }

    const hashedPasswd = hashPassword(password);

    await redisClient.hSet(`user:${email}`, {
      email,
      hasedPassword: hashedPasswd,
      role: "customer",
    });

    const sessionId = generateSessionId();

    await redisClient.setEx(
      `session:${sessionId}`,
      300,
      JSON.stringify({ email, role: "customer" }),
    );

    res.cookie("sessionId", sessionId, { httpOnly: true, secure: true });
    return res.status(201).json("User created and logged in successfully!");
  } catch (error) {
    return res.status(500).json("Something went wrong!");
  }
});

app.post("/login", async (req: Request, res: Response) => {
  /**
   * 1. read the email, password
   * 2. validate the credentials
   *      - if check credentials first -> Credentials fail -> Reject request
   *      - else if check for already session present or not
   *      - if present invalidate/destroy it and generate new one
   * 3. store the session (user id, roles, permissions, exp time, etc)
   * 4. response with setting the http cookie (set cookie) - session id, httponly, secure
   */

  const { email, password } = req.body;
  const { sessionId } = req.cookies;

  if (!email || !password) {
    return res.status(400).json("Email and password are required!");
  }

  try {
    const hashedPasswd = hashPassword(password);
    const cachedData = await redisClient.get(`session:${sessionId}`);
    const storedHasedPasswd = await redisClient.hGet(
      `user:${email}`,
      "hasedPassword",
    );

    if (hashedPasswd !== storedHasedPasswd)
      return res.status(401).json("Invalid Credential!");

    if (cachedData) await redisClient.del(`session:${sessionId}`);

    const newSessionId = generateSessionId();

    await redisClient.setEx(
      `session:${newSessionId}`,
      300,
      JSON.stringify({ email, role: "customer" }),
    );

    res.cookie("sessionId", newSessionId, { httpOnly: true, secure: true });
    res.json("Sucess");
  } catch (error) {
    res.json("Something went wrong!");
  }
});

app.post("/logout", async (req: Request, res: Response) => {
  const { sessionId } = req.cookies;

  if (!sessionId) {
    return res.status(400).json("No active session found!");
  }

  try {
    // 1. Delete session from Redis
    await redisClient.del(`session:${sessionId}`);

    // 2. Clear the browser cookie
    res.clearCookie("sessionId");

    return res.status(200).json("Logged out successfully!");
  } catch (error) {
    return res.status(500).json("Something went wrong!");
  }
});

async function startServer() {
  try {
    await redisClient.connect();

    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1);
  }
}

startServer();
