import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../features/auth/services/auth.service";
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  CircleCheck,
  LogOut,
  Plus,
} from "lucide-react";

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="flex w-64 flex-col border-r border-gray-200 bg-white p-5">
        <div className="mb-10 flex items-center gap-3">
          <img src="/taskflow.png" alt="TaskFlow" className="h-9 w-9" />
          <span className="text-xl font-bold text-gray-900">TaskFlow</span>
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
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here's your task overview.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            <Plus size={18} />
            Create Task
          </button>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Total Tasks", value: "0", icon: CheckSquare },
            { title: "In Progress", value: "0", icon: Clock },
            { title: "Completed", value: "0", icon: CircleCheck },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>
                <item.icon className="text-indigo-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
          <div className="py-16 text-center">
            <CheckSquare className="mx-auto mb-3 text-gray-300" size={36} />
            <p className="font-medium text-gray-700">No tasks yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Your tasks will appear here once you create them.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;