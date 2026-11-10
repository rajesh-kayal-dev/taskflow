import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

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