import { Router, Request, Response } from 'express';

const router = Router();

// Not found route
router.all('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

export default router; 