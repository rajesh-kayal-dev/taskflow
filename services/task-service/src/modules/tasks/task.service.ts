import { prisma } from "../../lib/prisma.js";

import type {
  CreateTaskInput,
  GetTasksQuery,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from "./task.schema.js";

// Create task
export const createTask = async (
  userId: string,
  data: CreateTaskInput
) => {
  return prisma.task.create({
    data: {
      userId,
      title: data.title,

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(data.priority !== undefined && {
        priority: data.priority,
      }),

      ...(data.dueDate !== undefined && {
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      }),
    },
  });
};

// Get all tasks
export const getTasks = async (
  userId: string,
  filters: GetTasksQuery
) => {
  const { page, limit, status, priority, search } = filters;

  const where = {
    userId,

    ...(status !== undefined && { status }),

    ...(priority !== undefined && { priority }),

    ...(search !== undefined && {
      title: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get task by ID
export const getTaskById = async (
  userId: string,
  taskId: string
) => {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });
};

// Update task
export const updateTask = async (
  userId: string,
  taskId: string,
  data: UpdateTaskInput
) => {
  const result = await prisma.task.updateMany({
    where: {
      id: taskId,
      userId,
    },
    data: {
      ...(data.title !== undefined && {
        title: data.title,
      }),

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(data.priority !== undefined && {
        priority: data.priority,
      }),

      ...(data.dueDate !== undefined && {
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      }),
    },
  });

  if (result.count === 0) {
    return null;
  }

  return prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });
};

// Update task status
export const updateTaskStatus = async (
  userId: string,
  taskId: string,
  data: UpdateTaskStatusInput
) => {
  const result = await prisma.task.updateMany({
    where: {
      id: taskId,
      userId,
    },
    data: {
      status: data.status,
    },
  });

  if (result.count === 0) {
    return null;
  }

  return prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });
};

// Delete task
export const deleteTask = async (
  userId: string,
  taskId: string
) => {
  const result = await prisma.task.deleteMany({
    where: {
      id: taskId,
      userId,
    },
  });

  return result.count > 0;
};