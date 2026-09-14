import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  ShoppingCart,
  History,
  Receipt,
  Warehouse,
  BarChart3,
  UserCog,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface SubItem {
  name: string;
  path: string;
}

interface MenuItem {
  name: string;
  icon: any;
  path: string;
  subItems?: SubItem[];
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Products", icon: Package, path: "/products" },
  { name: "Categories", icon: Layers, path: "/categories" },
  { name: "Customers", icon: Users, path: "/customers" },
  { name: "Sales (POS)", icon: ShoppingCart, path: "/sales" },
  { name: "Sales History", icon: History, path: "/sales-history" },
  { name: "Expenses", icon: Receipt, path: "/expenses" },
  {
    name: "Stock Management",
    icon: Warehouse,
    path: "/stock",
    subItems: [
      { name: "Inventory List", path: "/stock/inventory" },
      { name: "Suppliers", path: "/stock/suppliers" },
    ],
  },
  {
    name: "Reports",
    icon: BarChart3,
    path: "/reports",
    subItems: [
      { name: "Sales Report", path: "/reports/sales" },
      { name: "Stock Report", path: "/reports/stock" },
    ],
  },
  { name: "Users & Roles", icon: UserCog, path: "/users" },
  { name: "Settings", icon: Settings, path: "/settings" },
];
      const  Sidebar=()=>{
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subItems?.some((sub) => location.pathname.startsWith(sub.path))) {
        setOpenSubmenu(item.name);
      }
    });
  }, [location.pathname]);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex  w-64 flex-col border-r border-white/10 bg-[#080d24] text-white overflow-hidden">
      {/* 1. LOGO HEADER (Fixed Height) */}
      <div className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-white/10 px-6 bg-[#080d24]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 shadow-md shadow-purple-500/20">
          <ShoppingCart size={20} />
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight">POS System</h1>
          <p className="text-[11px] text-slate-400">Dashboard</p>
        </div>
      </div>

      {/* 2. SCROLLABLE NAVIGATION MENU */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
          const isOpen = openSubmenu === item.name;

          if (hasSubItems) {
            const isSubActive = item.subItems?.some((sub) =>
              location.pathname.startsWith(sub.path)
            );

            return (
              <div key={item.name} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(item.name)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-sm transition-all hover:bg-white/5 hover:text-white ${
                    isSubActive ? "font-semibold text-purple-400" : "text-slate-300"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isSubActive ? "text-purple-400" : "text-slate-400"}
                  />
                  <span className="flex-1 text-left">{item.name}</span>
                  <ChevronDown
                    size={15}
                    className={`text-slate-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-purple-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="ml-8 space-y-1 border-l border-white/10 pl-3 my-1">
                    {item.subItems?.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        className={({ isActive }) =>
                          `block rounded-lg px-2.5 py-1.5 text-xs transition-all ${
                            isActive
                              ? "bg-purple-600/20 font-semibold text-purple-400"
                              : "text-slate-400 hover:text-white"
                          }`
                        }
                      >
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-sm transition-all duration-200 ${
                  isActive
                    ? "border border-purple-500/30 bg-purple-600/20 font-semibold text-purple-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-purple-400"
                        : "text-slate-400 group-hover:text-purple-400"
                    }
                  />
                  <span className="flex-1 text-left">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* 3. FIXED USER PROFILE & LOGOUT SECTION */}
      <div className="flex-shrink-0 border-t border-white/10 p-3 bg-[#080d24]">
        <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-white/5 p-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 font-semibold text-xs">
            HI
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold leading-tight">Hodan Ismacil</p>
            <p className="truncate text-[10px] text-slate-400">Administrator</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}


export default  Sidebar