import {Router} from "express";
import { getDashboard } from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/Authentication Middleware";
import { authorize } from "../middleware/role.middleware";


const router = Router();

router.get("/", authenticate, authorize('ADMIN'), getDashboard);

export default router;
