import { Router } from 'express';

import { authenticate, authorize, validate } from '../../shared/middleware/index.js';
import * as categoryController from './category.controller.js';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
  getCategoryDropdownSchema,
} from './category.schema.js';

export const categoryRoutes = Router();

// Let's assume all category APIs are protected.
categoryRoutes.use(authenticate);

categoryRoutes.get(
  '/dropdown',
  validate(getCategoryDropdownSchema, 'query'),
  categoryController.getCategoryDropdownHandler
);

categoryRoutes.post(
  '/',
  authorize('ADMIN'),
  validate(createCategorySchema),
  categoryController.createCategoryHandler
);

categoryRoutes.get(
  '/',
  categoryController.getCategoriesHandler
);

categoryRoutes.get(
  '/:id',
  validate(categoryIdParamSchema, 'params'),
  categoryController.getCategoryByIdHandler
);

categoryRoutes.put(
  '/:id',
  authorize('ADMIN'),
  validate(categoryIdParamSchema, 'params'),
  validate(updateCategorySchema, 'body'),
  categoryController.updateCategoryHandler
);

categoryRoutes.delete(
  '/:id',
  authorize('ADMIN'),
  validate(categoryIdParamSchema, 'params'),
  categoryController.deleteCategoryHandler
);
