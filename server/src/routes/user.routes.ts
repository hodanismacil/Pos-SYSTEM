import { Router } from "express";
import {
  getUsers,
  login,
  profile,
  register,
  editUser,
  removeUser,
} from "../controllers/user.controller";

// Hubi magaca faylka middleware-ka inuu san spase lahayn

import { authorize } from "../middleware/role.middleware";
import { authenticate } from "../middleware/Authentication Middleware";

const router = Router();

// =========================
// PUBLIC ROUTES
// =========================

// Public user registration (Website customers)
router.post("/register", register);

// Login (All roles: ADMIN, CASHIER, USER)
router.post("/login", login);

// =========================
// PROTECTED USER ROUTES
// =========================

// Get logged-in user profile
router.get("/profile", authenticate, profile);

// =========================
// ADMIN ONLY ROUTES
// =========================

// Get all users
router.get("/", authenticate, authorize("ADMIN"), getUsers);

// Admin creates staff/cashier directly
router.post("/", authenticate, authorize("ADMIN"), register);

// Edit user
router.put("/:id", authenticate, authorize("ADMIN"), editUser);

// Delete user
router.delete("/:id", authenticate, authorize("ADMIN"), removeUser);

export default router;