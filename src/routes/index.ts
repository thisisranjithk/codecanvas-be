import { Router } from 'express';

import { sendSuccess } from '../shared/responses/api-response.js';

const router = Router();

router.get('/health', (_req, res) => {
  sendSuccess(res, 'Portfolio CMS API is running.', {
    status: 'healthy',
  });
});

export default router;
