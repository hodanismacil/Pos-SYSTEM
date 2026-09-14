import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  History,
  Boxes,
  BarChart3,
  UserCheck,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Receipt,
  Layers,
} from "lucide-react";
import Header from "./Header"; // Waa Header-kii aad hore u samaysay
import { Suppliers } from "../pages/admin/Suppliers";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#0d0f1d] text-slate-100 overflow-hidden">
      
      {/* 1. OVERLAY FOR MOBILE (Marka uu Sidebar-ku furmo moobaylka) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* 2. SIDEBAR (Fixed moobaylka, Sticky desktop-ka) */}
      <aside
  className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800/80 bg-[#090b15] transition-transform duration-300 md:static md:translate-x-0 ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
  {/* LOGO */}
  <div className="flex h-20 flex-shrink-0 items-center gap-3 border-b border-slate-800/80 px-5">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
      <ShoppingCart size={20} />
    </div>

    <div>
      <h1 className="font-extrabold text-white">POS System</h1>
      <p className="text-xs text-slate-400">Dashboard</p>
    </div>

    <button
      onClick={() => setSidebarOpen(false)}
      className="ml-auto text-slate-400 hover:text-white md:hidden"
    >
      <X size={20} />
    </button>
  </div>

  {/* NAVIGATION - KAN OO KELIYA AYAA SCROLL GAREYNAYA */}
  <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
    <div className="space-y-1.5 text-sm font-semibold">

      {/* Dashboard */}
      <Link
        to="/dashboard"
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <LayoutDashboard size={18} />
        Dashboard
      </Link>

      {/* Products */}
      <Link
        to="/products"
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <Package size={18} />
        Products
      </Link>

      {/* Categories */}
      <Link
        to="/categories"
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <Layers size={18} />
        Categories
      </Link>

      {/* Customers */}
      <Link
        to="/customers"
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <Users size={18} />
        Customers
      </Link>

      {/* Sales POS */}
      <Link
        to="/pos"
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <ShoppingCart size={18} />
        Sales (POS)
      </Link>

      {/* Sales History */}
      <Link
        to="/sales-history"
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <History size={18} />
        Sales History
      </Link>

      {/* Purchases */}
      <Link
        to="/purchases"
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <ShoppingCart size={18} />
        Purchases
      </Link>

      {/* Expenses */}
      <Link
        to="/expenses"
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <Receipt size={18} />
        Expenses
      </Link>

      {/* STOCK */}
      <div>
        <button
          onClick={() => setStockOpen(!stockOpen)}
          className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <span className="flex items-center gap-3">
            <Boxes size={18} />
            Stock Management
          </span>

          <ChevronDown
            size={16}
            className={`transition-transform ${
              stockOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {stockOpen && (
          <div className="ml-8 mt-1 space-y-1 border-l border-slate-800 pl-3 text-xs">
            <Link
              to="/stock/inventory"
              onClick={() => setSidebarOpen(false)}
              className="block py-2 text-slate-400 hover:text-white"
            >
              Inventory List
            </Link>

            <Link
              to="/stock/suppliers"
              onClick={() => setSidebarOpen(false)}
              className="block py-2 text-slate-400 hover:text-white"
            >
              Suppliers
            </Link>

            <Link
              to="/stock/history"
              onClick={() => setSidebarOpen(false)}
              className="block py-2 text-slate-400 hover:text-white"
            >
              Stock History
            </Link>
          </div>
        )}
      </div>

      {/* REPORTS */}
      <div>
        <button
          onClick={() => setReportsOpen(!reportsOpen)}
          className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <span className="flex items-center gap-3">
            <BarChart3 size={18} />
            Reports
          </span>

          <ChevronDown
            size={16}
            className={`transition-transform ${
              reportsOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {reportsOpen && (
          <div className="ml-8 mt-1 space-y-1 border-l border-slate-800 pl-3 text-xs">
            <Link
              to="/reports/sales"
              onClick={() => setSidebarOpen(false)}
              className="block py-2 text-slate-400 hover:text-white"
            >
              Sales Report
            </Link>

            <Link
              to="/reports/stock"
              onClick={() => setSidebarOpen(false)}
              className="block py-2 text-slate-400 hover:text-white"
            >
              Stock Report
            </Link>
          </div>
        )}
      </div>

      {/* USERS */}
      <Link
        to="/users"
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <UserCheck size={18} />
        Users & Roles
      </Link>

      {/* SETTINGS */}
      <Link
        to="/settings"
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <Settings size={18} />
        Settings
      </Link>

    </div>
  </nav>

  {/* USER + LOGOUT - MAR WALBA HOOS JOOGA */}
  <div className="flex-shrink-0 border-t border-slate-800/80 bg-[#090b15] p-3">
    <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-900/60 p-2.5">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
        HI
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-white">
          Hodan Ismacil
        </p>

        <p className="text-[10px] text-slate-400">
          Administrator
        </p>
      </div>
    </div>

    <button
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10"
    >
      <LogOut size={16} />
      Logout
    </button>
  </div>
</aside>
      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* MOBILE TOPBAR (Waxaa lagu daray Hamburger Button) */}
        <div className="flex items-center justify-between p-4 bg-[#090b15] border-b border-slate-800 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg"
          >
            <Menu size={22} />
          </button>
          <h2 className="font-bold text-white text-sm">POS System</h2>
          <div className="w-8" /> {/* Balance spacer */}
        </div>

        {/* Header Desktop */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* MAIN PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 min-w-0">
          <Outlet />
        </main>
      </div>

    </div>
  );
}