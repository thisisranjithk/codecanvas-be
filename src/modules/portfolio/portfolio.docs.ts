import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  listProjectsQuerySchema,
  projectIdParamSchema,
} from '../project/project.schema.js';
import { listBlogsQuerySchema } from '../blog/blog.schema.js';

extendZodWithOpenApi(z);

const blogSlugParamSchema = z.object({
  slug: z.string().openapi({ example: 'my-first-blog' }),
});

const errorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: 'An error occurred' }),
});

const portfolioTag = 'Portfolio (Public API)';

export function registerPortfolioDocs(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/api/v1/portfolio',
    tags: [portfolioTag],
    summary: 'Get Portfolio Homepage',
    description: 'Retrieves aggregated portfolio data including profile, featured projects, skills, experiences, educations, certifications, and latest published blogs.',
    responses: {
      200: {
        description: 'Portfolio homepage data retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Portfolio data retrieved successfully' }),
              data: z.any(),
            }),
          },
        },
      },
      404: {
        description: 'Portfolio owner not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/portfolio/projects',
    tags: [portfolioTag],
    summary: 'Get Portfolio Projects',
    description: 'Retrieves a paginated list of published projects.',
    request: {
      query: listProjectsQuerySchema,
    },
    responses: {
      200: {
        description: 'Projects retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Projects retrieved successfully' }),
              data: z.any(),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/portfolio/projects/{id}',
    tags: [portfolioTag],
    summary: 'Get Portfolio Project by ID',
    description: 'Retrieves details of a specific published project.',
    request: {
      params: projectIdParamSchema,
    },
    responses: {
      200: {
        description: 'Project retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Project retrieved successfully' }),
              data: z.any(),
            }),
          },
        },
      },
      404: {
        description: 'Project not found or not published',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/portfolio/blogs',
    tags: [portfolioTag],
    summary: 'Get Portfolio Blogs',
    description: 'Retrieves a paginated list of published blogs.',
    request: {
      query: listBlogsQuerySchema,
    },
    responses: {
      200: {
        description: 'Blogs retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Blogs retrieved successfully' }),
              data: z.any(),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/portfolio/blogs/{slug}',
    tags: [portfolioTag],
    summary: 'Get Portfolio Blog by Slug',
    description: 'Retrieves details of a specific published blog by its slug.',
    request: {
      params: blogSlugParamSchema,
    },
    responses: {
      200: {
        description: 'Blog retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Blog retrieved successfully' }),
              data: z.any(),
            }),
          },
        },
      },
      404: {
        description: 'Blog not found or not published',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
