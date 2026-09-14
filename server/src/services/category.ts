import prisma from "../config/prisma";

// ===============================
// CREATE CATEGORY
// ===============================
export const createCategory = async (name: string) => {
  const categoryName = name.trim();

  if (!categoryName) {
    throw new Error("Category name is required");
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await prisma.category.create({
    data: {
      name: categoryName,
    },
  });

  return category;
};


// ===============================
// GET ALL CATEGORIES
// ===============================
export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
};


// ===============================
// UPDATE CATEGORY
// ===============================
export const updateCategory = async (
  id: number,
  name: string
) => {
  const categoryName = name.trim();

  if (!categoryName) {
    throw new Error("Category name is required");
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  // Hubi magaca cusub inuusan category kale lahayn
  const duplicateCategory = await prisma.category.findFirst({
    where: {
      name: categoryName,
      NOT: {
        id,
      },
    },
  });

  if (duplicateCategory) {
    throw new Error("Category already exists");
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name: categoryName,
    },
  });

  return updatedCategory;
};


// ===============================
// DELETE CATEGORY
// ===============================
export const deleteCategory = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Haddii products ku jiraan category-ga
  if (category._count.products > 0) {
    throw new Error(
      "Cannot delete category because it has products"
    );
  }

  const deletedCategory = await prisma.category.delete({
    where: {
      id,
    },
  });

  return deletedCategory;
};