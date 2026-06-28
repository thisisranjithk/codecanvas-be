import { Router } from 'express';

import { authenticate, validate } from '../../shared/middleware/index.js';
import * as skillController from './skill.controller.js';
import {
  createSkillSchema,
  updateSkillSchema,
  skillIdParamSchema,
} from './skill.schema.js';

export const skillRoutes = Router();

// All skill routes are protected
skillRoutes.use(authenticate);

skillRoutes.post(
  '/',
  validate(createSkillSchema),
  skillController.createSkillHandler
);

skillRoutes.get(
  '/',
  skillController.getSkillsHandler
);

skillRoutes.get(
  '/:id',
  validate(skillIdParamSchema, 'params'),
  skillController.getSkillHandler
);

skillRoutes.put(
  '/:id',
  validate(skillIdParamSchema, 'params'),
  validate(updateSkillSchema, 'body'),
  skillController.updateSkillHandler
);

skillRoutes.delete(
  '/:id',
  validate(skillIdParamSchema, 'params'),
  skillController.deleteSkillHandler
);
