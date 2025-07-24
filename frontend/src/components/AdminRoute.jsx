import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUserRole } from "../utils/auth";

const AdminRoute = () => {
  const token = getToken();
  const role = getUserRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/employee/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
