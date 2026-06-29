import type { Prisma } from '@prisma/client';

import { prisma } from '../../config/database.js';
import { ConflictError, NotFoundError } from '../../shared/errors/index.js';
import type { CreateProfileInput, UpdateProfileInput, UpdatePortfolioSettingsInput } from './profile.schema.js';

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
    include: { user: { select: { username: true } } },
  });

  let avatarUrl: string | null = null;
  if (profile.avatar) {
    const media = await prisma.media.findUnique({
      where: { id: profile.avatar },
    });
    if (media) {
      avatarUrl = media.secureUrl;
    }
  }

  const { user, ...profileData } = profile;

  return {
    ...profileData,
    username: user.username,
    avatarUrl,
  };
}

export async function getProfileByUserId(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { user: { select: { username: true } } },
  });

  if (!profile) {
    throw new NotFoundError('Profile not found.');
  }

  let avatarUrl: string | null = null;
  if (profile.avatar) {
    const media = await prisma.media.findUnique({
      where: { id: profile.avatar },
    });
    if (media) {
      avatarUrl = media.secureUrl;
    }
  }

  const { user, ...profileData } = profile;

  return {
    ...profileData,
    username: user.username,
    avatarUrl,
  };
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
    include: { user: { select: { username: true } } },
  });

  let avatarUrl: string | null = null;
  if (updatedProfile.avatar) {
    const media = await prisma.media.findUnique({
      where: { id: updatedProfile.avatar },
    });
    if (media) {
      avatarUrl = media.secureUrl;
    }
  }

  const { user, ...profileData } = updatedProfile;

  return {
    ...profileData,
    username: user.username,
    avatarUrl,
  };
}

export async function getPortfolioSettings(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { portfolioVisibility: true, showEmail: true, openToWork: true },
  });

  if (!profile) {
    throw new NotFoundError('Profile not found.');
  }

  return profile;
}

export async function updatePortfolioSettings(userId: string, data: UpdatePortfolioSettingsInput) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new NotFoundError('Profile not found.');
  }

  const updatedProfile = await prisma.profile.update({
    where: { userId },
    data: data as Prisma.ProfileUncheckedUpdateInput,
    select: { portfolioVisibility: true, showEmail: true, openToWork: true },
  });

  return updatedProfile;
}
