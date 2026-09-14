import prisma from "../config/prisma";


   export const stockIn = async (
  productId: number,
  quantity: number
) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Hubi product-ka
    const product = await tx.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // 2. Kordhi stock
    const updatedProduct = await tx.product.update({
      where: {
        id: productId,
      },
      data: {
        stock: product.stock + quantity,
      },
    });

    // 3. Qor Stock History
    await tx.stockHistory.create({
      data: {
        productId,
        change: quantity,
        reason: "Stock In",
      },
    });

    return updatedProduct;
  });
};


export const stockOut = async (
  productId: number,
  quantity: number
) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Hubi product-ka
    const product = await tx.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // 2. Hubi stock ku filan
    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    // 3. KA JAR stock
    const updatedProduct = await tx.product.update({
      where: {
        id: productId,
      },
      data: {
        stock: product.stock - quantity,
      },
    });

    // 4. Stock History
    await tx.stockHistory.create({
      data: {
        productId,
        change: -quantity,
        reason: "Stock Out",
      },
    });

    return updatedProduct;
  });
};

export const getStockHistory = async () => {
  return await prisma.stockHistory.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};



export const getLowStockProducts = async () => {
  const products = await prisma.product.findMany({
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
  });

  return products.map((product) => ({
    ...product,
    stockStatus:
      product.stock === 0
        ? "OUT_OF_STOCK"
        : product.stock <= 2
        ? "CRITICAL"
        : "LOW",
  }));
};