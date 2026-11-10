import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

import { requestIdMiddleware } from "../../src/middleware/request-id.middleware.js";

describe("Request ID Middleware", () => {
  const createTestApp = () => {
    const app = express();

    app.use(requestIdMiddleware);

    app.get("/test", (req, res) => {
      res.status(200).json({
        requestId: req.headers["x-request-id"],
      });
    });

    return app;
  };

  it("should preserve an existing request ID", async () => {
    const app = createTestApp();
    const existingId = "test-request-123";

    const response = await request(app)
      .get("/test")
      .set("x-request-id", existingId);

    expect(response.status).toBe(200);
    expect(response.headers["x-request-id"]).toBe(existingId);
    expect(response.body.requestId).toBe(existingId);
  });

  it("should generate a UUID when request ID is missing", async () => {
    const app = createTestApp();

    const response = await request(app).get("/test");

    expect(response.status).toBe(200);
    expect(response.headers["x-request-id"]).toBeDefined();

    expect(response.headers["x-request-id"]).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it("should return the same request ID in response header and body", async () => {
    const app = createTestApp();

    const response = await request(app).get("/test");

    expect(response.headers["x-request-id"]).toBe(
      response.body.requestId
    );
  });
});