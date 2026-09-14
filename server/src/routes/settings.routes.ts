import {Router} from 'express';
import { getStoreSettings, updateStoreSettings } from '../controllers/settings.controller';
import { authorize } from '../middleware/role.middleware';
import { authenticate } from '../middleware/Authentication Middleware';


   

const router = Router();
router.get('/',authenticate,authorize("ADMIN"), getStoreSettings);
router.put('/', authenticate,authorize("ADMIN"), updateStoreSettings);



export default router;

