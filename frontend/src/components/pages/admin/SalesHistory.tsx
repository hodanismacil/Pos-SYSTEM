import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  X,
  CalendarDays,
  User,
  CreditCard,
  Package,
  RefreshCw,
} from "lucide-react";

interface Customer {
  id: number;
  name: string;
  phoneNumber: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Product {
  id: number;
  name: string;
  sku?: string | null;
  barcode?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
}

interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
  product?: Product;
}

interface Sale {
  id: number;
  userId: number;
  customerId: number;
  paymentMethod: "CASH" | "EVC" | "CARD";
  totalAmount: number;
  paidAmount: number;
  changeAmount: number;
  createdAt: string;
  updatedAt: string;

  customer?: Customer;
  user?: UserData;
  saleItems?: SaleItem[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const API_URL = "http://localhost:5000/api";

export default function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  // =========================
  // GET ALL SALES
  // =========================
  const fetchSales = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/sales`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const result: ApiResponse<Sale[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch sales");
      }

      setSales(result.data || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // =========================
  // GET SALE BY ID
  // =========================
  const handleViewDetails = async (id: number) => {
    try {
      setDetailsLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/sales/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const result: ApiResponse<Sale> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to get sale details");
      }

      setSelectedSale(result.data);
    } catch (err: any) {
      setError(err.message || "Failed to get sale details");
    } finally {
      setDetailsLoading(false);
    }
  };

  // =========================
  // DELETE SALE
  // =========================
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this sale?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(id);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/sales/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const result: ApiResponse<unknown> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete sale");
      }

      setSales((prev) => prev.filter((sale) => sale.id !== id));

      if (selectedSale?.id === id) {
        setSelectedSale(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete sale");
    } finally {
      setDeleteLoading(null);
    }
  };

  // =========================
  // SEARCH
  // =========================
  const filteredSales = sales.filter((sale) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) return true;

    const saleId = String(sale.id).toLowerCase();
    const customerName = sale.customer?.name?.toLowerCase() || "";
    const customerPhone = sale.customer?.phoneNumber?.toLowerCase() || "";
    const cashierName = sale.user?.name?.toLowerCase() || "";
    const payment = sale.paymentMethod.toLowerCase();

    return (
      saleId.includes(searchValue) ||
      customerName.includes(searchValue) ||
      customerPhone.includes(searchValue) ||
      cashierName.includes(searchValue) ||
      payment.includes(searchValue)
    );
  });

  // =========================
  // FORMAT MONEY
  // =========================
  const formatMoney = (amount: number) => {
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  // =========================
  // PAYMENT BADGE
  // =========================
  const paymentBadge = (payment: Sale["paymentMethod"]) => {
    if (payment === "CASH") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (payment === "EVC") {
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }

    return "bg-purple-500/10 text-purple-400 border-purple-500/20";
  };

  return (
    <div className="min-h-full text-slate-100">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales History</h1>
          <p className="mt-1 text-sm text-slate-400">
            View and manage all completed sales.
          </p>
        </div>

        <button
          onClick={fetchSales}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="rounded-lg p-1 hover:bg-red-500/10"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* ================= SEARCH ================= */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-[#111426] p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sale ID, customer, phone, cashier or payment..."
            className="w-full rounded-xl border border-slate-700 bg-[#0d0f1d] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111426]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-slate-800 bg-[#0d0f1d]">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sale
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Cashier
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading sales...
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    {search
                      ? "No sales found for your search."
                      : "No sales available."}
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="transition hover:bg-white/[0.02]"
                  >
                    {/* SALE */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">
                        #{sale.id}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {sale.saleItems?.length || 0} item(s)
                      </div>
                    </td>

                    {/* CUSTOMER */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-200">
                        {sale.customer?.name || "Walk-in Customer"}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {sale.customer?.phoneNumber || "-"}
                      </div>
                    </td>

                    {/* CASHIER */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-200">
                        {sale.user?.name || `User #${sale.userId}`}
                      </div>

                      {sale.user?.role && (
                        <div className="mt-1 text-xs text-slate-500">
                          {sale.user.role}
                        </div>
                      )}
                    </td>

                    {/* PAYMENT */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${paymentBadge(
                          sale.paymentMethod
                        )}`}
                      >
                        {sale.paymentMethod}
                      </span>
                    </td>

                    {/* TOTAL */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-white">
                        {formatMoney(sale.totalAmount)}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-5 py-4">
                      <div className="text-sm text-slate-300">
                        {formatDate(sale.createdAt)}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(sale.id)}
                          className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-2 text-violet-400 transition hover:bg-violet-500/20"
                          title="View details"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(sale.id)}
                          disabled={deleteLoading === sale.id}
                          className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete sale"
                        >
                          {deleteLoading === sale.id ? (
                            <RefreshCw size={17} className="animate-spin" />
                          ) : (
                            <Trash2 size={17} />
                          )}
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

      {/* ================= SALE DETAILS MODAL ================= */}
      {selectedSale && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#111426] shadow-2xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-[#111426] px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Sale #{selectedSale.id}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {formatDate(selectedSale.createdAt)}
                </p>
              </div>

              <button
                onClick={() => setSelectedSale(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5">
              {/* CUSTOMER + CASHIER */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* CUSTOMER */}
                <div className="rounded-xl border border-slate-800 bg-[#0d0f1d] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <User size={17} className="text-violet-400" />
                    <h3 className="font-semibold text-white">Customer</h3>
                  </div>

                  <p className="text-sm font-medium text-slate-200">
                    {selectedSale.customer?.name || "Walk-in Customer"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedSale.customer?.phoneNumber || "-"}
                  </p>
                </div>

                {/* CASHIER */}
                <div className="rounded-xl border border-slate-800 bg-[#0d0f1d] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <User size={17} className="text-blue-400" />
                    <h3 className="font-semibold text-white">Cashier</h3>
                  </div>

                  <p className="text-sm font-medium text-slate-200">
                    {selectedSale.user?.name ||
                      `User #${selectedSale.userId}`}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedSale.user?.email || "-"}
                  </p>

                  {selectedSale.user?.role && (
                    <p className="mt-1 text-xs text-violet-400">
                      {selectedSale.user.role}
                    </p>
                  )}
                </div>
              </div>

              {/* PAYMENT */}
              <div className="rounded-xl border border-slate-800 bg-[#0d0f1d] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CreditCard size={17} className="text-emerald-400" />
                  <h3 className="font-semibold text-white">
                    Payment Information
                  </h3>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Payment Method
                  </span>

                  <span
                    className={`rounded-lg border px-3 py-1 text-xs font-semibold ${paymentBadge(
                      selectedSale.paymentMethod
                    )}`}
                  >
                    {selectedSale.paymentMethod}
                  </span>
                </div>
              </div>

              {/* ITEMS */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Package size={18} className="text-violet-400" />
                  <h3 className="font-semibold text-white">Sale Items</h3>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-800">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-[#0d0f1d]">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                            Product
                          </th>

                          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">
                            Qty
                          </th>

                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                            Price
                          </th>

                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                            Subtotal
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-800">
                        {selectedSale.saleItems?.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">
                              <div className="font-medium text-slate-200">
                                {item.productName}
                              </div>

                              {item.product?.sku && (
                                <div className="mt-1 text-xs text-slate-500">
                                  SKU: {item.product.sku}
                                </div>
                              )}
                            </td>

                            <td className="px-4 py-3 text-center text-sm text-slate-300">
                              {item.quantity}
                            </td>

                            <td className="px-4 py-3 text-right text-sm text-slate-300">
                              {formatMoney(item.price)}
                            </td>

                            <td className="px-4 py-3 text-right text-sm font-semibold text-white">
                              {formatMoney(item.subTotal)}
                            </td>
                          </tr>
                        ))}

                        {!selectedSale.saleItems?.length && (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-8 text-center text-sm text-slate-500"
                            >
                              No sale items found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="rounded-xl border border-slate-800 bg-[#0d0f1d] p-4">
                <h3 className="mb-4 font-semibold text-white">
                  Payment Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Total Amount</span>
                    <span className="font-semibold text-white">
                      {formatMoney(selectedSale.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Paid Amount</span>
                    <span className="font-semibold text-emerald-400">
                      {formatMoney(selectedSale.paidAmount)}
                    </span>
                  </div>

                  <div className="border-t border-slate-800 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-300">
                        Change
                      </span>

                      <span className="text-lg font-bold text-violet-400">
                        {formatMoney(selectedSale.changeAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="border-t border-slate-800 px-5 py-4">
              <button
                onClick={() => setSelectedSale(null)}
                className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS LOADING */}
      {detailsLoading && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#111426] px-5 py-4">
            <RefreshCw
              size={20}
              className="animate-spin text-violet-400"
            />
            <span className="text-sm text-slate-300">
              Loading sale details...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}