import { Router } from 'express';
import { authenticate } from '../../shared/middleware/index.js';
import * as dashboardController from './dashboard.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', dashboardController.getDashboardHandler);

export default router;
