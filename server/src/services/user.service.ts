import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

// =========================
// GET ALL USERS
// =========================
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

// =========================
// GET USER BY ID
// =========================
export const getUserById = async (id: number) => {
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// =========================
// REGISTER / CREATE USER
// =========================
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role?: Role // Role waa optional, maadaama uu leeyahay default
) => {
  // Validation
  if (!name?.trim()) {
    throw new Error("Name is required");
  }

  if (!email?.trim()) {
    throw new Error("Email is required");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email.trim(),
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Default role-ku wuxuu noqonayaa USER haddii aan la soo dirin Role gaar ah
  const userRole = role || Role.USER; 

  // Create user
  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: userRole,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

// =========================
// LOGIN
// =========================
export const loginUser = async (email: string, password: string) => {
  if (!email?.trim() || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.trim(),
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // JWT Token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  // Password ha dirin
  const { password: _password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

// =========================
// UPDATE USER
// =========================
export const updateUser = async (
  id: number,
  name: string,
  email: string,
  role?: Role
) => {
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID");
  }

  if (!name?.trim()) {
    throw new Error("Name is required");
  }

  if (!email?.trim()) {
    throw new Error("Email is required");
  }

  // Hubi user-ka
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  // Hubi email-ka inuusan user kale isticmaalin
  const emailUser = await prisma.user.findFirst({
    where: {
      email: email.trim(),
      NOT: {
        id: userId,
      },
    },
  });

  if (emailUser) {
    throw new Error("Email already exists");
  }

  // Update
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: name.trim(),
      email: email.trim(),
      ...(role && { role }), // Badal role-ka oo kaliya haddii cusub la soo diro
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// =========================
// DELETE USER
// =========================
export const deleteUser = async (id: number) => {
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return {
    message: "User deleted successfully",
  };
};


