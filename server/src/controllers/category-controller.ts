import type { Request, Response } from "express";
import { createCategory, getAllCategories, updateCategory, deleteCategory } from "../services/category";

// ==========================================
// CREATE CATEGORY
// ==========================================

export const create = async (
  req: Request,
  res: Response
) => {
  const { name } = req.body;

  try {
    const category = await createCategory(name);

    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL CATEGORIES
// ==========================================

export const getAll = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await getAllCategories();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE CATEGORY
// ==========================================

export const update = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  try {
    const category = await updateCategory(
      id,
      name
    );

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// DELETE CATEGORY
// ==========================================

export const remove = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  try {
    const category = await deleteCategory(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};