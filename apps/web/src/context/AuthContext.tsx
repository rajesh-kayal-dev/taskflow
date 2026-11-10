import { useEffect, useState, type ReactNode } from "react";

import { refreshAccessToken } from "../features/auth/services/auth.service";
import { AuthContext, type User } from "./auth.context";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = sessionStorage.getItem("user");

        if (!savedUser) return;

        const response = await refreshAccessToken();

        setUser(JSON.parse(savedUser) as User);
        setAccessToken(response.accessToken);
      } catch (error) {
        console.error("Session restoration failed:", error);

        sessionStorage.removeItem("user");
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = (user: User, accessToken: string) => {
    setUser(user);
    setAccessToken(accessToken);
    sessionStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}