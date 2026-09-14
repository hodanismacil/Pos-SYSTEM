import prisma from "../config/prisma";

// CREATE SUPPLIER
export const createSupplier = async (
  name: string,
  phoneNumber?: string,
  email?: string,
  address?: string
) => {
  const supplierName = name.trim();

  if (!supplierName) {
    throw new Error("Supplier name is required");
  }

  if (phoneNumber) {
    const existingPhone = await prisma.supplier.findFirst({
      where: { phoneNumber },
    });

    if (existingPhone) {
      throw new Error("Supplier phone number already exists");
    }
  }

  const supplier = await prisma.supplier.create({
  data: {
    name: supplierName,
    phoneNumber: phoneNumber ?? null,
    email: email ?? null,
    address: address ?? null,
  },
});


  return supplier;
};

// GET ALL SUPPLIERS
export const getAllSuppliers = async () => {
  return await prisma.supplier.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          purchases: true,
        },
      },
    },
  });
};

// GET SUPPLIER BY ID
export const getSupplierById = async (id: number) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      purchases: true,
    },
  });

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return supplier;
};

// UPDATE SUPPLIER
export const updateSupplier = async (
  id: number,
  name: string,
  phoneNumber?: string,
  email?: string,
  address?: string
) => {
  const supplierName = name.trim();

  if (!supplierName) {
    throw new Error("Supplier name is required");
  }

  const existingSupplier = await prisma.supplier.findUnique({
    where: { id },
  });

  if (!existingSupplier) {
    throw new Error("Supplier not found");
  }

  if (phoneNumber) {
    const duplicatePhone = await prisma.supplier.findFirst({
      where: {
        phoneNumber,
        NOT: {
          id,
        },
      },
    });

    if (duplicatePhone) {
      throw new Error("Supplier phone number already exists");
    }
  }

  const supplier = await prisma.supplier.update({
    where: { id },
    data: {
      name: supplierName,
      ...(phoneNumber !== undefined && { phoneNumber }),
      ...(email !== undefined && { email }),
      ...(address !== undefined && { address }),
    },
  });

  return supplier;
};

// DELETE SUPPLIER
export const deleteSupplier = async (id: number) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          purchases: true,
        },
      },
    },
  });

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  if (supplier._count.purchases > 0) {
    throw new Error(
      "Cannot delete supplier because it has purchases"
    );
  }

  const deletedSupplier = await prisma.supplier.delete({
    where: { id },
  });

  return deletedSupplier;
};