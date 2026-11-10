import type { TaskStatus } from "../types/task.types";

export type TaskStatusFilter = TaskStatus | "ALL";

interface TaskFiltersProps {
  search: string;
  status: TaskStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: TaskStatusFilter) => void;
}

const TaskFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: TaskFiltersProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search tasks..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-sm"
      />

      {/* Status Filter */}
      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as TaskStatusFilter)
        }
        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="ALL">All Tasks</option>
        <option value="TODO">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
    </div>
  );
};

export default TaskFilters;