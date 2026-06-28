import type { Request, Response } from 'express';

import { asyncHandler } from '../../shared/utils/index.js';
import { sendSuccess } from '../../shared/responses/index.js';
import * as blogService from './blog.service.js';
import type {
  CreateBlogInput,
  UpdateBlogInput,
  ListBlogsQueryInput,
} from './blog.schema.js';

export const createBlogHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const blog = await blogService.createBlog(userId, req.body as CreateBlogInput);
    sendSuccess(res, 'Blog created successfully', blog, 201);
  }
);

export const getBlogsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await blogService.getBlogs(userId, req.query as unknown as ListBlogsQueryInput);
    sendSuccess(res, 'Blogs retrieved successfully', result);
  }
);

export const getBlogHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const blog = await blogService.getBlogById(userId, id as string);
    sendSuccess(res, 'Blog retrieved successfully', blog);
  }
);

export const updateBlogHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const blog = await blogService.updateBlog(
      userId,
      id as string,
      req.body as UpdateBlogInput
    );
    sendSuccess(res, 'Blog updated successfully', blog);
  }
);

export const deleteBlogHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    await blogService.deleteBlog(userId, id as string);
    sendSuccess(res, 'Blog deleted successfully', null, 204);
  }
);
