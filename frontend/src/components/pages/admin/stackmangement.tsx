import React, { useState, useEffect } from "react";
import api from "../../api/api"; // Hubi in jidka api-gaaga uu sax yahay
import {
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  AlertTriangle,
  History,
  X,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

// TYPES
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  sku?: string;
  barcode?: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  category?: Category;
  stockStatus?: "OUT_OF_STOCK" | "CRITICAL" | "LOW" | "IN_STOCK";
}

interface StockHistoryItem {
  id: number;
  productId: number;
  change: number;
  reason: string;
  createdAt: string;
  product: {
    id: number;
    name: string;
    sku?: string;
  };
}

export const StockManagement = () => {
  // STATES
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<StockHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"inventory" | "history">("inventory");

  // SEARCH & FILTER
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // MODAL STATES
  const [modalType, setModalType] = useState<"IN" | "OUT" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // FETCH DATA FROM BACKEND
  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch products & stock history in parallel
      const [productsRes, historyRes] = await Promise.all([
        api.get("/products"), // Hubi endpoint-kaaga alaabta oo dhan soo celiya
        api.get("/stock/history"),
      ]);

      const fetchedProducts: Product[] = productsRes.data.data || productsRes.data;
      
      // Calculate stock status for each product
      const processedProducts = fetchedProducts.map((p) => ({
        ...p,
        stockStatus:
          p.stock === 0
            ? "OUT_OF_STOCK"
            : p.stock <= 2
            ? "CRITICAL"
            : p.stock <= 5
            ? "LOW"
            : "IN_STOCK",
      }));

      setProducts(processedProducts as Product[]);
      setHistory(historyRes.data.data || historyRes.data);
    } catch (err: any) {
      console.error("Error fetching stock data:", err);
      setError("Fadlan hubi in server-ku uu shaqaynayo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  // HANDLE STOCK IN / OUT SUBMIT
  const handleStockAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || quantity <= 0) return;

    try {
      setSubmitting(true);
      const endpoint = modalType === "IN" ? "/stock/in" : "/stock/out";
      
      await api.post(endpoint, {
        productId: selectedProduct.id,
        quantity: Number(quantity),
      });

      // Reset Modal & Refresh Data
      setModalType(null);
      setSelectedProduct(null);
      setQuantity(1);
      await fetchStockData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Cillad ayaa dhacday marka stock-ka la cusboonaysiinayay");
    } finally {
      setSubmitting(false);
    }
  };

  // FILTER LOGIC
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || p.stockStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // COUNTS FOR METRICS CARDS
  const totalStockCount = products.reduce((acc, item) => acc + item.stock, 0);
  const lowStockCount = products.filter((p) => p.stockStatus === "LOW" || p.stockStatus === "CRITICAL").length;
  const outOfStockCount = products.filter((p) => p.stockStatus === "OUT_OF_STOCK").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 font-sans space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-2">
            <Package size={14} /> Inventory Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Stock Management</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            La soco dhaqdhaqaaqa alaabta, Stock In/Out, iyo maamulka kaydka.
          </p>
        </div>

        <button
          onClick={fetchStockData}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 border border-slate-800 hover:bg-slate-800 transition"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Cusboonaysii Data
        </button>
      </div>

      {/* METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Products */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-xl">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Dhammaan Alaabta</p>
          <h2 className="mt-2 text-2xl font-bold text-white">{products.length} Items</h2>
          <p className="mt-1 text-xs text-slate-500">Katalog-ka guud</p>
        </div>

        {/* Total Stock Count */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-xl">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Current Stock</p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-400">{totalStockCount} Units</h2>
          <p className="mt-1 text-xs text-slate-500">Wadarta xabado ee kaydka ku jira</p>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 backdrop-blur-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-400">Low Stock</p>
              <h2 className="mt-2 text-2xl font-bold text-amber-400">{lowStockCount} Products</h2>
            </div>
            <AlertTriangle className="text-amber-400" size={20} />
          </div>
          <p className="mt-1 text-xs text-amber-400/70">Xabado yar ayaa ka dhiman</p>
        </div>

        {/* Out of Stock Alert */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 backdrop-blur-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-rose-400">Out of Stock</p>
              <h2 className="mt-2 text-2xl font-bold text-rose-400">{outOfStockCount} Products</h2>
            </div>
            <X className="text-rose-400" size={20} />
          </div>
          <p className="mt-1 text-xs text-rose-400/70">Waa ay ka dhamaatay kaydka</p>
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`pb-3 text-sm font-semibold transition border-b-2 ${
            activeTab === "inventory"
              ? "border-violet-500 text-violet-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Inventory & Stock List
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition border-b-2 ${
            activeTab === "history"
              ? "border-violet-500 text-violet-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <History size={16} /> Stock History
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          
          {/* SEARCH & FILTERS CONTROL */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Raadi magaca, SKU ama Barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {[
                { label: "Dhamaan", value: "ALL" },
                { label: "Low Stock", value: "LOW" },
                { label: "Critical", value: "CRITICAL" },
                { label: "Out of Stock", value: "OUT_OF_STOCK" },
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setStatusFilter(btn.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    statusFilter === btn.value
                      ? "bg-violet-600 text-white border-violet-500"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE OF PRODUCTS */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-medium">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">SKU / Barcode</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Current Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        Waa la soo rarayaa alaabta...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        Ma jiro alaab noocan ah oo la helay.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-800/30 transition">
                        
                        {/* Name & Image */}
                        <td className="p-4 flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center overflow-hidden">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <Package size={18} className="text-slate-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{product.name}</p>
                            <p className="text-[10px] text-slate-500">{product.category?.name || "General"}</p>
                          </div>
                        </td>

                        {/* SKU / Barcode */}
                        <td className="p-4 text-slate-400">
                          <div>{product.sku || "-"}</div>
                          <div className="text-[10px] text-slate-500">{product.barcode || "-"}</div>
                        </td>

                        {/* Price */}
                        <td className="p-4 font-semibold text-slate-200">${product.price}</td>

                        {/* Current Stock */}
                        <td className="p-4 font-extrabold text-sm text-white">
                          {product.stock}
                        </td>

                        {/* Status Badge */}
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                              product.stockStatus === "OUT_OF_STOCK"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : product.stockStatus === "CRITICAL"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : product.stockStatus === "LOW"
                                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}
                          >
                            {product.stockStatus?.replace(/_/g, " ")}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setModalType("IN");
                              }}
                              className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-lg font-medium transition"
                            >
                              <ArrowUpRight size={14} /> Stock In
                            </button>

                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setModalType("OUT");
                              }}
                              className="flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg font-medium transition"
                            >
                              <ArrowDownLeft size={14} /> Stock Out
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STOCK HISTORY */}
      {activeTab === "history" && (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-medium">
                <tr>
                  <th className="p-4">Taariikh</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Change Quantity</th>
                  <th className="p-4">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      Dhaqdhaqaaq weli ma dhicin.
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 text-slate-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 font-semibold text-white">
                        {item.product.name}
                        {item.product.sku && (
                          <span className="text-[10px] text-slate-500 block">SKU: {item.product.sku}</span>
                        )}
                      </td>
                      <td className="p-4 font-bold">
                        <span
                          className={`inline-flex items-center gap-1 ${
                            item.change > 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {item.change > 0 ? `+${item.change}` : item.change}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                          {item.reason}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STOCK IN / OUT MODAL */}
      {modalType && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                {modalType === "IN" ? (
                  <ArrowUpRight className="text-emerald-400" size={20} />
                ) : (
                  <ArrowDownLeft className="text-rose-400" size={20} />
                )}
                <h3 className="text-lg font-bold text-white">
                  {modalType === "IN" ? "Stock In (Alaab Ku Dar)" : "Stock Out (Alaab Ka Jar)"}
                </h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Product Summary */}
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800/60 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{selectedProduct.name}</p>
                <p className="text-xs text-slate-500">Current Stock: {selectedProduct.stock}</p>
              </div>
              <span className="text-xs font-bold text-violet-400">${selectedProduct.price}</span>
            </div>

            {/* Form */}
            <form onSubmit={handleStockAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Quantity (Tirada ku dhacayso ama ka baxeysa)
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="w-1/2 rounded-xl border border-slate-800 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
                >
                  Kansal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-1/2 rounded-xl py-2.5 text-xs font-semibold text-white transition ${
                    modalType === "IN"
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-rose-600 hover:bg-rose-500"
                  }`}
                >
                  {submitting ? "Habaynayaa..." : "Keydi Dhaqdhaqaaqa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;