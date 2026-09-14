
import type { Request, Response } from "express";
import { createSale,  exportSalesService,  getSaleById, getSales, voidSale } from "../services/sale.service";

export const create = async (req: Request, res: Response) => {
  try {
    const sale = await createSale(req.body, (req as any).user.id);

    res.status(201).json({
      success: true,
      data: sale,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllSales = async (req: Request, res: Response) => {
  try {
    const sales = await getSales();

    res.status(200).json({
      success: true,
      data: sales,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getsaleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const sale = await getSaleById(Number(id));

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sale,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const vodSalec = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await voidSale(Number(id));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const exportSales = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await exportSalesService(
      startDate as string,
      endDate as string
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Export error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to export sales data",
    });
  }
};