import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env, prisma } from '../../config/index.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../shared/errors/index.js';
import type { PublicUser } from '../../shared/types/index.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

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

function signAccessToken(user: Pick<PublicUser, 'id' | 'email' | 'role'>): string {
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

export const authService = {
  async register(input: RegisterInput): Promise<PublicUser> {
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
  },

  async login(input: LoginInput): Promise<{ user: PublicUser; accessToken: string }> {
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

    return {
      user: publicUser,
      accessToken: signAccessToken(publicUser),
    };
  },

  async getCurrentUser(userId: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userPublicSelect,
    });

    if (!user || !user.isActive) {
      throw new NotFoundError('User not found.');
    }

    return user;
  },
};
