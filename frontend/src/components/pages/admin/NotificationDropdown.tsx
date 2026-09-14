import { useState, useEffect, useRef } from "react";
import { Bell, AlertTriangle, PartyPopper, Check, Trash2 } from "lucide-react";
import api from "../../api/api";

interface NotificationItem {
  id: string;
  type: "LOW_STOCK" | "SALE_COMPLETED";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

 const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch products & generate alerts dynamically
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/products");
        if (response.data.success) {
          const products = response.data.data;
          
          // Check for low stock items (e.g., stock <= 5)
          const lowStockAlerts: NotificationItem[] = products
            .filter((p: any) => p.stock <= 5 && p.stock > 0)
            .map((p: any) => ({
              id: `low-stock-${p.id}`,
              type: "LOW_STOCK",
              title: "Low Stock Alert ⚠️",
              message: `${p.name} has only ${p.stock} item${p.stock > 1 ? "s" : ""} left.`,
              isRead: false,
              createdAt: "Just now",
            }));

          setNotifications(lowStockAlerts);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-white/10 bg-[#101631] p-3 text-slate-300 transition hover:bg-white/5 hover:text-white"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-purple-600 px-1 text-[11px] font-bold text-white shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#0a1026] p-4 text-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
                  {unreadCount} New
                </span>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="text-xs text-slate-400 hover:text-purple-400"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={clearNotifications}
                  title="Clear all"
                  className="text-xs text-slate-400 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* List */}
          <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No new notifications
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border border-white/5 bg-[#101631] p-3.5 transition hover:border-purple-500/30 ${
                    !item.isRead ? "border-l-4 border-l-purple-500" : "opacity-70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {item.type === "LOW_STOCK" ? (
                        <AlertTriangle size={18} className="text-amber-400" />
                      ) : (
                        <PartyPopper size={18} className="text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default NotificationDropdown;