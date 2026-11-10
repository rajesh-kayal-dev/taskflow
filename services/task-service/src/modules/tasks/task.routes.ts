import { Router, type Router as ExpressRouter } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "./task.controller.js";

import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "./task.schema.js";

const router: ExpressRouter = Router();

// All task routes require authentication
router.use(authenticate);

// Create task
router.post("/", validate(createTaskSchema), createTask);

// Get all tasks
router.get("/", getTasks);

// Get task by ID
router.get("/:taskId", getTaskById);

// Update task status
router.patch(
  "/:taskId/status",
  validate(updateTaskStatusSchema),
  updateTaskStatus
);

// Update task
router.patch(
  "/:taskId",
  validate(updateTaskSchema),
  updateTask
);

// Delete task
router.delete("/:taskId", deleteTask);

export default router;