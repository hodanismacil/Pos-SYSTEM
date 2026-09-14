import { Request, Response } from "express";
import {
  getSettings,
  updateSettings,
} from "../services/settings.service";

// ===============================
// GET SETTINGS
// ===============================

export const getStoreSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const settings = await getSettings();

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error("Get settings error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Error fetching settings",
    });
  }
};

// ===============================
// UPDATE SETTINGS
// ===============================

export const updateStoreSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      storeName,
      phone,
      address,
      currency,
      tax,
      receiptFooter,
    } = req.body;

    // Validation
    if (!storeName || !storeName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Store name is required",
      });
    }

    if (!currency || !currency.trim()) {
      return res.status(400).json({
        success: false,
        message: "Currency is required",
      });
    }

    if (
      typeof tax !== "number" ||
      !Number.isFinite(tax) ||
      tax < 0 ||
      tax > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Tax must be a number between 0 and 100",
      });
    }

    const settings = await updateSettings(
      storeName.trim(),
      phone?.trim() || "",
      address?.trim() || "",
      currency.trim(),
      tax,
      receiptFooter?.trim() || ""
    );

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error: any) {
    console.error("Update settings error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Error updating settings",
    });
  }
};