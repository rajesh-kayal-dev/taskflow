import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { refreshAccessToken } from "../features/auth/services/auth.service";

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean; 
    login: (user: User, accessToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const savedUser = sessionStorage.getItem("user");

                if (!savedUser) return;

                const response = await refreshAccessToken();

                setUser(JSON.parse(savedUser));
                setAccessToken(response.accessToken);
            } catch {
                sessionStorage.removeItem("user");
                setUser(null);
                setAccessToken(null);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
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

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}