import type { Prisma } from '@prisma/client';

import { prisma } from '../../config/database.js';
import { ConflictError, NotFoundError } from '../../shared/errors/index.js';
import type { CreateProfileInput, UpdateProfileInput } from './profile.schema.js';

export async function createProfile(userId: string, data: CreateProfileInput) {
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    throw new ConflictError('Profile already exists for this user.');
  }

  const createData = {
    ...data,
    userId,
  } as Prisma.ProfileUncheckedCreateInput;

  const profile = await prisma.profile.create({
    data: createData,
  });

  return profile;
}

export async function getProfileByUserId(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new NotFoundError('Profile not found.');
  }

  return profile;
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new NotFoundError('Profile not found.');
  }

  const updateData = data as Prisma.ProfileUncheckedUpdateInput;

  const updatedProfile = await prisma.profile.update({
    where: { userId },
    data: updateData,
  });

  return updatedProfile;
}
