import {Router} from 'express';
import { getLowStockProductsController, getStockHistoryController, stockInController, stockOutController } from '../controllers/stock.controller';
import { authenticate } from '../middleware/Authentication Middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post("/in", authenticate, authorize("ADMIN"), stockInController);

router.post("/out", authenticate, authorize("ADMIN"), stockOutController);
router.get("/history", authenticate, authorize("ADMIN"), getStockHistoryController);
router.get("/low-stock", authenticate, authorize("ADMIN"), getLowStockProductsController);
export default router;