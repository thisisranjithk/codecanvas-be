import type { Response } from 'express';
import { env } from '../../config/env.js';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export function setRefreshTokenCookie(res: Response, token: string): void {
  const expiresInMs = parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN);

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    domain: env.COOKIE_DOMAIN || undefined,
    maxAge: expiresInMs,
    path: '/',
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    domain: env.COOKIE_DOMAIN || undefined,
    path: '/',
  });
}

function parseDurationToMs(duration: string): number {
  // Very basic parser for durations like "7d", "15m", "24h"
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days

  const value = parseInt(match[1] as string, 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}
