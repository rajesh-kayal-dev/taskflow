import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Plus,
  CheckSquare,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import { logoutUser } from "../features/auth/services/auth.service";

import { useTasks } from "../features/tasks/hooks/useTasks";
import TaskStats from "../features/tasks/components/TaskStats";
import TaskFilters, {
  type TaskStatusFilter,
} from "../features/tasks/components/TaskFilters";
import TaskList from "../features/tasks/components/TaskList";
import CreateTaskModal from "../features/tasks/components/CreateTaskModal";

function DashboardPage() {
  const navigate = useNavigate();
  const { user, accessToken, logout } = useAuth();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatusFilter>("ALL");

  const {
    tasks,
    loading,
    error,
    refreshTasks,
    addTask,
    changeTaskStatus,
    removeTask,
  } = useTasks({ accessToken });

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query);

      const matchesStatus =
        status === "ALL" || task.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, status]);

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logout();
      navigate("/", { replace: true });
    }
  };

  // Create task
  const handleCreateTask = async (data: Parameters<typeof addTask>[0]) => {
    setIsCreating(true);

    try {
      await addTask(data);
      setIsCreateModalOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white p-5">
        <div className="mb-10 flex items-center gap-3">
          <img src="/taskflow.png" alt="TaskFlow" className="h-9 w-9" />

          <span className="text-xl font-bold text-gray-900">
            TaskFlow
          </span>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase text-gray-400">
          Workspace
        </p>

        <button className="flex items-center gap-3 rounded-lg bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
          <LayoutDashboard size={18} />
          Overview
        </button>

        <div className="mt-auto border-t border-gray-200 pt-5">
          <p className="mb-3 truncate text-sm text-gray-600">
            {user?.email}
          </p>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here's your task overview.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Create Task
          </button>
        </header>

        {/* Task Statistics */}
        <TaskStats tasks={tasks} />

        {/* Tasks Section */}
        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center gap-2">
            <CheckSquare size={20} className="text-indigo-600" />

            <h2 className="text-lg font-semibold text-gray-900">
              Recent Tasks
            </h2>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <TaskFilters
              search={search}
              status={status}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 p-4 text-sm text-red-600">
              <p>{error}</p>

              <button
                onClick={refreshTasks}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            onStatusChange={changeTaskStatus}
            onDelete={removeTask}
          />
        </section>
      </main>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        loading={isCreating}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}

export default DashboardPage;