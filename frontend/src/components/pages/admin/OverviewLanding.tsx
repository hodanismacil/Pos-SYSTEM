import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Menu,
  Package,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

export function OverviewLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: ShoppingCart,
      title: "Fast POS Sales",
      description:
        "Process customer sales quickly, calculate change automatically, and keep every transaction organized.",
    },
    {
      icon: Package,
      title: "Inventory Management",
      description:
        "Track products and stock levels in real time and quickly identify products that need restocking.",
    },
    {
      icon: Users,
      title: "Customer Management",
      description:
        "Keep customer information organized and connect customers with their purchase history.",
    },
    {
      icon: Truck,
      title: "Suppliers & Purchases",
      description:
        "Manage suppliers, record purchases, and automatically update product stock.",
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description:
        "Understand your business performance with sales, revenue, inventory, and payment insights.",
    },
    {
      icon: ShieldCheck,
      title: "Role-Based Security",
      description:
        "Control access with Admin and Cashier permissions so every user sees what they need.",
    },
  ];

  const benefits = [
    "Real-time inventory tracking",
    "Fast checkout experience",
    "Sales and revenue reporting",
    "Supplier and purchase management",
    "Customer records",
    "Admin & Cashier permissions",
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070b19] text-white">
      {/* =====================================================
          BACKGROUND EFFECTS
      ====================================================== */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[140px]" />

        <div className="absolute right-[-200px] top-[500px] h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[130px]" />

        <div className="absolute left-[-200px] top-[900px] h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070b19]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-500 shadow-lg shadow-purple-600/30">
              <ShoppingCart className="h-5 w-5" />
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                POS <span className="text-purple-400">NEON</span>
              </div>

              <div className="text-[11px] text-slate-500">
                Smart Business Management
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#home"
              className="text-sm font-medium text-white transition hover:text-purple-400"
            >
              Home
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-slate-400 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-400 transition hover:text-white"
            >
              About
            </a>

            <a
              href="#contact"
              className="text-sm font-medium text-slate-400 transition hover:text-white"
            >
              Contact
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-purple-500/30 hover:bg-white/5 hover:text-white"
            >
              Sign In
            </Link>

            <Link
              to="/login"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-purple-600/20 transition hover:from-purple-500 hover:to-indigo-500"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-white/10 p-2.5 text-slate-300 transition hover:bg-white/5 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#080d20] px-6 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300"
              >
                Home
              </a>

              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300"
              >
                Features
              </a>

              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300"
              >
                About
              </a>

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300"
              >
                Contact
              </a>

              <div className="flex gap-3 border-t border-white/10 pt-4">
                <Link
                  to="/login"
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-slate-300"
                >
                  Sign In
                </Link>

                <Link
                  to="/login"
                  className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-center text-sm font-semibold"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* =====================================================
          HERO
      ====================================================== */}
      <section id="home" className="relative">
        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-24">
          {/* Hero Content */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300">
              <span className="flex h-2 w-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/70" />
              <Sparkles className="h-3.5 w-3.5" />
              Modern Point of Sale System
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Run your business
              <span className="block bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                smarter & faster.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              POS NEON waa nidaam casri ah oo kaa caawinaya inaad hal meel
              kaga maamusho iibka, alaabta, customers-ka, suppliers-ka,
              purchases-ka iyo reports-ka ganacsigaaga.
            </p>

            {/* Hero Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-4 font-bold shadow-xl shadow-purple-600/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500"
              >
                Start Managing Your Store
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>

              <a
                href="#features"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-7 py-4 font-semibold text-slate-300 transition hover:border-purple-500/30 hover:bg-white/[0.06] hover:text-white"
              >
                Explore Features
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            {/* Hero Trust Points */}
            <div className="mt-9 grid grid-cols-1 gap-3 text-sm text-slate-400 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400" />
                Fast & Simple
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400" />
                Secure Access
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400" />
                Real-time Data
              </div>
            </div>
          </div>

          {/* =================================================
              DASHBOARD PREVIEW
          ================================================== */}
          <div className="relative lg:pl-8">
            <div className="absolute -inset-8 rounded-[40px] bg-purple-600/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1125] shadow-2xl shadow-black/40">
              {/* Fake Browser/Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-[#090e20] px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                </div>

                <div className="rounded-lg border border-white/5 bg-white/[0.03] px-8 py-1.5 text-[10px] text-slate-600">
                  pos-neon.local/dashboard
                </div>

                <div className="w-10" />
              </div>

              <div className="flex min-h-[430px]">
                {/* Mini Sidebar */}
                <div className="hidden w-20 border-r border-white/10 bg-[#080d1d] p-3 sm:block">
                  <div className="mb-7 flex h-10 items-center justify-center rounded-xl bg-purple-600/20">
                    <ShoppingCart className="h-5 w-5 text-purple-400" />
                  </div>

                  <div className="space-y-3">
                    {[LayoutDashboard, Package, Users, ShoppingCart, BarChart3].map(
                      (Icon, index) => (
                        <div
                          key={index}
                          className={`flex h-10 items-center justify-center rounded-xl ${
                            index === 0
                              ? "bg-purple-600/20 text-purple-400"
                              : "text-slate-600"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Mini Dashboard */}
                <div className="flex-1 p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                        Live Analytics
                      </div>

                      <h3 className="mt-2 text-xl font-bold">
                        Store Overview
                      </h3>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                      <Bell className="h-4 w-4 text-slate-500" />
                    </div>
                  </div>

                  {/* Mini Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-[#0e152b] p-4">
                      <div className="text-[10px] uppercase text-slate-500">
                        Products
                      </div>

                      <div className="mt-2 text-2xl font-black">248</div>

                      <div className="mt-1 text-[10px] text-green-400">
                        +12 this month
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0e152b] p-4">
                      <div className="text-[10px] uppercase text-slate-500">
                        Customers
                      </div>

                      <div className="mt-2 text-2xl font-black">1,284</div>

                      <div className="mt-1 text-[10px] text-blue-400">
                        Active customers
                      </div>
                    </div>

                    <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.06] p-4">
                      <div className="text-[10px] uppercase text-purple-300">
                        Today's Sales
                      </div>

                      <div className="mt-2 text-2xl font-black">$4,820</div>

                      <div className="mt-1 text-[10px] text-purple-300">
                        +18.4%
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0e152b] p-4">
                      <div className="text-[10px] uppercase text-slate-500">
                        Orders
                      </div>

                      <div className="mt-2 text-2xl font-black">126</div>

                      <div className="mt-1 text-[10px] text-slate-500">
                        Completed
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="mt-4 rounded-2xl border border-white/10 bg-[#0e152b] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold">
                          Sales & Revenue
                        </div>
                        <div className="mt-1 text-[10px] text-slate-500">
                          Weekly performance
                        </div>
                      </div>

                      <BarChart3 className="h-4 w-4 text-purple-400" />
                    </div>

                    <div className="mt-5 flex h-24 items-end gap-2">
                      {[35, 55, 42, 75, 58, 90, 70, 96, 78, 100].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t-md bg-gradient-to-t from-purple-700/30 to-purple-400/80"
                            style={{ height: `${height}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-3 hidden rounded-2xl border border-white/10 bg-[#10172d]/95 p-4 shadow-xl backdrop-blur-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <Zap className="h-5 w-5 text-green-400" />
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-400">
                    Today's Revenue
                  </div>

                  <div className="text-lg font-black">$4,820.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="border-y border-white/10 bg-[#090f21]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-white/10 md:grid-cols-4 md:divide-x">
          <div className="px-6 py-10 text-center">
            <div className="text-3xl font-black text-white">6+</div>
            <div className="mt-1 text-sm text-slate-500">
              Core Modules
            </div>
          </div>

          <div className="px-6 py-10 text-center">
            <div className="text-3xl font-black text-white">24/7</div>
            <div className="mt-1 text-sm text-slate-500">
              Business Visibility
            </div>
          </div>

          <div className="px-6 py-10 text-center">
            <div className="text-3xl font-black text-white">100%</div>
            <div className="mt-1 text-sm text-slate-500">
              Centralized Data
            </div>
          </div>

          <div className="px-6 py-10 text-center">
            <div className="text-3xl font-black text-white">RBAC</div>
            <div className="mt-1 text-sm text-slate-500">
              Role-Based Access
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}
      <section id="features" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300">
              <Sparkles className="h-3.5 w-3.5" />
              Everything You Need
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              One system.
              <span className="text-purple-400"> Complete control.</span>
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              POS NEON wuxuu isku keenaa qalabka muhiimka ah ee aad u baahan
              tahay si aad si fudud oo nidaamsan ugu maamusho ganacsigaaga.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-white/10 bg-[#0c1328] p-7 transition duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-[#0f1730]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 transition group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="text-xs font-bold text-slate-700">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {feature.description}
                  </p>

                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-purple-400 opacity-0 transition group-hover:opacity-100">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT / WHY CHOOSE US
      ====================================================== */}
      <section
        id="about"
        className="scroll-mt-20 border-y border-white/10 bg-[#090f21] py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Built for Business
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Everything your store needs,
              <span className="block text-purple-400">
                in one powerful platform.
              </span>
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-slate-400">
              Halkii aad isticmaali lahayd tools badan oo kala duwan, POS
              NEON wuxuu kuu keenayaa maamulka iibka, inventory-ga,
              customers-ka, purchases-ka iyo reports-ka hal meel.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-purple-400" />
                  {benefit}
                </div>
              ))}
            </div>

            <Link
              to="/login"
              className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#090d1d] transition hover:bg-slate-200"
            >
              Access Your POS
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right - Feature Panel */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-3xl bg-purple-600/10 blur-2xl" />

            <div className="relative rounded-3xl border border-white/10 bg-[#0c1328] p-6 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600/15">
                  <Store className="h-5 w-5 text-purple-400" />
                </div>

                <div>
                  <div className="font-bold">Store Management</div>
                  <div className="text-xs text-slate-500">
                    Everything connected in one place
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-purple-400" />
                    <span className="text-sm">Today's Sales</span>
                  </div>

                  <span className="font-bold">$4,820</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">Inventory</span>
                  </div>

                  <span className="font-bold">248 Items</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-indigo-400" />
                    <span className="text-sm">Customers</span>
                  </div>

                  <span className="font-bold">1,284</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-5 w-5 text-pink-400" />
                    <span className="text-sm">Orders</span>
                  </div>

                  <span className="font-bold">126</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/[0.05] p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-green-400" />
                    <span className="text-sm">Payment Status</span>
                  </div>

                  <span className="flex items-center gap-2 text-xs font-bold text-green-400">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    All Systems Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-600/15 via-[#101632] to-indigo-600/10 px-6 py-16 text-center sm:px-12">
          <div className="absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-purple-500/20 blur-[100px]" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
              <ClipboardList className="h-6 w-6 text-purple-400" />
            </div>

            <h2 className="mt-6 text-3xl font-black sm:text-4xl">
              Ready to take control of your business?
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Ku maamul ganacsigaaga si ka fudud, degdeg badan, oo nidaamsan.
              Bilow isticmaalka POS NEON maanta.
            </p>

            <Link
              to="/login"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-4 font-bold shadow-xl shadow-purple-600/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ====================================================== */}
      <section
        id="contact"
        className="scroll-mt-20 border-t border-white/10 bg-[#090e1e] py-16"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600">
                  <ShoppingCart className="h-5 w-5" />
                </div>

                <span className="text-lg font-bold">
                  POS <span className="text-purple-400">NEON</span>
                </span>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
                A modern point of sale and business management system built
                to make store operations simpler and smarter.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Product</h3>

              <div className="mt-4 space-y-3 text-sm text-slate-500">
                <a
                  href="#features"
                  className="block transition hover:text-purple-400"
                >
                  Features
                </a>

                <a
                  href="#about"
                  className="block transition hover:text-purple-400"
                >
                  About
                </a>

                <Link
                  to="/login"
                  className="block transition hover:text-purple-400"
                >
                  Sign In
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Get Started</h3>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Access your POS dashboard and start managing your business.
              </p>

              <Link
                to="/login"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-400 transition hover:text-purple-300"
              >
                Open POS System
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-white/10 bg-[#070b19]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} POS NEON System. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            System Ready
          </div>
        </div>
      </footer>
    </div>
  );
}