import crypto from "node:crypto";

const SECRET_KEY = "test-key";

export function hashPassword(password: string) {
  return crypto.createHmac("sha256", SECRET_KEY).update(password).digest("hex");
}

export function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}
