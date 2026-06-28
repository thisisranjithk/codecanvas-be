import { z } from 'zod';
import { paginationQuerySchema } from '../../shared/utils/query-builder.js';

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  coverMediaId: z.string().optional(),
  readTime: z.number().int().nonnegative().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  featured: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const blogIdParamSchema = z.object({
  id: z.string().min(1, 'Blog ID is required'),
});

export const listBlogsQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  featured: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  sortBy: z.enum(['createdAt', 'publishedAt', 'title']).optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type ListBlogsQueryInput = z.infer<typeof listBlogsQuerySchema>;
