import { Router } from 'express';

import { authRoutes } from '../modules/auth/index.js';
import { profileRoutes } from '../modules/profile/index.js';
import { mediaRouter } from '../modules/media/index.js';
import { projectRoutes } from '../modules/project/index.js';
import { skillRoutes } from '../modules/skill/index.js';
import { categoryRoutes } from '../modules/category/index.js';
import { experienceRoutes } from '../modules/experience/index.js';
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
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/categories', categoryRoutes);
router.use('/experiences', experienceRoutes);

export default router;
