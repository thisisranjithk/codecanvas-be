import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const projectStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255).openapi({ example: 'My Awesome Project' }),
    description: z.string().min(10).openapi({ example: 'A comprehensive project describing my skills.' }),
    category: z.string().min(2).openapi({ example: 'Web Development' }),
    status: projectStatusEnum.optional().default('DRAFT').openapi({ example: 'PUBLISHED' }),
    technologies: z.array(z.string()).min(1).openapi({ example: ['React', 'Node.js', 'Prisma'] }),
    liveUrl: z.string().url().optional().openapi({ example: 'https://myproject.com' }),
    githubUrl: z.string().url().optional().openapi({ example: 'https://github.com/myuser/myproject' }),
    featured: z.boolean().optional().default(false).openapi({ example: true }),
    thumbnailMediaId: z.string().cuid().optional().openapi({ example: 'cuid-12345' }),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().cuid().openapi({ example: 'cuid-12345' }),
  }),
  body: z.object({
    title: z.string().min(3).max(255).optional().openapi({ example: 'My Awesome Project' }),
    description: z.string().min(10).optional().openapi({ example: 'A comprehensive project describing my skills.' }),
    category: z.string().min(2).optional().openapi({ example: 'Web Development' }),
    status: projectStatusEnum.optional().openapi({ example: 'PUBLISHED' }),
    technologies: z.array(z.string()).min(1).optional().openapi({ example: ['React', 'Node.js', 'Prisma'] }),
    liveUrl: z.string().url().optional().openapi({ example: 'https://myproject.com' }),
    githubUrl: z.string().url().optional().openapi({ example: 'https://github.com/myuser/myproject' }),
    featured: z.boolean().optional().openapi({ example: true }),
    thumbnailMediaId: z.string().cuid().optional().openapi({ example: 'cuid-12345' }),
  }),
});

export const getProjectSchema = z.object({
  params: z.object({
    id: z.string().cuid().openapi({ example: 'cuid-12345' }),
  }),
});

export const deleteProjectSchema = z.object({
  params: z.object({
    id: z.string().cuid().openapi({ example: 'cuid-12345' }),
  }),
});

export const listProjectsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).optional().default(1).openapi({ example: 1 }),
    limit: z.coerce.number().min(1).max(100).optional().default(10).openapi({ example: 10 }),
    search: z.string().optional().openapi({ example: 'Awesome' }),
    sortBy: z.string().optional().default('createdAt').openapi({ example: 'createdAt' }),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc').openapi({ example: 'desc' }),
    category: z.string().optional().openapi({ example: 'Web Development' }),
    status: projectStatusEnum.optional().openapi({ example: 'PUBLISHED' }),
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];
export type ListProjectsQueryInput = z.infer<typeof listProjectsQuerySchema>['query'];
