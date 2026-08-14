import { Router, Request, Response } from "express";
import redisClient from "../redis-client";
import {
  hashPassword,
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../util";
import { CONFIG } from "../config";
import { authenticateJWT, AuthenticatedRequest } from "../middleware/auth-jwt";

export const jwtRouter = Router();

// POST /auth/jwt/signup
jwtRouter.post("/signup", async (req: Request, res: Response) => {
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
    const role = "customer";

    await redisClient.hSet(`user:${email}`, {
      email,
      hasedPassword: hashedPasswd,
      role,
    });

    // Generate tokens
    const payload = { email, role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Hash and store refresh token in Redis with TTL
    const hashedRefreshToken = hashToken(refreshToken);
    await redisClient.setEx(
      `refreshToken:${email}`,
      CONFIG.REFRESH_TOKEN_TTL_SECONDS,
      hashedRefreshToken,
    );

    // Set HttpOnly cookies
    res.cookie(
      CONFIG.COOKIES.ACCESS_TOKEN_NAME,
      accessToken,
      CONFIG.COOKIES.OPTIONS,
    );
    res.cookie(
      CONFIG.COOKIES.REFRESH_TOKEN_NAME,
      refreshToken,
      CONFIG.COOKIES.OPTIONS,
    );

    return res.status(201).json({
      message: "User registered and logged in successfully!",
      user: { email, role },
    });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
});

// POST /auth/jwt/login
jwtRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }

  try {
    const hashedPasswd = hashPassword(password);
    const storedHasedPasswd = await redisClient.hGet(
      `user:${email}`,
      "hasedPassword",
    );
    const role = (await redisClient.hGet(`user:${email}`, "role")) || "customer";

    if (!storedHasedPasswd || hashedPasswd !== storedHasedPasswd) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    // Generate tokens
    const payload = { email, role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Hash and store refresh token in Redis with TTL
    const hashedRefreshToken = hashToken(refreshToken);
    await redisClient.setEx(
      `refreshToken:${email}`,
      CONFIG.REFRESH_TOKEN_TTL_SECONDS,
      hashedRefreshToken,
    );

    // Set HttpOnly cookies
    res.cookie(
      CONFIG.COOKIES.ACCESS_TOKEN_NAME,
      accessToken,
      CONFIG.COOKIES.OPTIONS,
    );
    res.cookie(
      CONFIG.COOKIES.REFRESH_TOKEN_NAME,
      refreshToken,
      CONFIG.COOKIES.OPTIONS,
    );

    return res.json({
      message: "Logged in successfully!",
      user: { email, role },
    });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
});

// GET /auth/jwt/profile (Protected Route - Stateless verification, no DB lookup)
jwtRouter.get(
  "/profile",
  authenticateJWT,
  (req: AuthenticatedRequest, res: Response) => {
    return res.json({
      message: "Access token verified successfully (Stateless)",
      user: req.user,
    });
  },
);

// POST /auth/jwt/refresh (Refresh Token Rotation)
jwtRouter.post("/refresh", async (req: Request, res: Response) => {
  const refreshToken =
    req.cookies?.[CONFIG.COOKIES.REFRESH_TOKEN_NAME] || req.body?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      error: "Refresh token missing! Please log in again.",
      code: "REFRESH_TOKEN_MISSING",
    });
  }

  try {
    // 1. Verify token signature & expiration
    const decoded = verifyRefreshToken(refreshToken);
    const email = decoded.email;

    // 2. Check hashed refresh token against Redis
    const incomingHash = hashToken(refreshToken);
    const storedHash = await redisClient.get(`refreshToken:${email}`);

    if (!storedHash) {
      // Refresh token was revoked or expired in Redis
      res.clearCookie(CONFIG.COOKIES.ACCESS_TOKEN_NAME);
      res.clearCookie(CONFIG.COOKIES.REFRESH_TOKEN_NAME);
      return res.status(401).json({
        error: "Refresh token has expired or been revoked. Please log in again.",
        code: "REFRESH_TOKEN_REVOKED",
      });
    }

    if (storedHash !== incomingHash) {
      // Possible token reuse attack detected! Invalidate all tokens for this user
      await redisClient.del(`refreshToken:${email}`);
      res.clearCookie(CONFIG.COOKIES.ACCESS_TOKEN_NAME);
      res.clearCookie(CONFIG.COOKIES.REFRESH_TOKEN_NAME);
      return res.status(403).json({
        error: "Token reuse detected! All active sessions revoked. Please log in again.",
        code: "TOKEN_REUSE_DETECTED",
      });
    }

    // 3. Issue new Access Token & new Refresh Token (Token Rotation)
    const newPayload = { email: decoded.email, role: decoded.role };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    // 4. Update Redis with new hashed refresh token and reset TTL
    const newHashedRefreshToken = hashToken(newRefreshToken);
    await redisClient.setEx(
      `refreshToken:${email}`,
      CONFIG.REFRESH_TOKEN_TTL_SECONDS,
      newHashedRefreshToken,
    );

    // 5. Update cookies
    res.cookie(
      CONFIG.COOKIES.ACCESS_TOKEN_NAME,
      newAccessToken,
      CONFIG.COOKIES.OPTIONS,
    );
    res.cookie(
      CONFIG.COOKIES.REFRESH_TOKEN_NAME,
      newRefreshToken,
      CONFIG.COOKIES.OPTIONS,
    );

    return res.json({
      message: "Tokens rotated and refreshed successfully!",
      user: newPayload,
    });
  } catch (error) {
    res.clearCookie(CONFIG.COOKIES.ACCESS_TOKEN_NAME);
    res.clearCookie(CONFIG.COOKIES.REFRESH_TOKEN_NAME);
    return res.status(401).json({
      error: "Invalid or expired refresh token. Please log in again.",
      code: "INVALID_REFRESH_TOKEN",
    });
  }
});

// POST /auth/jwt/logout
jwtRouter.post("/logout", async (req: Request, res: Response) => {
  const refreshToken =
    req.cookies?.[CONFIG.COOKIES.REFRESH_TOKEN_NAME] || req.body?.refreshToken;

  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded?.email) {
        await redisClient.del(`refreshToken:${decoded.email}`);
      }
    } catch {
      // If token decoding fails, proceed to clear cookies anyway
    }
  }

  res.clearCookie(CONFIG.COOKIES.ACCESS_TOKEN_NAME);
  res.clearCookie(CONFIG.COOKIES.REFRESH_TOKEN_NAME);

  return res.status(200).json({ message: "Logged out successfully!" });
});
