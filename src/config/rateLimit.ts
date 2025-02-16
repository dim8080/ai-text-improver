import { Options } from 'express-rate-limit'

export const RateLimitConfig: Partial<Options> = {
  windowMs: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS) : 15 * 60 * 1000, // Default 15 minutes
  max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 100 // Default  100 requests per 15 minutes
};