import type { Request, Response } from 'express';

import { UnauthorizedError } from '../../shared/errors/index.js';
import { sendCreated, sendSuccess } from '../../shared/responses/index.js';
import { asyncHandler, setRefreshTokenCookie, clearRefreshTokenCookie, verifyRefreshToken } from '../../shared/utils/index.js';
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
  const { user, accessToken, refreshToken } = await authService.login(input);

  setRefreshTokenCookie(res, refreshToken);

  sendSuccess(res, 'Login successful.', { user, accessToken });
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

  clearRefreshTokenCookie(res);

  sendSuccess(res, 'Password changed successfully.', null);
});

export const deleteAccountHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized.');
  }

  const input = req.body as DeleteAccountInput;
  await authService.verifyPassword(req.user.id, input.password);

  await deleteAccount(req.user.id);

  clearRefreshTokenCookie(res);

  sendSuccess(res, 'Account deleted successfully.', null);
});

export const refreshHandler = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;

  if (!token) {
    throw new UnauthorizedError('Refresh token is required.');
  }

  const { accessToken, refreshToken } = await authService.refresh(token);

  setRefreshTokenCookie(res, refreshToken);

  sendSuccess(res, 'Token refreshed successfully.', { accessToken });
});

export const logoutHandler = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;

  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await authService.logout(payload.sub);
    } catch (_error) {
    }
  }

  clearRefreshTokenCookie(res);
  sendSuccess(res, 'Logged out successfully.', null);
});
