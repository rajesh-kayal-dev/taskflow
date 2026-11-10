import { useState } from "react";
import { X } from "lucide-react";
import type { AuthModalProps } from "../types";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";



function AuthModal({ isOpen, mode, onClose, onModeChange, }: AuthModalProps) {

  const [successMessage, setSuccessMessage] = useState("");

  return (
    <div
      className={`${isOpen ? "flex" : "hidden"} fixed inset-0 z-50 items-center justify-center bg-black/50 p-4`} onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex justify-center">
          <img
            src="/taskflow.png"
            alt="TaskFlow"
            className="h-12 w-12 rounded-xl"
          />
        </div>

        <div className="text-center">
          <h2 id="auth-title" className="text-2xl font-semibold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {mode === "login"
              ? "Log in to continue to TaskFlow."
              : "Get started with your TaskFlow workspace."}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className={`rounded-md py-2 text-sm font-medium ${mode === "login"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500"
              }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => onModeChange("register")}
            className={`rounded-md py-2 text-sm font-medium ${mode === "register"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500"
              }`}
          >
            Register
          </button>
        </div>

        <div className={mode === "login" ? "block" : "hidden"}>
          {successMessage && mode === "login" && (
            <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </p>
          )}
          <LoginForm />
        </div>

        <div className={mode === "register" ? "block" : "hidden"}>
          <RegisterForm
            onSuccess={() => {
              setSuccessMessage("Account created successfully. Please log in.");
              onModeChange("login");
            }}
          />
        </div>

      </div>
    </div>
  );
}

export default AuthModal;