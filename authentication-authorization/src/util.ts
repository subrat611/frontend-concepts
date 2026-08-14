import crypto from "node:crypto";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { CONFIG } from "./config";

export interface UserPayload {
  email: string;
  role: string;
}

export interface DecodedToken extends JwtPayload, UserPayload {}

export function hashPassword(password: string): string {
  return crypto
    .createHmac("sha256", CONFIG.PASSWORD_SECRET)
    .update(password)
    .digest("hex");
}

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateAccessToken(payload: UserPayload): string {
  const options: SignOptions = {
    expiresIn: CONFIG.ACCESS_TOKEN_EXPIRY as unknown as number,
  };
  return jwt.sign(payload, CONFIG.JWT_ACCESS_SECRET, options);
}

export function generateRefreshToken(payload: UserPayload): string {
  const options: SignOptions = {
    expiresIn: CONFIG.REFRESH_TOKEN_EXPIRY as unknown as number,
  };
  return jwt.sign(payload, CONFIG.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): DecodedToken {
  return jwt.verify(token, CONFIG.JWT_ACCESS_SECRET) as DecodedToken;
}

export function verifyRefreshToken(token: string): DecodedToken {
  return jwt.verify(token, CONFIG.JWT_REFRESH_SECRET) as DecodedToken;
}
