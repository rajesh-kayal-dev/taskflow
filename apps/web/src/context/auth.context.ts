import { createContext } from "react";

export interface User {
    id: string;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    login: (user: User, accessToken: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);