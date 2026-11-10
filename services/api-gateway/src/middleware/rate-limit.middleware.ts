import rateLimit from "express-rate-limit";

import { env } from "../config/env.js";

// General API rate limiter
export const generalRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX_REQUESTS,

    standardHeaders: true,
    legacyHeaders: false,

    skip: (req) => req.path === "/health",

    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});

// Authentication rate limiter
// Authentication rate limiter
export const authRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.AUTH_RATE_LIMIT_MAX_REQUESTS,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later.",
    },
});