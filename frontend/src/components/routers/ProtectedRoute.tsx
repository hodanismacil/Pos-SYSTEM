import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // 1. Ma jiro Token? Geey Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role-ku ma ku jiraa kuwa loo ogol yahay?
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Beddelkii lagu diri lahaa /unauthorized, toos u geey bogga uu xaqqa u leeyahay
    return <Navigate to={userRole === "CASHIER" ? "/pos" : "/dashboard"} replace />;
  }

  return <Outlet />;
};