import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  CalendarDays,
  CreditCard,
  Package,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface PaymentMethodReport {
  paymentMethod: string;
  salesCount: number;
  revenue: number;
}

interface TopProduct {
  productId: number;
  productName: string;
  price: number;
  imageUrl?: string;
  quantitySold: number;
  revenue: number;
}

interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
  price: number;
  imageUrl?: string;
}

interface DashboardData {
  totalProducts: number;
  totalCustomers: number;
  totalSales: number;
  totalRevenue: number;
  todaySales: number;
  todayRevenue: number;
  lowStockProducts: LowStockProduct[];
  topSellingProducts: TopProduct[];
  salesByPaymentMethod: PaymentMethodReport[];
}

interface Sale {
  id: number;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

const Reports = () => {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [sales, setSales] = useState<Sale[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, salesResponse] =
        await Promise.all([
          api.get("/dashboard"),
          api.get("/sales"),
        ]);

      console.log(
        "Dashboard:",
        dashboardResponse.data
      );

      console.log(
        "Sales:",
        salesResponse.data
      );

      const dashboardData =
        dashboardResponse.data?.data ||
        dashboardResponse.data;

      const salesData =
        salesResponse.data?.data ||
        salesResponse.data;

      setDashboard(dashboardData);

      setSales(
        Array.isArray(salesData)
          ? salesData
          : []
      );
    } catch (error: any) {
      console.error(
        "Error fetching reports:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // =========================
  // SALES BY DAY
  // =========================

  const salesByDay = useMemo(() => {
    const map: Record<
      string,
      {
        salesCount: number;
        revenue: number;
      }
    > = {};

    sales.forEach((sale) => {
      const date = new Date(
        sale.createdAt
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!map[date]) {
        map[date] = {
          salesCount: 0,
          revenue: 0,
        };
      }

      map[date].salesCount += 1;
      map[date].revenue += Number(
        sale.totalAmount
      );
    });

    return Object.entries(map)
      .slice(-7)
      .map(([date, value]) => ({
        date,
        ...value,
      }));
  }, [sales]);

  const maxRevenue = Math.max(
    ...salesByDay.map(
      (item) => item.revenue
    ),
    1
  );

  // =========================
  // PAYMENT METHODS
  // =========================

  const paymentMethods =
    dashboard?.salesByPaymentMethod || [];

  const totalPaymentRevenue =
    paymentMethods.reduce(
      (sum, item) =>
        sum + Number(item.revenue),
      0
    );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <RefreshCw
          size={32}
          className="animate-spin text-purple-400"
        />
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <AlertTriangle
          size={35}
          className="mx-auto text-red-400"
        />

        <h2 className="mt-4 text-lg font-semibold text-white">
          Failed to load reports
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error}
        </p>

        <button
          onClick={fetchReports}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-500"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-purple-400">
            <BarChart3 size={17} />
            Analytics
          </div>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Reports
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Analyze your sales, revenue and store performance.
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#101631] px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
        >
          <RefreshCw size={17} />
          Refresh Data
        </button>

      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL SALES */}

        <div className="rounded-2xl border border-white/10 bg-[#101631] p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Total Sales
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                {dashboard?.totalSales || 0}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Completed transactions
              </p>
            </div>

            <div className="rounded-xl bg-blue-500/10 p-3">
              <ShoppingCart
                size={21}
                className="text-blue-400"
              />
            </div>

          </div>

        </div>

        {/* TOTAL REVENUE */}

        <div className="rounded-2xl border border-white/10 bg-[#101631] p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Total Revenue
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                $
                {Number(
                  dashboard?.totalRevenue || 0
                ).toLocaleString()}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Overall sales revenue
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-3">
              <DollarSign
                size={21}
                className="text-emerald-400"
              />
            </div>

          </div>

        </div>

        {/* TODAY SALES */}

        <div className="rounded-2xl border border-white/10 bg-[#101631] p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Today's Sales
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                {dashboard?.todaySales || 0}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Sales completed today
              </p>
            </div>

            <div className="rounded-xl bg-purple-500/10 p-3">
              <CalendarDays
                size={21}
                className="text-purple-400"
              />
            </div>

          </div>

        </div>

        {/* TODAY REVENUE */}

        <div className="rounded-2xl border border-white/10 bg-[#101631] p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Today's Revenue
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                $
                {Number(
                  dashboard?.todayRevenue || 0
                ).toLocaleString()}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Revenue generated today
              </p>
            </div>

            <div className="rounded-xl bg-cyan-500/10 p-3">
              <TrendingUp
                size={21}
                className="text-cyan-400"
              />
            </div>

          </div>

        </div>

      </div>

      {/* =========================
          SALES OVERVIEW + PAYMENT
      ========================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* SALES BY DAY */}

        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[#101631] p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-white">
                Sales Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Revenue for the last 7 sales days
              </p>
            </div>

            <div className="rounded-lg bg-purple-500/10 p-2">
              <BarChart3
                size={18}
                className="text-purple-400"
              />
            </div>

          </div>

          {salesByDay.length === 0 ? (

            <div className="flex h-64 items-center justify-center text-sm text-slate-500">
              No sales data available.
            </div>

          ) : (

            <div className="mt-8 space-y-5">

              {salesByDay.map((item) => (

                <div key={item.date}>

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-xs text-slate-400">
                      {item.date}
                    </span>

                    <span className="text-sm font-semibold text-white">
                      $
                      {item.revenue.toLocaleString()}
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-[#080d20]">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all"
                      style={{
                        width: `${
                          (item.revenue /
                            maxRevenue) *
                          100
                        }%`,
                      }}
                    />

                  </div>

                  <p className="mt-1 text-[11px] text-slate-600">
                    {item.salesCount} sale
                    {item.salesCount !== 1
                      ? "s"
                      : ""}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* PAYMENT METHODS */}

        <div className="rounded-2xl border border-white/10 bg-[#101631] p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-white">
                Payment Methods
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Sales distribution
              </p>
            </div>

            <CreditCard
              size={20}
              className="text-cyan-400"
            />

          </div>

          <div className="mt-7 space-y-5">

            {paymentMethods.length === 0 ? (

              <p className="py-12 text-center text-sm text-slate-500">
                No payment data available.
              </p>

            ) : (

              paymentMethods.map(
                (method) => {

                  const percentage =
                    totalPaymentRevenue >
                    0
                      ? (Number(
                          method.revenue
                        ) /
                          totalPaymentRevenue) *
                        100
                      : 0;

                  return (
                    <div
                      key={
                        method.paymentMethod
                      }
                    >

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div className="rounded-lg bg-cyan-500/10 p-2">

                            <CreditCard
                              size={16}
                              className="text-cyan-400"
                            />

                          </div>

                          <div>

                            <p className="text-sm font-medium text-white">
                              {
                                method.paymentMethod
                              }
                            </p>

                            <p className="text-xs text-slate-500">
                              {
                                method.salesCount
                              }{" "}
                              sales
                            </p>

                          </div>

                        </div>

                        <span className="text-sm font-semibold text-white">
                          $
                          {Number(
                            method.revenue
                          ).toLocaleString()}
                        </span>

                      </div>

                      <div className="mt-3 h-2 rounded-full bg-[#080d20]">

                        <div
                          className="h-full rounded-full bg-cyan-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                }
              )

            )}

          </div>

        </div>

      </div>

      {/* =========================
          TOP PRODUCTS
      ========================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <div className="rounded-2xl border border-white/10 bg-[#101631] p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-white">
                Top Selling Products
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Best performing products
              </p>
            </div>

            <Package
              size={20}
              className="text-purple-400"
            />

          </div>

          <div className="mt-6 space-y-3">

            {dashboard?.topSellingProducts
              ?.length ? (

              dashboard.topSellingProducts.map(
                (product) => (

                  <div
                    key={product.productId}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0a1026] p-4"
                  >

                    <div className="flex items-center gap-3">

                      {product.imageUrl ? (

                        <img
                          src={product.imageUrl}
                          alt={product.productName}
                          className="h-11 w-11 rounded-lg object-cover"
                        />

                      ) : (

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/10">
                          <Package
                            size={18}
                            className="text-purple-400"
                          />
                        </div>

                      )}

                      <div>

                        <p className="text-sm font-medium text-white">
                          {product.productName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {product.quantitySold} sold
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="text-sm font-bold text-white">
                        $
                        {Number(
                          product.revenue
                        ).toLocaleString()}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Revenue
                      </p>

                    </div>

                  </div>

                )
              )

            ) : (

              <div className="py-12 text-center text-sm text-slate-500">
                No product sales data available.
              </div>

            )}

          </div>

        </div>

        {/* =========================
            LOW STOCK
        ========================= */}

        <div className="rounded-2xl border border-white/10 bg-[#101631] p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-white">
                Low Stock Products
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Products that need attention
              </p>
            </div>

            <AlertTriangle
              size={20}
              className="text-yellow-400"
            />

          </div>

          <div className="mt-6 space-y-3">

            {dashboard?.lowStockProducts
              ?.length ? (

              dashboard.lowStockProducts.map(
                (product) => (

                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-xl border border-yellow-500/10 bg-yellow-500/[0.03] p-4"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-500/10">

                        <Package
                          size={18}
                          className="text-yellow-400"
                        />

                      </div>

                      <div>

                        <p className="text-sm font-medium text-white">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          ${Number(
                            product.price
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="text-sm font-bold text-yellow-400">
                        {product.stock}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        units left
                      </p>

                    </div>

                  </div>

                )
              )

            ) : (

              <div className="flex flex-col items-center justify-center py-12">

                <Package
                  size={35}
                  className="text-emerald-500"
                />

                <p className="mt-3 text-sm text-slate-400">
                  All products have healthy stock.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Reports;