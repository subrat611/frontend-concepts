import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("connect", () => console.log("🔄 Connecting to Redis..."));
redisClient.on("ready", () => console.log("✅ Redis client is ready to use"));
redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));

export default redisClient;
