import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  History,
  Search,
  Package,
  TrendingUp,
  TrendingDown,
  Calendar,
  Loader2,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface StockRecord {
  id: number;
  productId: number;
  product?: {
    name: string;
  };
  change: number; // positive (+) logic for restock, negative (-) for sale
  reason: string;
  createdAt: string;
}

const API_BASE_URL = "http://localhost:5000/api/stock-history";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const StockHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<StockRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const fetchStockHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL, getAuthHeader());
      const data = response.data.data || response.data;
      setHistory(data);
    } catch (error: any) {
      console.error("Error fetching stock history:", error);
      alert(error.response?.data?.message || "Failed to load stock history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockHistory();
  }, []);

  const filteredHistory = history.filter(
    (item) =>
      item.product?.name.toLowerCase().includes(search.toLowerCase()) ||
      item.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 space-y-8 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold tracking-wide text-xs uppercase mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Inventory Audit Trail
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Stock History
          </h1>
        </div>

        <button
          onClick={fetchStockHistory}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 font-bold px-4 py-2.5 rounded-xl transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or reason..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition-all"
          />
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-cyan-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading stock records...</span>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center p-12 text-slate-500">
            No stock movement history found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Change Quantity</th>
                  <th className="p-4">Reason / Source</th>
                  <th className="p-4 pr-6 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredHistory.map((item) => {
                  const isPositive = item.change > 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 pl-6 font-semibold text-slate-100 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-cyan-400">
                          <Package className="w-4 h-4" />
                        </div>
                        {item.product?.name || `Product #${item.productId}`}
                      </td>
                      <td className="p-4 font-bold">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            isPositive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                          {isPositive ? `+${item.change}` : item.change}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{item.reason}</td>
                      <td className="p-4 pr-6 text-right text-xs text-slate-400">
                        <div className="flex items-center justify-end gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};