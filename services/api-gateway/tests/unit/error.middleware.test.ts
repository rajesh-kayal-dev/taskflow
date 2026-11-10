import express from "express";
import request from "supertest";
import { describe, it, expect, vi } from "vitest";

import { errorMiddleware } from "../../src/middleware/error.middleware.js";

describe("Error Middleware", () => {
  function createTestApp() {
    const app = express();

    app.get("/test", (_req, _res, next) => {
      next(new Error("Something went wrong"));
    });

    app.get("/custom-error", (_req, _res, next) => {
      const error = new Error("Database connection failed");
      next(error);
    });

    app.use(errorMiddleware);

    return app;
  }

  it("should return HTTP 500 for unexpected errors", async () => {
    const app = createTestApp();

    const response = await request(app).get("/test");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Internal server error");
  });

  it("should include request ID in the error response", async () => {
    const app = createTestApp();

    const requestId = "test-error-request-123";

    const response = await request(app)
      .get("/test")
      .set("x-request-id", requestId);

    expect(response.status).toBe(500);
    expect(response.body.requestId).toBe(requestId);
  });

  it("should not expose internal error details", async () => {
    const app = createTestApp();

    const response = await request(app).get("/custom-error");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
    expect(response.body.message).not.toContain(
      "Database connection failed",
    );
  });
});