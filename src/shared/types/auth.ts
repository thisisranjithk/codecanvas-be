import type { UserRole } from '@prisma/client';

export type JwtUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type PublicUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
