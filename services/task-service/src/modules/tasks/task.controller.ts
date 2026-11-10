import type { RequestHandler } from "express";

import {
  createTask as createTaskService,
  getTasks as getTasksService,
  getTaskById as getTaskByIdService,
  updateTask as updateTaskService,
  updateTaskStatus as updateTaskStatusService,
  deleteTask as deleteTaskService,
} from "./task.service.js";

import {
  getTasksQuerySchema,
  taskIdSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
  type UpdateTaskStatusInput,
} from "./task.schema.js";

// Create task
export const createTask: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const task = await createTaskService(
      req.user.userId,
      req.body as CreateTaskInput
    );

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tasks
export const getTasks: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const filters = getTasksQuerySchema.safeParse(req.query);

    if (!filters.success) {
      res.status(400).json({
        message: "Invalid query parameters",
        errors: filters.error.issues,
      });
      return;
    }

    const result = await getTasksService(
      req.user.userId,
      filters.data
    );

    res.status(200).json({
      message: "Tasks fetched successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Get task by ID
export const getTaskById: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const id = taskIdSchema.safeParse(req.params.taskId);

    if (!id.success) {
      res.status(400).json({ message: "Invalid task ID" });
      return;
    }

    const task = await getTaskByIdService(
      req.user.userId,
      id.data
    );

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Update task
export const updateTask: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const id = taskIdSchema.safeParse(req.params.taskId);

    if (!id.success) {
      res.status(400).json({ message: "Invalid task ID" });
      return;
    }

    const task = await updateTaskService(
      req.user.userId,
      id.data,
      req.body as UpdateTaskInput
    );

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Update task status
export const updateTaskStatus: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const id = taskIdSchema.safeParse(req.params.taskId);

    if (!id.success) {
      res.status(400).json({ message: "Invalid task ID" });
      return;
    }

    const task = await updateTaskStatusService(
      req.user.userId,
      id.data,
      req.body as UpdateTaskStatusInput
    );

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Delete task
export const deleteTask: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const id = taskIdSchema.safeParse(req.params.taskId);

    if (!id.success) {
      res.status(400).json({ message: "Invalid task ID" });
      return;
    }

    const deleted = await deleteTaskService(
      req.user.userId,
      id.data
    );

    if (!deleted) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};