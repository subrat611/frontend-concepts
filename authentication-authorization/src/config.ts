export const CONFIG = {
  PORT: process.env.PORT || 3000,
  PASSWORD_SECRET: process.env.PASSWORD_SECRET || "test-key",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "access-token-secret-key",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh-token-secret-key",
  ACCESS_TOKEN_EXPIRY: "15m", // 15 minutes
  REFRESH_TOKEN_EXPIRY: "7d", // 7 days
  REFRESH_TOKEN_TTL_SECONDS: 7 * 24 * 60 * 60, // 7 days in seconds for Redis TTL
  COOKIES: {
    ACCESS_TOKEN_NAME: "accessToken",
    REFRESH_TOKEN_NAME: "refreshToken",
    SESSION_ID_NAME: "sessionId",
    OPTIONS: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    },
  },
};
