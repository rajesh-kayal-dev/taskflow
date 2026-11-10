import api from "../../../services/api";
import type {
  CreateTaskInput,
  Task,
  TaskStatus,
} from "../types/task.types";

interface GetTasksResponse {
  message: string;
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TaskResponse {
  message: string;
  task: Task;
}

const authConfig = (accessToken: string) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

// Fetch all tasks
export const getTasks = async (
  accessToken: string,
  params?: {
    page?: number;
    limit?: number;
    status?: TaskStatus;
    priority?: string;
    search?: string;
  }
): Promise<GetTasksResponse> => {
  const response = await api.get<GetTasksResponse>("/tasks", {
    ...authConfig(accessToken),
    params,
  });

  return response.data;
};

// Create a task
export const createTask = async (
  accessToken: string,
  data: CreateTaskInput
): Promise<Task> => {
  const response = await api.post<TaskResponse>(
    "/tasks",
    data,
    authConfig(accessToken)
  );

  return response.data.task;
};

// Update task status
export const updateTaskStatus = async (
  accessToken: string,
  taskId: string,
  status: TaskStatus
): Promise<Task> => {
  const response = await api.patch<TaskResponse>(
    `/tasks/${taskId}/status`,
    { status },
    authConfig(accessToken)
  );

  return response.data.task;
};

// Update task details
export const updateTask = async (
  accessToken: string,
  taskId: string,
  data: Partial<CreateTaskInput>
): Promise<Task> => {
  const response = await api.patch<TaskResponse>(
    `/tasks/${taskId}`,
    data,
    authConfig(accessToken)
  );

  return response.data.task;
};

// Delete a task
export const deleteTask = async (
  accessToken: string,
  taskId: string
): Promise<void> => {
  await api.delete(`/tasks/${taskId}`, authConfig(accessToken));
};