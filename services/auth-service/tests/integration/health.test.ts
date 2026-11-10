import { describe, expect, it } from "vitest";
import request from "supertest";

// Confirm this is the actual Auth Service app export; do not import server.ts.
import app from "../../src/app.js";

describe("Auth Service health endpoint", () => {
  it("returns HTTP 200", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
  });
});
