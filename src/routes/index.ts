import { Router } from 'express';

import { authRoutes } from '../modules/auth/index.js';
import { profileRoutes } from '../modules/profile/index.js';
import { mediaRouter } from '../modules/media/index.js';
import { sendSuccess } from '../shared/responses/index.js';

const router = Router();

router.get('/health', (_req, res) => {
  sendSuccess(res, 'Portfolio CMS API is running.', {
    status: 'healthy',
  });
});

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/media', mediaRouter);

export default router;
