import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";

import app from "../../src/app.js";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../../src/modules/auth.service.js";

vi.mock("../../src/modules/auth.service.js", () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  refreshAccessToken: vi.fn(),
  logoutUser: vi.fn(),
}));

const mockedRegisterUser = vi.mocked(registerUser);
const mockedLoginUser = vi.mocked(loginUser);
const mockedRefreshAccessToken = vi.mocked(refreshAccessToken);
const mockedLogoutUser = vi.mocked(logoutUser);

describe("Auth Service API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /health", () => {
    it("should return healthy status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.service).toBe("auth-service");
      expect(response.body.status).toBe("healthy");
    });
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user", async () => {
      mockedRegisterUser.mockResolvedValue({
        id: "test-user-id",
        email: "test@example.test",
      } as Awaited<ReturnType<typeof registerUser>>);

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "test@example.test",
          password: "StrongPassword!123",
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Registration successful");
      expect(response.body.data.email).toBe("test@example.test");
      expect(mockedRegisterUser).toHaveBeenCalledOnce();
    });

    it("should reject invalid registration data", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "invalid-email",
          password: "123",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Invalid email or password",
      );
    });

    it("should reject duplicate email registration", async () => {
      mockedRegisterUser.mockRejectedValue(
        new Error("Email is already registered"),
      );

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "existing@example.test",
          password: "StrongPassword!123",
        });

      expect(response.status).toBe(409);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login successfully", async () => {
      mockedLoginUser.mockResolvedValue({
        user: {
          id: "test-user-id",
          email: "test@example.test",
        },
        accessToken: "fake-access-token",
        refreshToken: "fake-refresh-token",
      } as Awaited<ReturnType<typeof loginUser>>);

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@example.test",
          password: "StrongPassword!123",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.accessToken).toBe("fake-access-token");

      expect(response.headers["set-cookie"]).toBeDefined();

      expect(mockedLoginUser).toHaveBeenCalledOnce();
    });

    it("should reject invalid credentials", async () => {
      mockedLoginUser.mockRejectedValue(
        new Error("Invalid email or password"),
      );

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@example.test",
          password: "WrongPassword!123",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "Invalid email or password",
      );
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("should reject refresh without a token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/refresh");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "Refresh token required",
      );
    });

    it("should generate a new access token", async () => {
      mockedRefreshAccessToken.mockResolvedValue(
        "new-fake-access-token",
      );

      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", "taskflow_refresh=fake-refresh-token");

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBe(
        "new-fake-access-token",
      );

      expect(mockedRefreshAccessToken).toHaveBeenCalledWith(
        "fake-refresh-token",
      );
    });

    it("should reject an invalid refresh token", async () => {
      mockedRefreshAccessToken.mockRejectedValue(
        new Error("Invalid refresh token"),
      );

      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", "taskflow_refresh=invalid-token");

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should logout successfully", async () => {
      mockedLogoutUser.mockResolvedValue(undefined);

      const response = await request(app)
        .post("/api/v1/auth/logout")
        .set("Cookie", "taskflow_refresh=fake-refresh-token");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logout successful");

      expect(mockedLogoutUser).toHaveBeenCalledWith(
        "fake-refresh-token",
      );

      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should logout even without a refresh token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logout successful");

      expect(mockedLogoutUser).not.toHaveBeenCalled();
    });
  });
});