import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, DecodedToken } from "../util";
import { CONFIG } from "../config";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

export function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  // Extract token from cookie or Authorization header
  let token = req.cookies?.[CONFIG.COOKIES.ACCESS_TOKEN_NAME];

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      error: "Access token missing! Please log in.",
      code: "TOKEN_MISSING",
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "Access token has expired. Please refresh your token.",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      error: "Invalid access token.",
      code: "TOKEN_INVALID",
    });
  }
}
