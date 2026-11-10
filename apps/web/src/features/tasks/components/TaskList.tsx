import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "../types/task.types";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

const TaskList = ({
  tasks,
  loading,
  onStatusChange,
  onDelete,
}: TaskListProps) => {
  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading tasks...
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
        <h3 className="font-semibold text-gray-900">
          No tasks found
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Create a new task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;