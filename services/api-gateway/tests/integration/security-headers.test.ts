import request from "supertest";
import { describe, it, expect } from "vitest";

import app from "../../src/app.js";

describe("API Gateway Security Headers", () => {
  it("should include X-Content-Type-Options header", async () => {
    const response = await request(app).get("/health");

    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("should include X-Frame-Options header", async () => {
    const response = await request(app).get("/health");

    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
  });

  it("should include Content-Security-Policy header", async () => {
    const response = await request(app).get("/health");

    expect(response.headers["content-security-policy"]).toBeDefined();
  });

  it("should include Strict-Transport-Security header", async () => {
    const response = await request(app).get("/health");

    expect(
      response.headers["strict-transport-security"],
    ).toContain("max-age=");
  });
});