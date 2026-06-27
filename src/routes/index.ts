import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio CMS API is running.',
    data: {
      status: 'healthy',
    },
  });
});

export default router;
