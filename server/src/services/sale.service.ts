import prisma from "../config/prisma";
import { PaymentMethod, SaleStatus } from "@prisma/client";

interface SaleItemInput {
  productId: number;
  quantity: number;
}

interface CreateSaleData {
  customerId?: number | null;
  paymentMethod: PaymentMethod;
  paidAmount: number;
  discount?: number;
  items: SaleItemInput[];
}

// ===============================
// CREATE SALE
// ===============================
export const createSale = async (
  data: CreateSaleData,
  userId: number
) => {
  if (!data) {
    throw new Error("Sale data is required");
  }

  const {
    customerId,
    paymentMethod,
    paidAmount,
    discount = 0,
    items,
  } = data;

  // Validate user
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid userId");
  }

  // Validate customer
  if (customerId !== null && customerId !== undefined) {
    if (!Number.isInteger(customerId) || customerId <= 0) {
      throw new Error("Invalid customerId");
    }
  }

  // Validate payment method
  if (!paymentMethod) {
    throw new Error("Payment method is required");
  }

  // Validate paid amount
  if (
    typeof paidAmount !== "number" ||
    !Number.isFinite(paidAmount) ||
    paidAmount < 0
  ) {
    throw new Error("Invalid paid amount");
  }

  // Validate discount
  if (
    typeof discount !== "number" ||
    !Number.isFinite(discount) ||
    discount < 0
  ) {
    throw new Error("Invalid discount amount");
  }

  // Validate items
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Sale must contain at least one item");
  }

  for (const item of items) {
    if (
      !Number.isInteger(item.productId) ||
      item.productId <= 0
    ) {
      throw new Error("Invalid productId");
    }

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new Error("Quantity must be a positive integer");
    }
  }

  return await prisma.$transaction(async (tx) => {
    // ===============================
    // CHECK CUSTOMER
    // ===============================
    if (customerId !== null && customerId !== undefined) {
      const customer = await tx.customer.findUnique({
        where: {
          id: customerId,
        },
      });

      if (!customer) {
        throw new Error("Customer not found");
      }
    }

    // ===============================
    // CHECK PRODUCTS & STOCK
    // ===============================
    let itemsTotal = 0;

    const products: {
      item: SaleItemInput;
      product: {
        id: number;
        name: string;
        price: number;
        stock: number;
      };
    }[] = [];

    for (const item of items) {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) {
        throw new Error(
          `Product with ID ${item.productId} not found`
        );
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}`
        );
      }

      const subTotal = product.price * item.quantity;

      itemsTotal += subTotal;

      products.push({
        item,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
        },
      });
    }

    // ===============================
    // CALCULATE TOTAL
    // ===============================
    if (discount > itemsTotal) {
      throw new Error(
        "Discount cannot be greater than the sale total"
      );
    }

    const totalAmount = itemsTotal - discount;

    // ===============================
    // CHECK PAYMENT
    // ===============================
    if (paidAmount < totalAmount) {
      throw new Error(
        "Paid amount is less than final total amount"
      );
    }

    const changeAmount = paidAmount - totalAmount;

    // Since payment is already enough,
    // record the actual amount needed for the sale.
    const actualPaidAmount = totalAmount;

    // ===============================
    // CREATE SALE
    // ===============================
    const sale = await tx.sale.create({
      data: {
        userId,

        customerId:
          customerId !== null &&
          customerId !== undefined
            ? customerId
            : null,

        paymentMethod,

        discount,

        totalAmount,

        paidAmount: actualPaidAmount,

        changeAmount,

        status: SaleStatus.COMPLETED,
      },
    });

    // ===============================
    // CREATE SALE ITEMS
    // ===============================
    for (const { item, product } of products) {
      const subTotal =
        product.price * item.quantity;

      await tx.saleItem.create({
        data: {
          saleId: sale.id,

          productId: product.id,

          productName: product.name,

          quantity: item.quantity,

          price: product.price,

          subTotal,
        },
      });

      // ===============================
      // REDUCE STOCK
      // ===============================
      await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      // ===============================
      // STOCK HISTORY
      // ===============================
      await tx.stockHistory.create({
        data: {
          productId: product.id,

          change: -item.quantity,

          reason: `Sale #${sale.id}`,
        },
      });
    }

    return sale;
  });
};

// ===============================
// GET ALL SALES
// ===============================
export const getSales = async () => {
  return await prisma.sale.findMany({
    include: {
      customer: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },

      saleItems: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

// ===============================
// GET SALE BY ID
// ===============================
export const getSaleById = async (
  id: number
) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid sale ID");
  }

  const sale = await prisma.sale.findUnique({
    where: {
      id,
    },

    include: {
      customer: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },

      saleItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!sale) {
    throw new Error("Sale not found");
  }

  return sale;
};

// ===============================
// VOID SALE
// ===============================
export const voidSale = async (
  id: number
) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid sale ID");
  }

  return await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({
      where: {
        id,
      },

      include: {
        saleItems: true,
      },
    });

    if (!sale) {
      throw new Error("Sale not found");
    }

    if (sale.status === SaleStatus.VOIDED) {
      throw new Error(
        "This sale is already voided"
      );
    }

    // ===============================
    // RESTORE STOCK
    // ===============================
    for (const item of sale.saleItems) {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) {
        throw new Error(
          `Product ${item.productId} not found`
        );
      }

      await tx.product.update({
        where: {
          id: product.id,
        },

        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });

      await tx.stockHistory.create({
        data: {
          productId: product.id,

          change: item.quantity,

          reason: `Sale Voided #${sale.id}`,
        },
      });
    }

    // ===============================
    // UPDATE SALE STATUS
    // ===============================
    const updatedSale = await tx.sale.update({
      where: {
        id,
      },

      data: {
        status: SaleStatus.VOIDED,
      },
    });

    return {
      message: "Sale voided successfully",
      sale: updatedSale,
    };
  });
};

export const exportSalesService = async (startDate?: string, endDate?: string) => {
  const whereClause: any = {};

  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const sales = await prisma.sale.findMany({
    where: whereClause,
    include: {
      customer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return sales.map((sale) => ({
  Invoice_ID: `#${sale.id}`,
  Date: new Date(sale.createdAt).toLocaleString(),
  Customer: sale.customer ? sale.customer.name : "Walk-in Customer",
  Payment_Method: sale.paymentMethod,
  Subtotal: (sale.totalAmount || 0) + (sale.discount || 0),
  Discount: sale.discount || 0,
  Total: sale.totalAmount,
  Paid: sale.paidAmount,
  Change: sale.changeAmount,
}
));
}