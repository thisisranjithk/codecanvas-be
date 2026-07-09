import jwt from 'jsonwebtoken';
import type { PublicUser } from '../types/index.js';
import { env } from '../../config/env.js';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

export type RefreshTokenPayload = {
  sub: string;
};

export function generateAccessToken(user: Pick<PublicUser, 'id' | 'email' | 'role'>): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    } as jwt.SignOptions,
  );
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    {
      sub: userId,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as jwt.SignOptions,
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}
