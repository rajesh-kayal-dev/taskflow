import { describe, it, expect, vi, beforeEach } from "vitest";
import type { RequestHandler } from "express";
import request from "supertest";

vi.mock("../../src/middleware/auth.middleware.js", () => ({
  authenticate: ((_req: any, _res: any, next: any) => next()) as RequestHandler
}));

vi.mock("../../src/middleware/validate.middleware.js", () => ({
  validate: () => ((_req: any, _res: any, next: any) => next()) as RequestHandler
}));

vi.mock("../../src/modules/tasks/task.controller.js", () => ({
  createTask: vi.fn((_req: any, res: any) =>
    res.status(201).json({ message: "Task created" })
  ),

  getTasks: vi.fn((_req: any, res: any) =>
    res.status(200).json({ tasks: [] })
  ),

  getTaskById: vi.fn((_req: any, res: any) =>
    res.status(200).json({ task: { id: "test-task-id" } })
  ),

  updateTask: vi.fn((_req: any, res: any) =>
    res.status(200).json({ message: "Task updated" })
  ),

  updateTaskStatus: vi.fn((_req: any, res: any) =>
    res.status(200).json({ message: "Task status updated" })
  ),

  deleteTask: vi.fn((_req: any, res: any) =>
    res.status(200).json({ message: "Task deleted" })
  )
}));

import app from "../../src/app.js";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
} from "../../src/modules/tasks/task.controller.js";

describe("Task Service API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return healthy status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
  });

  it("should create a task", async () => {
    const response = await request(app)
      .post("/api/v1/tasks")
      .send({ title: "Test task" });

    expect(response.status).toBe(201);
    expect(createTask).toHaveBeenCalledOnce();
  });

  it("should get all tasks", async () => {
    const response = await request(app).get("/api/v1/tasks");

    expect(response.status).toBe(200);
    expect(response.body.tasks).toEqual([]);
    expect(getTasks).toHaveBeenCalledOnce();
  });

  it("should get a task by ID", async () => {
    const response = await request(app)
      .get("/api/v1/tasks/test-task-id");

    expect(response.status).toBe(200);
    expect(response.body.task.id).toBe("test-task-id");
    expect(getTaskById).toHaveBeenCalledOnce();
  });

  it("should update a task", async () => {
    const response = await request(app)
      .patch("/api/v1/tasks/test-task-id")
      .send({ title: "Updated task" });

    expect(response.status).toBe(200);
    expect(updateTask).toHaveBeenCalledOnce();
  });

  it("should update task status", async () => {
    const response = await request(app)
      .patch("/api/v1/tasks/test-task-id/status")
      .send({ status: "COMPLETED" });

    expect(response.status).toBe(200);
    expect(updateTaskStatus).toHaveBeenCalledOnce();
  });

  it("should delete a task", async () => {
    const response = await request(app)
      .delete("/api/v1/tasks/test-task-id");

    expect(response.status).toBe(200);
    expect(deleteTask).toHaveBeenCalledOnce();
  });
});