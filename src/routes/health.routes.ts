import { Router, Request, Response } from 'express';

const router = Router();

// Some health check route
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'OK' });
});

export default router; 