import type { Request, Response } from 'express';

import { UnauthorizedError } from '../../shared/errors/index.js';
import { sendCreated, sendSuccess } from '../../shared/responses/index.js';
import { asyncHandler } from '../../shared/utils/index.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';
import { authService } from './auth.service.js';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const input = req.body as RegisterInput;
    const user = await authService.register(input);

    sendCreated(res, 'User registered successfully.', { user });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const input = req.body as LoginInput;
    const result = await authService.login(input);

    sendSuccess(res, 'Login successful.', result);
  }),

  getCurrentUser: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized.');
    }

    const user = await authService.getCurrentUser(req.user.id);

    sendSuccess(res, 'User profile fetched successfully.', { user });
  }),
};
