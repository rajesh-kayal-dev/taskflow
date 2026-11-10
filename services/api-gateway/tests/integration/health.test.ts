import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("API Gateway health endpoint", () => {
  it("returns a healthy response and request ID", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      service: "api-gateway",
      status: "healthy",
    });
    expect(response.headers["x-request-id"]).toBeTypeOf("string");
  });
});
