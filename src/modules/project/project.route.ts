import { Router } from 'express';

import { authenticate, validate } from '../../shared/middleware/index.js';
import * as projectController from './project.controller.js';
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectSchema,
  deleteProjectSchema,
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
  validate(listProjectsQuerySchema),
  projectController.getProjectsHandler
);

projectRoutes.get(
  '/:id',
  validate(getProjectSchema),
  projectController.getProjectHandler
);

projectRoutes.put(
  '/:id',
  validate(updateProjectSchema),
  projectController.updateProjectHandler
);

projectRoutes.delete(
  '/:id',
  validate(deleteProjectSchema),
  projectController.deleteProjectHandler
);
