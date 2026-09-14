import { Router } from "express";
import { createPurchaseController, deletePurchaseController, getAllPurchasesController, getPurchaseByIdController, updatePurchaseController } from "../controllers/purchase.controller";
import { authenticate} from "../middleware/Authentication Middleware";
import { authorize } from "../middleware/role.middleware";


const router = Router();
router.get("/", authenticate,authorize ("ADMIN", "CASHIER"), getAllPurchasesController);
router.get("/:id", authenticate, authorize("ADMIN", "CASHIER"), getPurchaseByIdController);

// 2. CREATE, UPDATE & DELETE (Admin KALIYA ayaa la tacaali kara Supplier/Purchases)
router.post("/", authenticate, authorize("ADMIN"), createPurchaseController);
router.put("/:id", authenticate, authorize("ADMIN"), updatePurchaseController);
router.delete("/:id", authenticate, authorize("ADMIN"), deletePurchaseController);

export default router;