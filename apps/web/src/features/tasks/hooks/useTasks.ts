import { useCallback, useEffect, useState } from "react";

import {
  createTask as createTaskApi,
  deleteTask as deleteTaskApi,
  getTasks,
  updateTaskStatus as updateTaskStatusApi,
} from "../services/task.service";

import type {
  CreateTaskInput,
  Task,
  TaskStatus,
} from "../types/task.types";

interface UseTasksOptions {
  accessToken: string | null;
  status?: TaskStatus;
  search?: string;
}

export const useTasks = ({
  accessToken,
  status,
  search,
}: UseTasksOptions) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!accessToken) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const response = await getTasks(accessToken, {
        page: 1,
        limit: 100,
        status,
        search: search?.trim() || undefined,
      });

      setTasks(response.tasks);
      setError(null);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Fetch tasks error:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, status, search]);

  useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      if (!accessToken) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        const response = await getTasks(accessToken, {
          page: 1,
          limit: 100,
          status,
          search: search?.trim() || undefined,
        });

        if (!cancelled) {
          setTasks(response.tasks);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load tasks. Please try again.");
          console.error("Fetch tasks error:", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTasks();

    return () => {
      cancelled = true;
    };
  }, [accessToken, status, search]);

  const addTask = async (data: CreateTaskInput) => {
    if (!accessToken) return;

    try {
      setError(null);

      const newTask = await createTaskApi(accessToken, data);

      setTasks((currentTasks) => [newTask, ...currentTasks]);

      return newTask;
    } catch (err) {
      setError("Failed to create task. Please try again.");
      console.error("Create task error:", err);
      throw err;
    }
  };

  const changeTaskStatus = async (
    taskId: string,
    newStatus: TaskStatus
  ) => {
    if (!accessToken) return;

    try {
      setError(null);

      const updatedTask = await updateTaskStatusApi(
        accessToken,
        taskId,
        newStatus
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? updatedTask : task
        )
      );

      return updatedTask;
    } catch (err) {
      setError("Failed to update task status.");
      console.error("Update task status error:", err);
      throw err;
    }
  };

  const removeTask = async (taskId: string) => {
    if (!accessToken) return;

    try {
      setError(null);

      await deleteTaskApi(accessToken, taskId);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
    } catch (err) {
      setError("Failed to delete task.");
      console.error("Delete task error:", err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    refreshTasks: fetchTasks,
    addTask,
    changeTaskStatus,
    removeTask,
  };
};