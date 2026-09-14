import {Router} from "express";
import { createSupplierController, deleteSupplierController, getAllSuppliersController, getSupplierByIdController, updateSupplierController } from "../controllers/supplier.controller";
import { authenticate } from "../middleware/Authentication Middleware";
import { authorize } from "../middleware/role.middleware";




const router = Router();

router.post("/", authenticate, authorize("ADMIN"), createSupplierController);

router.put("/:id", authenticate, authorize("ADMIN"), updateSupplierController);

router.delete("/:id", authenticate, authorize("ADMIN"), deleteSupplierController);

router.get("/", authenticate, authorize("ADMIN", "CASHIER"), getAllSuppliersController);

router.get("/:id", authenticate, authorize("ADMIN", "CASHIER"), getSupplierByIdController);


export default router;