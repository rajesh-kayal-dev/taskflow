import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

import { requestIdMiddleware } from "./middleware/request-id.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

import { authProxy } from "./proxy/auth.proxy.js";
import { taskProxy } from "./proxy/task.proxy.js";

import {
  generalRateLimiter,
  authRateLimiter,
} from "./middleware/rate-limit.middleware.js";

const app: Express = express();

// Security headers
app.use(helmet());

// Generate unique request ID
app.use(requestIdMiddleware);

// HTTP request logging (disabled during tests)
if (env.NODE_ENV !== "test") {
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) =>
        req.headers["x-request-id"]?.toString() ?? "unknown",
    }),
  );
}

// CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

// General rate limit
app.use(generalRateLimiter);

// Authentication rate limit
app.use("/api/v1/auth", authRateLimiter);

// Health endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "api-gateway",
    status: "healthy",
  });
});

// Proxies
app.use(authProxy);
app.use(taskProxy);

// Handle unknown routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Centralized error handling
app.use(errorMiddleware);

export default app;