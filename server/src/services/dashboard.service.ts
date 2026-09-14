import prisma from "../config/prisma";

export const getDashboardStats = async () => {
  // Bilowga maanta
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Bilowga berri
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const [
    totalProducts,
    totalCustomers,
    totalSales,
    revenueResult,
    lowStockProducts,
    todaySales,
    todayRevenueResult,
    topSellingProducts,
    salesByPaymentMethod, // NEW
  ] = await Promise.all([
    // Total Products
    prisma.product.count(),

    // Total Customers
    prisma.customer.count(),

    // Total Sales
    prisma.sale.count(),

    // Total Revenue
    prisma.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),

    // Low Stock Products
    prisma.product.findMany({
      where: {
        stock: {
          lte: 5,
        },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        barcode: true,
        price: true,
        stock: true,
        imageUrl: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        stock: "asc",
      },
    }),

    // Today's Sales
    prisma.sale.count({
      where: {
        createdAt: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
      },
    }),

    // Today's Revenue
    prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
      },
      _sum: {
        totalAmount: true,
      },
    }),

    // Top Selling Products
    prisma.saleItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
        subTotal: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    }),

    // Sales By Payment Method
    prisma.sale.groupBy({
      by: ["paymentMethod"],
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  // Stock Status
  const formattedLowStockProducts = lowStockProducts.map((product) => ({
    ...product,

    stockStatus:
      product.stock === 0
        ? "OUT_OF_STOCK"
        : product.stock <= 2
        ? "CRITICAL"
        : "LOW",
  }));

  // Product IDs
  const productIds = topSellingProducts.map(
    (item) => item.productId
  );

  // Soo qaado products-ka
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
    },
  });

  // Top Products
  const topProducts = topSellingProducts.map((item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    return {
      productId: item.productId,
      productName: product?.name ?? "Unknown Product",
      price: product?.price ?? 0,
      imageUrl: product?.imageUrl ?? null,
      quantitySold: item._sum.quantity ?? 0,
      revenue: item._sum.subTotal ?? 0,
    };
  });

  // Sales By Payment Method
  const formattedSalesByPaymentMethod =
    salesByPaymentMethod.map((item) => ({
      paymentMethod: item.paymentMethod,
      salesCount: item._count.id,
      revenue: item._sum.totalAmount ?? 0,
    }));

  return {
    totalProducts,
    totalCustomers,
    totalSales,

    totalRevenue:
      revenueResult._sum.totalAmount ?? 0,

    todaySales,

    todayRevenue:
      todayRevenueResult._sum.totalAmount ?? 0,

    // Low Stock + Stock Status
    lowStockProducts: formattedLowStockProducts,

    // Top Selling
    topSellingProducts: topProducts,

    // Sales By Payment Method
    salesByPaymentMethod:
      formattedSalesByPaymentMethod,
  };
};