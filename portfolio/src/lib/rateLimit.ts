import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Basic memory-based rate limiter
 * @param req The incoming request
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 */
export async function rateLimit(req: NextRequest, limit: number = 60, windowMs: number = 60000) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();

  if (!store[ip] || now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { success: true, remaining: limit - 1 };
  }

  store[ip].count++;

  if (store[ip].count > limit) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: limit - store[ip].count };
}
