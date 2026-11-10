import type { Task } from "../types/task.types";

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats = ({ tasks }: TaskStatsProps) => {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
    },
    {
      title: "Completed",
      value: completedTasks,
    },
    {
      title: "In Progress",
      value: inProgressTasks,
    },
    {
      title: "Pending",
      value: pendingTasks,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-500">
            {stat.title}
          </p>

          <h3 className="mt-2 text-3xl font-semibold text-gray-900">
            {stat.value}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;