import type { Request, Response } from 'express';

import { sendSuccess } from '../../shared/responses/index.js';
import * as profileService from './profile.service.js';
import type { CreateProfileInput, UpdateProfileInput } from './profile.schema.js';

export async function createProfileHandler(req: Request, res: Response) {
  const userId = req.user!.id;
  const profileData = req.body as CreateProfileInput;

  const profile = await profileService.createProfile(userId, profileData);

  sendSuccess(res, 'Profile created successfully.', profile, 201);
}

export async function getProfileHandler(req: Request, res: Response) {
  const userId = req.user!.id;

  const profile = await profileService.getProfileByUserId(userId);

  sendSuccess(res, 'Profile retrieved successfully.', profile, 200);
}

export async function updateProfileHandler(req: Request, res: Response) {
  const userId = req.user!.id;
  const profileData = req.body as UpdateProfileInput;

  const profile = await profileService.updateProfile(userId, profileData);

  sendSuccess(res, 'Profile updated successfully.', profile, 200);
}
