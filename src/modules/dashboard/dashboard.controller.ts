import type { Request, Response } from 'express';
import { UnauthorizedError } from '../../shared/errors/index.js';
import { sendSuccess } from '../../shared/responses/index.js';
import { asyncHandler } from '../../shared/utils/index.js';
import * as dashboardService from './dashboard.service.js';

export const getDashboardHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized.');
  }

  const dashboardData = await dashboardService.getDashboardData(req.user.id);

  sendSuccess(res, 'Dashboard data fetched successfully.', dashboardData);
});
