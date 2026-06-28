import { Router } from 'express';

import { authenticate, validate } from '../../shared/middleware/index.js';
import * as educationController from './education.controller.js';
import {
  createEducationSchema,
  updateEducationSchema,
  educationIdParamSchema,
} from './education.schema.js';

export const educationRoutes = Router();

// All education routes are protected
educationRoutes.use(authenticate);

educationRoutes.post(
  '/',
  validate(createEducationSchema),
  educationController.createEducationHandler
);

educationRoutes.get(
  '/',
  educationController.getEducationsHandler
);

educationRoutes.get(
  '/:id',
  validate(educationIdParamSchema, 'params'),
  educationController.getEducationHandler
);

educationRoutes.put(
  '/:id',
  validate(educationIdParamSchema, 'params'),
  validate(updateEducationSchema, 'body'),
  educationController.updateEducationHandler
);

educationRoutes.delete(
  '/:id',
  validate(educationIdParamSchema, 'params'),
  educationController.deleteEducationHandler
);
