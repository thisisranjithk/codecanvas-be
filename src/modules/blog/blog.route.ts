import { Router } from 'express';

import { authenticate, validate } from '../../shared/middleware/index.js';
import * as blogController from './blog.controller.js';
import {
  createBlogSchema,
  updateBlogSchema,
  blogIdParamSchema,
  listBlogsQuerySchema,
} from './blog.schema.js';

export const blogRoutes = Router();

// All blog routes are protected
blogRoutes.use(authenticate);

blogRoutes.post(
  '/',
  validate(createBlogSchema),
  blogController.createBlogHandler
);

blogRoutes.get(
  '/',
  validate(listBlogsQuerySchema, 'query'),
  blogController.getBlogsHandler
);

blogRoutes.get(
  '/:id',
  validate(blogIdParamSchema, 'params'),
  blogController.getBlogHandler
);

blogRoutes.put(
  '/:id',
  validate(blogIdParamSchema, 'params'),
  validate(updateBlogSchema, 'body'),
  blogController.updateBlogHandler
);

blogRoutes.delete(
  '/:id',
  validate(blogIdParamSchema, 'params'),
  blogController.deleteBlogHandler
);
