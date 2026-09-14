import {Router} from "express";
import { create, getAll, remove, update } from "../controllers/category-controller";
import { authenticate } from "../middleware/Authentication Middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post("/", authenticate, authorize("ADMIN"), create);
router.get("/", authenticate, authorize("ADMIN", "CASHIER"), getAll);
router.put("/:id", authenticate, authorize("ADMIN"), update);
router.delete("/:id", authenticate, authorize("ADMIN"), remove);

export default router;