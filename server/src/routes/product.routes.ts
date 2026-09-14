import {Router} from 'express';
import { create, getAllProduct, getById, removeProduct, update,   } from '../controllers/product.controller';
import { authenticate } from '../middleware/Authentication Middleware';
import { authorize } from '../middleware/role.middleware';




const router = Router();
router.post('/' ,authenticate,authorize("ADMIN"), create);
router.get('/', authenticate,  getAllProduct);
router.get('/:id', authenticate, getById);
router.put('/:id', authenticate, authorize("ADMIN"), update);
router.delete('/:id', authenticate, authorize("ADMIN"), removeProduct);

export default router;