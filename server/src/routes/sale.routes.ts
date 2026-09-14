import {Router } from 'express';
import { create, exportSales, getAllSales, getsaleById, vodSalec } from '../controllers/sale.controller';
import { authenticate } from '../middleware/Authentication Middleware';
import { authorize } from '../middleware/role.middleware';







const router = Router();

router.post('/',authenticate,authorize("ADMIN"), create);
router.get('/',authenticate,authorize("ADMIN"), getAllSales);
router.get('/:id',authenticate,authorize("ADMIN"), getsaleById);
router.delete('/:id',authenticate,authorize("ADMIN"), vodSalec);
router.get('/export',authenticate,authorize("ADMIN"), exportSales);

export default router;