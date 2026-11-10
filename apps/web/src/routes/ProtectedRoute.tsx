import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function ProtectedRoute() {
    const { accessToken, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;