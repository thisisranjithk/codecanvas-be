import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  listProjectsQuerySchema,
} from '../project/project.schema.js';
import { listBlogsQuerySchema } from '../blog/blog.schema.js';

extendZodWithOpenApi(z);

const usernameParamSchema = z.object({
  username: z.string().openapi({ example: 'johndoe' }),
});

const usernameAndProjectIdParamSchema = z.object({
  username: z.string().openapi({ example: 'johndoe' }),
  id: z.string().openapi({ example: 'clxyz123' }),
});

const usernameAndBlogSlugParamSchema = z.object({
  username: z.string().openapi({ example: 'johndoe' }),
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
    path: '/api/v1/portfolio/{username}',
    tags: [portfolioTag],
    summary: 'Get Portfolio Homepage',
    description:
      'Retrieves aggregated portfolio data for the given username, including profile, featured projects, skills, experiences, educations, certifications, and latest published blogs.',
    request: {
      params: usernameParamSchema,
    },
    responses: {
      200: {
        description: 'Portfolio homepage data retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z
                .string()
                .openapi({ example: 'Portfolio data retrieved successfully.' }),
              data: z.any(),
            }),
          },
        },
      },
      404: {
        description: 'Portfolio not found for the given username',
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
    path: '/api/v1/portfolio/{username}/projects',
    tags: [portfolioTag],
    summary: 'Get Portfolio Projects',
    description:
      'Retrieves a paginated list of published projects for the given username.',
    request: {
      params: usernameParamSchema,
      query: listProjectsQuerySchema,
    },
    responses: {
      200: {
        description: 'Projects retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z
                .string()
                .openapi({ example: 'Projects retrieved successfully.' }),
              data: z.any(),
            }),
          },
        },
      },
      404: {
        description: 'Portfolio not found for the given username',
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
    path: '/api/v1/portfolio/{username}/projects/{id}',
    tags: [portfolioTag],
    summary: 'Get Portfolio Project by ID',
    description:
      'Retrieves details of a specific published project for the given username.',
    request: {
      params: usernameAndProjectIdParamSchema,
    },
    responses: {
      200: {
        description: 'Project retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z
                .string()
                .openapi({ example: 'Project retrieved successfully.' }),
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
    path: '/api/v1/portfolio/{username}/blogs',
    tags: [portfolioTag],
    summary: 'Get Portfolio Blogs',
    description:
      'Retrieves a paginated list of published blogs for the given username.',
    request: {
      params: usernameParamSchema,
      query: listBlogsQuerySchema,
    },
    responses: {
      200: {
        description: 'Blogs retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z
                .string()
                .openapi({ example: 'Blogs retrieved successfully.' }),
              data: z.any(),
            }),
          },
        },
      },
      404: {
        description: 'Portfolio not found for the given username',
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
    path: '/api/v1/portfolio/{username}/blogs/{slug}',
    tags: [portfolioTag],
    summary: 'Get Portfolio Blog by Slug',
    description:
      'Retrieves details of a specific published blog by its slug for the given username.',
    request: {
      params: usernameAndBlogSlugParamSchema,
    },
    responses: {
      200: {
        description: 'Blog retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z
                .string()
                .openapi({ example: 'Blog retrieved successfully.' }),
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
