import { Router, Request, Response } from "express";
import redisClient from "../redis-client";
import { generateSessionId, hashPassword } from "../util";
import { CONFIG } from "../config";

export const sessionRouter = Router();

sessionRouter.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }

  try {
    const existingUser = await redisClient.hGet(
      `user:${email}`,
      "hasedPassword",
    );
    if (existingUser) {
      return res.status(409).json({ error: "User already exists!" });
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

    res.cookie(CONFIG.COOKIES.SESSION_ID_NAME, sessionId, CONFIG.COOKIES.OPTIONS);
    return res.status(201).json({ message: "User created and logged in successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
});

sessionRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const sessionId = req.cookies[CONFIG.COOKIES.SESSION_ID_NAME];

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }

  try {
    const hashedPasswd = hashPassword(password);
    const storedHasedPasswd = await redisClient.hGet(
      `user:${email}`,
      "hasedPassword",
    );

    if (!storedHasedPasswd || hashedPasswd !== storedHasedPasswd) {
      return res.status(401).json({ error: "Invalid Credentials!" });
    }

    if (sessionId) {
      await redisClient.del(`session:${sessionId}`);
    }

    const newSessionId = generateSessionId();

    await redisClient.setEx(
      `session:${newSessionId}`,
      300,
      JSON.stringify({ email, role: "customer" }),
    );

    res.cookie(CONFIG.COOKIES.SESSION_ID_NAME, newSessionId, CONFIG.COOKIES.OPTIONS);
    return res.json({ message: "Logged in successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
});

sessionRouter.get("/profile", async (req: Request, res: Response) => {
  const sessionId = req.cookies[CONFIG.COOKIES.SESSION_ID_NAME];

  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized! No session found." });
  }

  try {
    const sessionData = await redisClient.get(`session:${sessionId}`);
    if (!sessionData) {
      return res.status(401).json({ error: "Session expired or invalid!" });
    }

    return res.json({
      message: "Session profile retrieved",
      user: JSON.parse(sessionData),
    });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
});

sessionRouter.post("/logout", async (req: Request, res: Response) => {
  const sessionId = req.cookies[CONFIG.COOKIES.SESSION_ID_NAME];

  if (!sessionId) {
    return res.status(400).json({ error: "No active session found!" });
  }

  try {
    await redisClient.del(`session:${sessionId}`);
    res.clearCookie(CONFIG.COOKIES.SESSION_ID_NAME);

    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
});
