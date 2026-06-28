import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const projectStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

export const createProjectSchema = z.object({
  title: z.string().min(3).max(255).openapi({ example: 'My Awesome Project' }),
  description: z.string().min(10).openapi({ example: 'A comprehensive project describing my skills.' }),
  categoryId: z.string().cuid('Invalid category ID').openapi({ example: 'ckz1234567890' }),
  status: projectStatusEnum.optional().default('DRAFT').openapi({ example: 'PUBLISHED' }),
  technologies: z.array(z.string()).min(1).openapi({ example: ['React', 'Node.js', 'Prisma'] }),
  liveUrl: z.union([z.string().url(), z.literal('')]).nullish().openapi({ example: 'https://myproject.com' }),
  githubUrl: z.union([z.string().url(), z.literal('')]).nullish().openapi({ example: 'https://github.com/myuser/myproject' }),
  featured: z.boolean().optional().default(false).openapi({ example: true }),
  thumbnailMediaId: z.string().nullish().or(z.literal('')),
});

export const updateProjectSchema = z.object({
  title: z.string().min(3).max(255).optional().openapi({ example: 'My Awesome Project' }),
  description: z.string().min(10).optional().openapi({ example: 'A comprehensive project describing my skills.' }),
  categoryId: z.string().cuid('Invalid category ID').optional().openapi({ example: 'ckz1234567890' }),
  status: projectStatusEnum.optional().openapi({ example: 'PUBLISHED' }),
  technologies: z.array(z.string()).min(1).optional().openapi({ example: ['React', 'Node.js', 'Prisma'] }),
  liveUrl: z.union([z.string().url(), z.literal('')]).nullish().openapi({ example: 'https://myproject.com' }),
  githubUrl: z.union([z.string().url(), z.literal('')]).nullish().openapi({ example: 'https://github.com/myuser/myproject' }),
  featured: z.boolean().optional(),
  thumbnailMediaId: z.string().nullish().or(z.literal('')),
});

export const projectIdParamSchema = z.object({
  id: z.string(),
});

export const listProjectsQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1).openapi({ example: 1 }),
  limit: z.coerce.number().min(1).max(100).optional().default(10).openapi({ example: 10 }),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc').openapi({ example: 'desc' }),
  categoryId: z.string().optional(),
  status: projectStatusEnum.optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ListProjectsQueryInput = z.infer<typeof listProjectsQuerySchema>;
