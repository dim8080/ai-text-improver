import express from 'express';
import MainController from '../core/main.controller';
const MainControllerInstance = new MainController();

const router = express.Router();
router.get('/improve', MainControllerInstance.improveText);
router.get('/status/:jobId', MainControllerInstance.getJobStatus);
router.get('/history', MainControllerInstance.getHistory);

export default router;