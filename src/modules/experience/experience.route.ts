import { Router } from 'express';

import { authenticate, validate } from '../../shared/middleware/index.js';
import * as experienceController from './experience.controller.js';
import {
  createExperienceSchema,
  updateExperienceSchema,
  experienceIdParamSchema,
} from './experience.schema.js';

export const experienceRoutes = Router();

// All experience routes are protected
experienceRoutes.use(authenticate);

experienceRoutes.post(
  '/',
  validate(createExperienceSchema),
  experienceController.createExperienceHandler
);

experienceRoutes.get(
  '/',
  experienceController.getExperiencesHandler
);

experienceRoutes.get(
  '/:id',
  validate(experienceIdParamSchema, 'params'),
  experienceController.getExperienceHandler
);

experienceRoutes.put(
  '/:id',
  validate(experienceIdParamSchema, 'params'),
  validate(updateExperienceSchema, 'body'),
  experienceController.updateExperienceHandler
);

experienceRoutes.delete(
  '/:id',
  validate(experienceIdParamSchema, 'params'),
  experienceController.deleteExperienceHandler
);
