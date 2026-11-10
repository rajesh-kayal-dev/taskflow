import request from "supertest";
import { describe, it, expect } from "vitest";

import app from "../../src/app.js";
import { env } from "../../src/config/env.js";

describe("API Gateway CORS", () => {
  it("should allow requests from the configured frontend origin", async () => {
    const response = await request(app)
      .get("/health")
      .set("Origin", env.FRONTEND_URL);

    expect(response.status).toBe(200);

    expect(response.headers["access-control-allow-origin"]).toBe(
      env.FRONTEND_URL,
    );
  });

  it("should allow credentials from the configured frontend origin", async () => {
    const response = await request(app)
      .get("/health")
      .set("Origin", env.FRONTEND_URL);

    expect(
      response.headers["access-control-allow-credentials"],
    ).toBe("true");
  });

  it("should handle CORS preflight requests", async () => {
    const response = await request(app)
      .options("/health")
      .set("Origin", env.FRONTEND_URL)
      .set("Access-Control-Request-Method", "GET");

    expect(response.status).toBe(204);

    expect(response.headers["access-control-allow-origin"]).toBe(
      env.FRONTEND_URL,
    );

    expect(
      response.headers["access-control-allow-credentials"],
    ).toBe("true");
  });

  it("should not allow a different origin", async () => {
    const unauthorizedOrigin = "http://malicious.example";

    const response = await request(app)
      .get("/health")
      .set("Origin", unauthorizedOrigin);

    expect(response.status).toBe(200);

    expect(response.headers["access-control-allow-origin"]).not.toBe(
      unauthorizedOrigin,
    );
  });
});