import { Options } from 'express-rate-limit'

export const RateLimitConfig: Partial<Options> = {
  windowMs: 15 * 60 * 1000, // 15 минути като число
  max: 100 // лимит като число
};