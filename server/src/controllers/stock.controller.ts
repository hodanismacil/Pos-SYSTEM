import type { Request, Response } from "express";
import { getLowStockProducts, getStockHistory, stockIn, stockOut } from "../services/stock.service";


export const stockInController = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity);

    if (!productId || !Number.isInteger(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid productId is required",
      });
    }

    if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const product = await stockIn(productId, quantity);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const stockOutController = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity);

    if (!productId || !Number.isInteger(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid productId is required",
      });
    }

    if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const product = await stockOut(productId, quantity);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getStockHistoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const history = await getStockHistory();

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLowStockProductsController = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await getLowStockProducts();

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};