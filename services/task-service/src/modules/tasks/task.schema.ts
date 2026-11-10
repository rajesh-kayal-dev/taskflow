import { z } from "zod";

// Create task
export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(150),

  description: z.string().trim().max(1000).nullable().optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  dueDate: z.iso.datetime({ offset: true }).nullable().optional(),
});

// Update task
export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),

  description: z.string().trim().max(1000).nullable().optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  dueDate: z.iso.datetime({ offset: true }).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required",
});

// Update task status
export const updateTaskStatusSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
});

// Get tasks query
export const getTasksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  search: z.string().trim().min(1).max(150).optional(),
});

// Task ID validation
export const taskIdSchema = z.string().uuid();

// Types
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;