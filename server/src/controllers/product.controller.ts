import {Request, Response} from 'express';
import { createProduct, deleteProduct, getAllProducts,getProductById, updateProduct } from '../services/product-service';




export const create = async (req: Request, res: Response) => {
    try{
        const {
             name, sku,
             barcode,
             price,
              stock, 
              description, 
              imageUrl,
               categoryId 
            } = req.body;

        const product = await createProduct
        (name, sku, 
            barcode,
             price,
              stock,
               description,
                imageUrl,
                 categoryId);

     res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export const getById= async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductById(Number(id));
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      sku,
      barcode,
      price,
      stock,
      description,
      imageUrl,
      categoryId
    } = req.body;

    const product = await updateProduct(
      Number(id),
      name,
      sku,
      barcode,
      price,
      stock,
      description,
      imageUrl,
      categoryId
    );

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const removeProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteProduct(Number(id));

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
