import { Router } from 'express';

import { authRoutes } from '../modules/auth/index.js';
import { sendSuccess } from '../shared/responses/index.js';

const router = Router();

router.get('/health', (_req, res) => {
  sendSuccess(res, 'Portfolio CMS API is running.', {
    status: 'healthy',
  });
});

router.use('/auth', authRoutes);

export default router;
