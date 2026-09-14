import prisma from "../config/prisma";

interface PurchaseItemInput {
  productId: number;
  quantity: number;
  price: number;
}

interface PreparedPurchaseItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
}

// CREATE PURCHASE
export const createPurchase = async (
  supplierId: number,
  items: PurchaseItemInput[]
) => {
  if (!supplierId) {
    throw new Error("Supplier ID is required");
  }

  if (!items || items.length === 0) {
    throw new Error("Purchase must contain at least one item");
  }

  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
  });

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  let totalAmount = 0;
  const preparedItems: PreparedPurchaseItem[] = [];

  for (const item of items) {
    if (!item.productId) {
      throw new Error("Product ID is required");
    }

    if (item.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (item.price < 0) {
      throw new Error("Price cannot be negative");
    }

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }

    const subTotal = item.quantity * item.price;

    totalAmount += subTotal;

    preparedItems.push({
      productId: item.productId,
      productName: product.name,
      quantity: item.quantity,
      price: item.price,
      subTotal,
    });
  }

  return await prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.create({
      data: {
        supplierId,
        totalAmount,
        purchaseItems: {
          create: preparedItems,
        },
      },
      include: {
        purchaseItems: true,
        supplier: true,
      },
    });

    // Increase stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });

      await tx.stockHistory.create({
        data: {
          productId: item.productId,
          change: item.quantity,
          reason: `Restocked via Purchase ID: #${purchase.id}`,
        },
      });
    }

    return purchase;
  });
};

// GET ALL PURCHASES
export const getAllPurchases = async () => {
  return await prisma.purchase.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      supplier: {
        select: {
          id: true,
          name: true,
          phoneNumber: true,
        },
      },
      purchaseItems: true,
    },
  });
};

// GET PURCHASE BY ID
export const getPurchaseById = async (id: number) => {
  const purchase = await prisma.purchase.findUnique({
    where: { id },
    include: {
      supplier: true,
      purchaseItems: true,
    },
  });

  if (!purchase) {
    throw new Error("Purchase record not found");
  }

  return purchase;
};

// DELETE PURCHASE
export const deletePurchase = async (id: number) => {
  const purchase = await prisma.purchase.findUnique({
    where: { id },
    include: {
      purchaseItems: true,
    },
  });

  if (!purchase) {
    throw new Error("Purchase record not found");
  }

  return await prisma.$transaction(async (tx) => {
    // Decrease stock and create history
    for (const item of purchase.purchaseItems) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Cannot delete purchase. Product "${product.name}" does not have enough stock`
        );
      }

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      await tx.stockHistory.create({
        data: {
          productId: item.productId,
          change: -item.quantity,
          reason: `Stock removed due to deletion of Purchase ID: #${purchase.id}`,
        },
      });
    }

    // Delete purchase items
    await tx.purchaseItem.deleteMany({
      where: {
        purchaseId: id,
      },
    });

    // Delete purchase
    return await tx.purchase.delete({
      where: { id },
    });
  });
};

// UPDATE PURCHASE
export const updatePurchase = async (
  id: number,
  supplierId: number,
  items: PurchaseItemInput[]
) => {
  if (!supplierId) {
    throw new Error("Supplier ID is required");
  }

  if (!items || items.length === 0) {
    throw new Error("Purchase must contain at least one item");
  }

  const oldPurchase = await prisma.purchase.findUnique({
    where: { id },
    include: {
      purchaseItems: true,
    },
  });

  if (!oldPurchase) {
    throw new Error("Purchase record not found");
  }

  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
  });

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Remove old purchase stock
    for (const oldItem of oldPurchase.purchaseItems) {
      const product = await tx.product.findUnique({
        where: { id: oldItem.productId },
      });

      if (!product) {
        throw new Error(
          `Product with ID ${oldItem.productId} not found`
        );
      }

      if (product.stock < oldItem.quantity) {
        throw new Error(
          `Cannot update purchase. Product "${product.name}" does not have enough stock`
        );
      }

      await tx.product.update({
        where: { id: oldItem.productId },
        data: {
          stock: {
            decrement: oldItem.quantity,
          },
        },
      });

      await tx.stockHistory.create({
        data: {
          productId: oldItem.productId,
          change: -oldItem.quantity,
          reason: `Stock reversed due to update of Purchase ID: #${id}`,
        },
      });
    }

    // 2. Validate new items
    let totalAmount = 0;
    const preparedItems: PreparedPurchaseItem[] = [];

    for (const item of items) {
      if (!item.productId) {
        throw new Error("Product ID is required");
      }

      if (item.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      if (item.price < 0) {
        throw new Error("Price cannot be negative");
      }

      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(
          `Product with ID ${item.productId} not found`
        );
      }

      const subTotal = item.quantity * item.price;

      totalAmount += subTotal;

      preparedItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: item.price,
        subTotal,
      });
    }

    // 3. Delete old purchase items
    await tx.purchaseItem.deleteMany({
      where: {
        purchaseId: id,
      },
    });

    // 4. Update purchase
    const updatedPurchase = await tx.purchase.update({
      where: { id },
      data: {
        supplierId,
        totalAmount,
        purchaseItems: {
          create: preparedItems,
        },
      },
      include: {
        purchaseItems: true,
        supplier: true,
      },
    });

    // 5. Add new stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });

      await tx.stockHistory.create({
        data: {
          productId: item.productId,
          change: item.quantity,
          reason: `Stock added due to update of Purchase ID: #${id}`,
        },
      });
    }

    return updatedPurchase;
  });
};