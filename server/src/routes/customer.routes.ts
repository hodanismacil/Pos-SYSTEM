
import  { Router} from 'express';
import { create, getAll, getById, remove, update } from '../controllers/customer.controller';
import { authenticate } from '../middleware/Authentication Middleware';
import { authorize } from '../middleware/role.middleware';




const router = Router();
router.post('/', authenticate ,authorize("ADMIN") ,create);
router.get('/', authenticate, authorize("ADMIN"), getAll);
router.get('/:id', authenticate, authorize("ADMIN"), getById);
router.put('/:id', authenticate, authorize("ADMIN"), update);
router.delete('/:id', authenticate, authorize("ADMIN") , remove);
export default router
