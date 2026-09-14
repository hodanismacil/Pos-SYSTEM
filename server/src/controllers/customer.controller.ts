import  {Request, Response} from 'express';
import { createCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from '../services/customer.service';



export const create = async (req: Request, res: Response) => {
  try {
    const { name, phoneNumber } = req.body;
    const customer = await createCustomer(name, phoneNumber);
    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const customers = await getAllCustomers();
    res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerById(Number(id));
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber } = req.body;
    const customer = await updateCustomer(Number(id), name, phoneNumber);
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await deleteCustomer(Number(id));
    res.status(200).json({
      success: true,
      message: "Customer deleted successfully"
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
