import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

import {
  generalRateLimiter,
  authRateLimiter,
} from "../../src/middleware/rate-limit.middleware.js";

describe("Rate Limit Middleware", () => {
  function createTestApp(
    middleware: typeof generalRateLimiter,
    path = "/test",
  ) {
    const app = express();

    app.set("trust proxy", 1);

    app.use(middleware);

    app.get(path, (_req, res) => {
      res.status(200).json({
        success: true,
        message: "Request successful",
      });
    });

    return app;
  }

  it("should allow requests within the general rate limit", async () => {
    const app = createTestApp(generalRateLimiter);

    const response = await request(app)
      .get("/test")
      .set("X-Forwarded-For", "203.0.113.10");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should return 429 when the general rate limit is exceeded", async () => {
    const app = createTestApp(generalRateLimiter);

    const ip = "203.0.113.11";

    for (let i = 0; i < 100; i++) {
      await request(app)
        .get("/test")
        .set("X-Forwarded-For", ip);
    }

    const response = await request(app)
      .get("/test")
      .set("X-Forwarded-For", ip);

    expect(response.status).toBe(429);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Too many requests. Please try again later.",
    );
  });

  it("should skip rate limiting for the health endpoint", async () => {
    const app = createTestApp(generalRateLimiter, "/health");

    const ip = "203.0.113.12";

    for (let i = 0; i < 105; i++) {
      const response = await request(app)
        .get("/health")
        .set("X-Forwarded-For", ip);

      expect(response.status).toBe(200);
    }
  });

  it("should enforce the authentication rate limit independently", async () => {
    const app = createTestApp(authRateLimiter, "/api/v1/auth/test");

    const ip = "203.0.113.13";

    for (let i = 0; i < 20; i++) {
      await request(app)
        .get("/api/v1/auth/test")
        .set("X-Forwarded-For", ip);
    }

    const response = await request(app)
      .get("/api/v1/auth/test")
      .set("X-Forwarded-For", ip);

    expect(response.status).toBe(429);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Too many authentication attempts. Please try again later.",
    );
  });
});