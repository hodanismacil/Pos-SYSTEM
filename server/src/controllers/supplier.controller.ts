import { Request, Response } from "express";
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
} from "../services/supplier.service";

// CREATE SUPPLIER
export const createSupplierController = async (req: Request, res: Response) => {
  try {
    const { name, supplierName, phoneNumber, email, address } = req.body;
    // Hubinta magaca: midka soo gala 'name' ama 'supplierName'
    const finalName = name || supplierName;

    const supplier = await createSupplier(finalName, phoneNumber, email, address);

    res.status(201).json({
      success: true,
      data: supplier,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE SUPPLIER
export const updateSupplierController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, supplierName, phoneNumber, email, address } = req.body;
    const finalName = name || supplierName;

    const supplier = await updateSupplier(
      Number(id),
      finalName,
      phoneNumber,
      email,
      address
    );

    res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL SUPPLIERS
export const getAllSuppliersController = async (req: Request, res: Response) => {
  try {
    const suppliers = await getAllSuppliers();
    res.status(200).json({
      success: true,
      data: suppliers,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SUPPLIER BY ID
export const getSupplierByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await getSupplierById(Number(id));
    res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE SUPPLIER
export const deleteSupplierController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteSupplier(Number(id));

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};