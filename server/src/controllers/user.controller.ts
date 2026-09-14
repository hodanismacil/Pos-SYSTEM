import { Request, Response } from "express";

import {
  getAllUsers,
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
} from "../services/user.service";


// =========================
// GET ALL USERS
// =========================

export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching users",
    });
  }
};


// =========================
// REGISTER / CREATE USER
// =========================

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    const user = await registerUser(
      name,
      email,
      password,
      role
    );

    res.status(201).json({
      success: true,
      data: user,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// LOGIN
// =========================

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const result = await loginUser(
      email,
      password
    );

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// PROFILE
// =========================

export const profile = async (
  req: Request,
  res: Response
) => {

  res.status(200).json({
    success: true,
    user: (req as any).user,
  });

};


// =========================
// UPDATE USER
// =========================

export const editUser = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params;

    const {
      name,
      email,
      role,
    } = req.body;

    const updatedUser = await updateUser(
      Number(id),
      name,
      email,
      role
    );

    res.status(200).json({
      success: true,
      data: updatedUser,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};


// =========================
// DELETE USER
// =========================

export const removeUser = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params;

    const result = await deleteUser(
      Number(id)
    );

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};