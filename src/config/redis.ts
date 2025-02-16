const Redis = require("ioredis");

export const redis = new Redis({
  host: process.env.REDIS_CONTAINER_NAME,
  port: process.env.REDIS_PORT,
});

export async function checkRedisConnection() {
  try {
    await redis.ping(); 
    console.log("✅ Redis connection is active!");
  } catch (error) {
    console.error("❌ Redis connection failed:", error.message);
    throw error;
  }
}

export async function getCache(key: string) {
  const value = await redis.get(key);
  return value;
}

export async function setCache(key: string, value: string, ttl: number) {
  await redis.setex(key, ttl, value);
}