import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  ArrowRight,
  LayoutDashboard,
  ListTodo,
  Target,
} from "lucide-react";

import AuthModal from "../features/auth/components/AuthModal";
import type { AuthMode } from "../features/auth/types";

const features = [
  {
    icon: ListTodo,
    title: "Organize tasks",
    description: "Manage all your tasks from one simple workspace.",
  },
  {
    icon: LayoutDashboard,
    title: "Track progress",
    description: "See what's pending, in progress, and completed.",
  },
  {
    icon: Target,
    title: "Stay focused",
    description: "Focus on important work and achieve your goals.",
  },
];

function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const openAuthModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <img
            src="/taskflow.png"
            alt="TaskFlow"
            className="h-9 w-9 rounded-lg"
          />
          TaskFlow
        </Link>

        <nav className="flex items-center gap-3">
          <button
            onClick={() => openAuthModal("login")}
            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Log in
          </button>

          <button
            onClick={() => openAuthModal("register")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Get started
          </button>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2">
          <div>
            <span className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-medium text-indigo-600">
              Simple task management
            </span>

            <h1 className="mt-7 text-5xl font-bold leading-tight tracking-tight">
              Make work feel
              <span className="block text-indigo-600">
                more organized.
              </span>
            </h1>

            <p className="mt-6 max-w-lg leading-7 text-gray-500">
              Plan your work, manage your tasks, and keep track of progress.
              Everything you need to stay focused in one simple workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openAuthModal("register")}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Get started for free
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => openAuthModal("login")}
                className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium hover:bg-gray-50"
              >
                Log in
              </button>
            </div>

            <p className="mt-5 text-xs text-gray-400">
              One workspace. Clear priorities. Better focus.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-xl shadow-gray-100">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 className="font-semibold">My workspace</h3>
                <p className="mt-1 text-xs text-gray-400">
                  Your work at a glance
                </p>
              </div>
              <span className="text-gray-400">•••</span>
            </div>

            <div className="my-5 grid grid-cols-3 gap-3">
              {[
                ["Total tasks", "24"],
                ["In progress", "08"],
                ["Completed", "16"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-white p-3">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <h3 className="mb-3 text-sm font-semibold">Today's tasks</h3>

            {[
              ["Build authentication flow", "In progress"],
              ["Design dashboard", "To do"],
              ["Set up database", "Completed"],
              ["Review API endpoints", "To do"],
            ].map(([task, status]) => (
              <div
                key={task}
                className="flex items-center justify-between gap-3 border-t border-gray-100 py-4 text-xs"
              >
                <span className="font-medium">{task}</span>
                <span className="whitespace-nowrap text-gray-400">
                  {status}
                </span>
              </div>
            ))}

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <Check size={14} className="text-indigo-600" />
              A clearer view of what matters.
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-gray-100 bg-gray-50 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold">
                Everything you need to stay organized
              </h2>
              <p className="mt-3 text-sm text-gray-500">
                Simple tools to help you get things done.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title}>
                  <Icon size={24} className="text-indigo-600" />
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        © 2026 TaskFlow. Simple work. Clear progress.
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onModeChange={setAuthMode}
      />
    </div>
  );
}

export default LandingPage;