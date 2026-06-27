import { Router } from 'express';

import { authenticate, validate } from '../../shared/middleware/index.js';
import * as profileController from './profile.controller.js';
import { createProfileSchema, updateProfileSchema } from './profile.schema.js';

export const profileRoutes = Router();

profileRoutes.use(authenticate);

profileRoutes.post(
  '/',
  validate(createProfileSchema),
  profileController.createProfileHandler,
);

profileRoutes.get(
  '/',
  profileController.getProfileHandler,
);

profileRoutes.put(
  '/',
  validate(updateProfileSchema),
  profileController.updateProfileHandler,
);
