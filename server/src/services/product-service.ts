
import prisma from "../config/prisma";

export const createProduct = async (
  name: string,
  sku: string,
  barcode: string,
  price: number,
  stock: number,
  description: string,
  imageUrl: string,
  categoryId: number
) => {
  // Hubi category-ga
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const product = await prisma.product.create({
    data: {
      name,
      sku,
      barcode,
      price,
      stock,
      description,
      imageUrl,
      categoryId,
    },
    include: {
      category: true,
    },
  });

  return product;
};



export const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return products;
};

export const getProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
   if (!product) {
      throw new Error("Product not found");
    }
  return product;
};


export const updateProduct = async (
  id: number,
  name: string,
  sku: string,
  barcode: string,
  price: number,
  stock: number,
  description: string,
  imageUrl: string,
  categoryId: number
) => {
  // Hubi category-ga
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      sku,
      barcode,
      price,
      stock,
      description,
      imageUrl,
      categoryId,
    },
    include: {
      category: true,
    },
  });

  return product;
};

export const deleteProduct = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  await prisma.product.delete({
    where: { id },
  });

  return;
};