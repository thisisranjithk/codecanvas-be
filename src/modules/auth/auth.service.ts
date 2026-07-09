import bcrypt from 'bcrypt';

import { env, prisma } from '../../config/index.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../shared/errors/index.js';
import type { PublicUser } from '../../shared/types/index.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../shared/utils/index.js';
import type { LoginInput, RegisterInput, ChangePasswordInput } from './auth.schema.js';

const BCRYPT_SALT_ROUNDS = 12;

const userPublicSelect = {
  id: true,
  fullName: true,
  username: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;



export async function register(input: RegisterInput): Promise<PublicUser> {
    const existingEmail = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingEmail) {
      throw new ConflictError('A user with this email already exists.');
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: input.username },
    });

    if (existingUsername) {
      throw new ConflictError('A user with this username already exists.');
    }

    const hashedPassword = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

    return prisma.user.create({
      data: {
        fullName: input.fullName,
        username: input.username,
        email: input.email,
        password: hashedPassword,
      },
      select: userPublicSelect,
    });
  }

export async function login(input: LoginInput): Promise<{ user: PublicUser; accessToken: string; refreshToken: string }> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const publicUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: userPublicSelect,
    });

    if (!publicUser) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const accessToken = generateAccessToken(publicUser);
    const refreshToken = generateRefreshToken(user.id);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, BCRYPT_SALT_ROUNDS);
    
    const match = env.JWT_REFRESH_EXPIRES_IN.match(/^(\d+)([smhd])$/);
    let ms = 7 * 24 * 60 * 60 * 1000;
    if (match) {
      const val = parseInt(match[1] as string, 10);
      if (match[2] === 's') ms = val * 1000;
      if (match[2] === 'm') ms = val * 60 * 1000;
      if (match[2] === 'h') ms = val * 60 * 60 * 1000;
      if (match[2] === 'd') ms = val * 24 * 60 * 60 * 1000;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: hashedRefreshToken,
        refreshTokenExpiresAt: new Date(Date.now() + ms),
      },
    });

    return {
      user: publicUser,
      accessToken,
      refreshToken,
    };
  }

export async function getCurrentUser(userId: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userPublicSelect,
    });

    if (!user || !user.isActive) {
      throw new NotFoundError('User not found.');
    }

    return user;
  }

export async function changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new NotFoundError('User not found.');
    }

    const isPasswordValid = await bcrypt.compare(input.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid current password.');
    }

    const isSamePassword = await bcrypt.compare(input.newPassword, user.password);
    if (isSamePassword) {
      throw new ConflictError('New password must be different from current password.');
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, BCRYPT_SALT_ROUNDS);

    await prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedPassword,
        refreshToken: null,
        refreshTokenExpiresAt: null,
      },
    });
  }

export async function verifyPassword(userId: string, password: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new NotFoundError('User not found.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid password.');
    }
  }

export async function refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    const payload = verifyRefreshToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive || !user.refreshToken) {
      throw new UnauthorizedError('Invalid refresh token.');
    }

    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired.');
    }

    const isValid = await bcrypt.compare(token, user.refreshToken as string);
    if (!isValid) {
      throw new UnauthorizedError('Invalid refresh token.');
    }

    const publicUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: userPublicSelect,
    });

    if (!publicUser) {
      throw new UnauthorizedError('User not found.');
    }

    const accessToken = generateAccessToken(publicUser);
    const refreshToken = generateRefreshToken(user.id);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, BCRYPT_SALT_ROUNDS);
    
    const match = env.JWT_REFRESH_EXPIRES_IN.match(/^(\d+)([smhd])$/);
    let ms = 7 * 24 * 60 * 60 * 1000;
    if (match) {
      const val = parseInt(match[1] as string, 10);
      if (match[2] === 's') ms = val * 1000;
      if (match[2] === 'm') ms = val * 60 * 1000;
      if (match[2] === 'h') ms = val * 60 * 60 * 1000;
      if (match[2] === 'd') ms = val * 24 * 60 * 60 * 1000;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: hashedRefreshToken,
        refreshTokenExpiresAt: new Date(Date.now() + ms),
      },
    });

    return { accessToken, refreshToken };
  } catch (_error) {
    throw new UnauthorizedError('Invalid or expired refresh token.');
  }
}

export async function logout(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshToken: null,
      refreshTokenExpiresAt: null,
    },
  });
}
