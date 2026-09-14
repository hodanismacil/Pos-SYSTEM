import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  ChevronRight,
  CreditCard,
  DollarSign,
  Package,
  Plus,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Warehouse,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface LowStockProduct {
  id: number;
  name: string;
  sku?: string;
  barcode?: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  stockStatus: "OUT_OF_STOCK" | "CRITICAL" | "LOW";
  category?: {
    id: number;
    name: string;
  };
}

interface TopSellingProduct {
  productId: number;
  productName: string;
  price: number;
  imageUrl?: string | null;
  quantitySold: number;
  revenue: number;
}

interface PaymentMethod {
  paymentMethod: string;
  salesCount: number;
  revenue: number;
}

interface DashboardData {
  totalProducts: number;
  totalCustomers: number;
  totalSales: number;
  totalRevenue: number;
  todaySales: number;
  todayRevenue: number;
  lowStockProducts: LowStockProduct[];
  topSellingProducts: TopSellingProduct[];
  salesByPaymentMethod: PaymentMethod[];
}

/* =========================================================
   CONSTANTS
========================================================= */

const PAYMENT_COLORS = [
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
];

/* =========================================================
   COMPONENT
========================================================= */

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardData>({
    totalProducts: 0,
    totalCustomers: 0,
    totalSales: 0,
    totalRevenue: 0,
    todaySales: 0,
    todayRevenue: 0,
    lowStockProducts: [],
    topSellingProducts: [],
    salesByPaymentMethod: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* =======================================================
     FETCH DASHBOARD
  ======================================================= */

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/dashboard");

      if (response.data?.success) {
        setStats(response.data.data);
      } else {
        setError("Unable to load dashboard data.");
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);

      setError(
        "Unable to load dashboard data. Please check your server connection."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* =======================================================
     PAYMENT TOTAL
  ======================================================= */

  const paymentTotal = useMemo(() => {
    return stats.salesByPaymentMethod.reduce(
      (total, item) => total + item.revenue,
      0
    );
  }, [stats.salesByPaymentMethod]);

  /* =======================================================
     HELPERS
  ======================================================= */

  const formatCurrency = (value: number) => {
    return `$${Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatNumber = (value: number) => {
    return Number(value || 0).toLocaleString();
  };

  const getStockBadge = (status: LowStockProduct["stockStatus"]) => {
    if (status === "OUT_OF_STOCK") {
      return {
        label: "Out of stock",
        className:
          "border-rose-500/20 bg-rose-500/10 text-rose-400",
      };
    }

    if (status === "CRITICAL") {
      return {
        label: "Critical",
        className:
          "border-orange-500/20 bg-orange-500/10 text-orange-400",
      };
    }

    return {
      label: "Low stock",
      className:
        "border-amber-500/20 bg-amber-500/10 text-amber-400",
    };
  };

  /* =======================================================
     CHART DATA
     
     IMPORTANT:
     Backend currently does not provide historical timeline
     data, so this uses the current dashboard values only
     for a simple visual representation.
  ======================================================= */

  const overviewChartData = useMemo(() => {
    const revenue = Number(stats.totalRevenue || 0);
    const todayRevenue = Number(stats.todayRevenue || 0);

    return [
      {
        name: "Total",
        revenue: Math.max(revenue, 0),
      },
      {
        name: "Today",
        revenue: Math.max(todayRevenue, 0),
      },
    ];
  }, [stats.totalRevenue, stats.todayRevenue]);

  /* =======================================================
     LOADING SKELETON
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b19] p-4 text-white sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="h-32 animate-pulse rounded-3xl bg-white/[0.04]" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl bg-white/[0.04]"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="h-80 animate-pulse rounded-2xl bg-white/[0.04] xl:col-span-2" />
            <div className="h-80 animate-pulse rounded-2xl bg-white/[0.04]" />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div className="h-72 animate-pulse rounded-2xl bg-white/[0.04]" />
            <div className="h-72 animate-pulse rounded-2xl bg-white/[0.04]" />
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100">
      <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">

        {/* =================================================
            TOP HEADER
        ================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111936] via-[#0c1329] to-[#090f20] p-6 shadow-2xl shadow-black/20 sm:p-8">

          {/* Glow */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-purple-600/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px]" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

            {/* Greeting */}
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300">
                <Sparkles className="h-3.5 w-3.5" />
                Live Business Overview
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Good morning, Hodan
                <span className="ml-2">👋</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Monitor your store performance, sales, inventory and
                customers from one powerful dashboard.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() => fetchDashboard(true)}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => navigate("/pos")}
                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500"
              >
                <Plus className="h-4 w-4" />
                New Sale
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </section>

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="flex flex-col gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
              </div>

              <p className="text-sm text-rose-300">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => fetchDashboard()}
              className="rounded-lg border border-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10"
            >
              Try again
            </button>
          </div>
        )}

        {/* =================================================
            MAIN KPI CARDS
        ================================================== */}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Products */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1328] p-5 transition duration-300 hover:-translate-y-1 hover:border-purple-500/30">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl transition group-hover:bg-purple-500/20" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Products
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  {formatNumber(stats.totalProducts)}
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                  Active catalog items
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
                <Package className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-purple-400">
              <Warehouse className="h-3.5 w-3.5" />
              Inventory
            </div>
          </div>

          {/* Customers */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1328] p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Customers
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  {formatNumber(stats.totalCustomers)}
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                  Registered customers
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-blue-400">
              <Users className="h-3.5 w-3.5" />
              Customer base
            </div>
          </div>

          {/* Sales */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1328] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl transition group-hover:bg-cyan-500/20" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Sales
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  {formatNumber(stats.totalSales)}
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                  Completed transactions
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <TrendingUp className="h-3.5 w-3.5" />
              Sales activity
            </div>
          </div>

          {/* Revenue */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1328] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/30">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition group-hover:bg-emerald-500/20" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Revenue
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  {formatCurrency(stats.totalRevenue)}
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                  Gross revenue earned
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Wallet className="h-3.5 w-3.5" />
              Revenue
            </div>
          </div>
        </section>

        {/* =================================================
            TODAY'S PERFORMANCE
        ================================================== */}

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-600/[0.10] via-[#0d142a] to-[#0b1124] p-6">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />

                  <p className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Today's Sales
                  </p>
                </div>

                <h2 className="mt-3 text-4xl font-black text-white">
                  {formatNumber(stats.todaySales)}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Orders processed today
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
                <BarChart3 className="h-7 w-7" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/[0.10] via-[#0d142a] to-[#0b1124] p-6">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />

                  <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Today's Revenue
                  </p>
                </div>

                <h2 className="mt-3 text-4xl font-black text-white">
                  {formatCurrency(stats.todayRevenue)}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Revenue generated today
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
                <CreditCard className="h-7 w-7" />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            CHARTS
        ================================================== */}

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Revenue Chart */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1328] xl:col-span-2">

            <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Revenue Overview
                    </h2>

                    <p className="text-xs text-slate-500">
                      Current revenue performance
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-400">
                Live data
              </div>
            </div>

            <div className="h-80 p-4 sm:p-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={overviewChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -10,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="dashboardRevenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="100%"
                        stopColor="#8b5cf6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />

                  <Tooltip
                    cursor={{
                      stroke: "#334155",
                      strokeDasharray: "4 4",
                    }}
                    contentStyle={{
                      backgroundColor: "#0b1124",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "14px",
                      color: "#fff",
                      boxShadow:
                        "0 20px 40px rgba(0,0,0,0.3)",
                    }}
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      "Revenue",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#dashboardRevenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1328]">

            <div className="border-b border-white/10 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                  <CreditCard className="h-4 w-4 text-blue-400" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    Payment Methods
                  </h2>

                  <p className="text-xs text-slate-500">
                    Revenue distribution
                  </p>
                </div>
              </div>
            </div>

            {stats.salesByPaymentMethod.length === 0 ? (
              <div className="flex h-72 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">
                  <CreditCard className="h-5 w-5 text-slate-600" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-400">
                  No payment data
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Payment statistics will appear here.
                </p>
              </div>
            ) : (
              <div className="p-5">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.salesByPaymentMethod}
                        dataKey="revenue"
                        nameKey="paymentMethod"
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={82}
                        paddingAngle={4}
                      >
                        {stats.salesByPaymentMethod.map(
                          (_, index) => (
                            <Cell
                              key={`payment-${index}`}
                              fill={
                                PAYMENT_COLORS[
                                  index %
                                    PAYMENT_COLORS.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0b1124",
                          border:
                            "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        formatter={(value) =>
                          formatCurrency(Number(value))
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {stats.salesByPaymentMethod.map(
                    (method, index) => {
                      const percentage =
                        paymentTotal > 0
                          ? (method.revenue /
                              paymentTotal) *
                            100
                          : 0;

                      return (
                        <div
                          key={method.paymentMethod}
                          className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor:
                                  PAYMENT_COLORS[
                                    index %
                                      PAYMENT_COLORS.length
                                  ],
                              }}
                            />

                            <div>
                              <p className="text-xs font-bold text-slate-300">
                                {method.paymentMethod}
                              </p>

                              <p className="text-[10px] text-slate-600">
                                {method.salesCount} sales
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-bold text-white">
                              {formatCurrency(method.revenue)}
                            </p>

                            <p className="text-[10px] text-slate-600">
                              {Math.round(percentage)}%
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            TOP PRODUCTS + LOW STOCK
        ================================================== */}

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* Top Selling */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1328]">

            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Top Selling Products
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Best performing products
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="flex items-center gap-1 text-xs font-semibold text-purple-400 transition hover:text-purple-300"
              >
                View products
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {stats.topSellingProducts.length === 0 ? (
              <div className="flex h-56 items-center justify-center text-sm text-slate-600">
                No sales data available
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {stats.topSellingProducts.map(
                  (product, index) => (
                    <div
                      key={product.productId}
                      className="group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/[0.02]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-xs font-black text-purple-400">
                          {index + 1}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {product.productName}
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            {formatNumber(
                              product.quantitySold
                            )}{" "}
                            units sold
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-white">
                          {formatCurrency(product.revenue)}
                        </p>

                        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-semibold text-emerald-400">
                          <TrendingUp className="h-3 w-3" />
                          Revenue
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Low Stock */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1328]">

            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Low Stock Alerts
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Products that need attention
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                <Bell className="h-4 w-4 text-amber-400" />
              </div>
            </div>

            {stats.lowStockProducts.length === 0 ? (
              <div className="flex h-56 flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <Package className="h-5 w-5 text-emerald-400" />
                </div>

                <p className="mt-4 text-sm font-semibold text-emerald-400">
                  Inventory looks healthy
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  No low-stock products at the moment.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {stats.lowStockProducts.map((product) => {
                  const badge = getStockBadge(
                    product.stockStatus
                  );

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/[0.02]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/10 bg-amber-500/[0.06]">
                          <Package className="h-4 w-4 text-amber-400" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {product.name}
                          </p>

                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                            {product.sku && (
                              <span>
                                SKU: {product.sku}
                              </span>
                            )}

                            <span>
                              {product.stock} remaining
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================== */}

        <section className="rounded-2xl border border-white/10 bg-[#0c1328] p-6">

          <div className="mb-5">
            <h2 className="text-lg font-bold text-white">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Jump directly to frequently used areas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <button
              type="button"
              onClick={() => navigate("/pos")}
              className="group flex items-center gap-4 rounded-xl border border-purple-500/10 bg-purple-500/[0.05] p-4 text-left transition hover:border-purple-500/30 hover:bg-purple-500/[0.08]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <ShoppingCart className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-white">
                  New Sale
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Open POS terminal
                </p>
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-600 transition group-hover:text-purple-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left transition hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Package className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-white">
                  Products
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Manage your catalog
                </p>
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-600 transition group-hover:text-blue-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left transition hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Users className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-white">
                  Customers
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  View customer records
                </p>
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-600 transition group-hover:text-indigo-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/reports")}
              className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left transition hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <BarChart3 className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-white">
                  Reports
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Analyze business data
                </p>
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-600 transition group-hover:text-emerald-400" />
            </button>
          </div>
        </section>

        {/* =================================================
            SYSTEM STATUS
        ================================================== */}

        <footer className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#0c1328] p-5 sm:flex-row sm:items-center">

          <div>
            <p className="text-sm font-bold text-white">
              POS NEON System
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Dashboard synchronized with your live backend data.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/[0.05] px-3 py-2 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            System Connected
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;