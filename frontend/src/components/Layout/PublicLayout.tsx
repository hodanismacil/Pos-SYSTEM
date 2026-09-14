
import { Outlet } from "react-router-dom";
import Sidebar from "./sitbar";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-[#080d24] overflow-hidden">
      {/* 1. Sidebar-ka ku dhig halkan */}
      <Sidebar />

      {/* 2. Main content-ka sii ml-64 (margin-left) si uu dhanka midig uga shift-galiyo Sidebar-ka */}
      <div className="flex-1 ml-64 flex flex-col min-w-0 overflow-y-auto p-6 text-white">
        <Outlet />
      </div>
    </div>
  );
}