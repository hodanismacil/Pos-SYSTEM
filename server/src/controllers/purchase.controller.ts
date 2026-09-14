import { Request, Response } from "express";
import {
  createPurchase,
  deletePurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
} from "../services/purchase.service";

// CREATE PURCHASE
export const createPurchaseController = async (req: Request, res: Response) => {
  try {
    const { supplierId, items } = req.body;

    if (!supplierId || !items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "supplierId and items array are required",
      });
    }

    const purchase = await createPurchase(Number(supplierId), items);

    return res.status(201).json({
      success: true,
      data: purchase,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PURCHASES
export const getAllPurchasesController = async (req: Request, res: Response) => {
  try {
    const purchases = await getAllPurchases();

    return res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PURCHASE BY ID
export const getPurchaseByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchase = await getPurchaseById(Number(id));

    return res.status(200).json({
      success: true,
      data: purchase,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const updatePurchaseController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { supplierId, items } = req.body;

    if (!supplierId || !items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "supplierId and items array are required",
      });
    }

    const updatedPurchase = await updatePurchase(Number(id), Number(supplierId), items);

    return res.status(200).json({
      success: true,
      data: updatedPurchase,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePurchaseController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deletePurchase(Number(id));
    return res.status(200).json({
      success: true,
      message: "Purchase deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
