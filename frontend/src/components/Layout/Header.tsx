import { useState, useEffect, useRef } from "react";
import { Bell, Sun, AlertTriangle, PartyPopper } from "lucide-react";
import api from "../api/api"; // Hubi jidka API-gaaga

interface NotificationItem {
  id: string;
  type: "LOW_STOCK" | "SALE_COMPLETED";
  title: string;
  message: string;
  time: string;
}

export const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Dhaqanka Xiritaanka marka skreenka meel kale la riixo (Outside Click)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Soo akhrinta Dhammaan Ogaysisyada (Low Stock + Recent Sales)
  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const [productsRes, salesRes] = await Promise.all([
          api.get("/products"),
          api.get("/sales"),
        ]);

        const allList: NotificationItem[] = [];

        // A. Alaabta stock-geedu yar yahay (Low Stock Alerts)
        if (productsRes.data?.success) {
          const lowItems = productsRes.data.data.filter((p: any) => p.stock <= 5);
          lowItems.forEach((p: any) => {
            allList.push({
              id: `low-${p.id}`,
              type: "LOW_STOCK",
              title: "Low Stock Alert ⚠️",
              message: `${p.name} has only ${p.stock} item${p.stock > 1 ? "s" : ""} left.`,
              time: "Stock low",
            });
          });
        }

        // B. Iibkii ugu dambeeyay (New Sales Completed - 5-ta ugu dambaysa)
        if (salesRes.data?.success) {
          const recentSales = salesRes.data.data.slice(-5).reverse();
          recentSales.forEach((sale: any) => {
            allList.push({
              id: `sale-${sale.id}`,
              type: "SALE_COMPLETED",
              title: "New Sale Completed 🎉",
              message: `Order #${sale.id} successfully processed.`,
              time: sale.createdAt ? new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
            });
          });
        }

        setNotifications(allList);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchAllNotifications();
  }, []);

  return (
    <header className="flex items-center justify-end px-6 py-4 bg-[#0a1026] border-b border-white/10 gap-3">
      {/* Theme Toggle Button */}
      <button className="rounded-xl border border-white/10 bg-[#101631] p-3 text-slate-300 transition hover:bg-white/5 hover:text-white">
        <Sun size={20} />
      </button>

      {/* Notifications Wrapper */}
      <div className="relative" ref={dropdownRef}>
        {/* Bell Button */}
        <button
          onClick={() => setShowNotifications((prev) => !prev)}
          className="relative rounded-xl border border-white/10 bg-[#101631] p-3 text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <Bell size={20} />
          {notifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-purple-600 px-1 text-[11px] font-bold text-white shadow-lg">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Popover */}
        {showNotifications && (
          <div className="absolute right-0 mt-3 w-72 sm:w-80 rounded-2xl border border-white/10 bg-[#0a1026] p-4 text-white shadow-2xl z-50">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">Notifications</h3>
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2.5 py-0.5 rounded-full font-semibold">
                {notifications.length} New
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs text-slate-300 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center py-6 text-slate-500">
                  No notifications yet
                </p>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-white/5 bg-[#101631] hover:border-purple-500/30 transition flex items-start gap-2.5"
                  >
                    <div className="mt-0.5">
                      {item.type === "LOW_STOCK" ? (
                        <AlertTriangle size={16} className="text-amber-400" />
                      ) : (
                        <PartyPopper size={16} className="text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-slate-400 mt-0.5">{item.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
        H
      </div>
    </header>
  );
};

export default Header;