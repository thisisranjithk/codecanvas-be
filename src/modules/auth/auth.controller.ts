import type { Request, Response } from 'express';

import { UnauthorizedError } from '../../shared/errors/index.js';
import { sendCreated, sendSuccess } from '../../shared/responses/index.js';
import { asyncHandler } from '../../shared/utils/index.js';
import type { LoginInput, RegisterInput, ChangePasswordInput, DeleteAccountInput } from './auth.schema.js';
import * as authService from './auth.service.js';
import { deleteAccount } from './services/account-deletion.service.js';

export const registerHandler = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;
  const user = await authService.register(input);

  sendCreated(res, 'User registered successfully.', { user });
});

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as LoginInput;
  const result = await authService.login(input);

  sendSuccess(res, 'Login successful.', result);
});

export const getCurrentUserHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized.');
  }

  const user = await authService.getCurrentUser(req.user.id);

  sendSuccess(res, 'User profile fetched successfully.', { user });
});

export const changePasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized.');
  }

  const input = req.body as ChangePasswordInput;
  await authService.changePassword(req.user.id, input);

  sendSuccess(res, 'Password changed successfully.', null);
});

export const deleteAccountHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized.');
  }

  const input = req.body as DeleteAccountInput;
  await authService.verifyPassword(req.user.id, input.password);

  await deleteAccount(req.user.id);

  sendSuccess(res, 'Account deleted successfully.', null);
});
