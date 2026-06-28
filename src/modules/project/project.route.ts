import { Router } from 'express';

import { authenticate, validate } from '../../shared/middleware/index.js';
import * as projectController from './project.controller.js';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
  listProjectsQuerySchema,
} from './project.schema.js';

export const projectRoutes = Router();

// All project routes are protected
projectRoutes.use(authenticate);

projectRoutes.post(
  '/',
  validate(createProjectSchema),
  projectController.createProjectHandler
);

projectRoutes.get(
  '/',
  validate(listProjectsQuerySchema, 'query'),
  projectController.getProjectsHandler
);

projectRoutes.get(
  '/:id',
  validate(projectIdParamSchema, 'params'),
  projectController.getProjectHandler
);

projectRoutes.put(
  '/:id',
  validate(projectIdParamSchema, 'params'),
  validate(updateProjectSchema, 'body'),
  projectController.updateProjectHandler
);

projectRoutes.delete(
  '/:id',
  validate(projectIdParamSchema, 'params'),
  projectController.deleteProjectHandler
);
