import { Router } from 'express';
import healthRoutes from './health.routes';
import mainRoutes from './main.routes';
// Main routes here...
const router = Router();
router.use('/', mainRoutes);
router.use('/health', healthRoutes);
 
export default router;
