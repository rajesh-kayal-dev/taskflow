import { describe, expect, it } from "vitest";
import request from "supertest";

// Confirm this is the actual Task Service app export; do not import server.ts.
import app from "../../src/app.js";

describe("Task Service health endpoint", () => {
  it("returns a healthy response", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "success",
      message: "Task Service is running",
    });
  });
});
