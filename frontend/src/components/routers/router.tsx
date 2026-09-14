import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../Layout/Mainlayout";
import { OverviewLanding } from "../pages/admin/OverviewLanding";
import Login from "../athe/login";
import { ProtectedRoute } from "./ProtectedRoute";

// Pages...
import Products from "../pages/admin/product";
import Dashbourd from "../pages/admin/dashbourd";
import SalesPage from "../pages/admin/SalesPage";
import Stackmangement from "../pages/admin/stackmangement";
import SalesHistory from "../pages/admin/SalesHistory";
import Customers from "../pages/admin/Customers";
import Reports from "../pages/admin/Reports";
import Users from "../pages/admin/users";
import Settings from "../pages/admin/setting";
import Categories from "../pages/admin/Categories";
import { Suppliers } from "../pages/admin/Suppliers";
import { Purchases } from "../pages/admin/Purchases";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<OverviewLanding />} />
      <Route path="/login" element={<Login />} />

      {/* SHARED (Admin & Cashier) */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN", "CASHIER"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/pos" element={<SalesPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/customers" element={<Customers />} />
        </Route>
      </Route>

      {/* ADMIN ONLY */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashbourd />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/stock" element={<Stackmangement />} />
          <Route path="/stock/inventory" element={<Stackmangement />} />
          <Route path="/stock/suppliers" element={<Suppliers />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/sales-history" element={<SalesHistory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/sales" element={<Reports />} />
          <Route path="/reports/stock" element={<Reports />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* FALLBACK (Haddii URL la qaldo ama /unauthorized lagu dhaco) */}
      <Route path="/unauthorized" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}