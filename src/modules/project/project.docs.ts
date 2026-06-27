import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  createProjectSchema,
  updateProjectSchema,
  getProjectSchema,
  deleteProjectSchema,
  listProjectsQuerySchema,
} from './project.schema.js';

const errorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: 'An error occurred' }),
});

export function registerProjectDocs(registry: OpenAPIRegistry) {
  const projectResponseSchema = z.object({
    id: z.string().cuid(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    status: z.string(),
    technologies: z.array(z.string()),
    liveUrl: z.string().nullable(),
    githubUrl: z.string().nullable(),
    featured: z.boolean(),
    thumbnailMediaId: z.string().nullable(),
    userId: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    thumbnail: z.object({
      id: z.string(),
      url: z.string(),
      secureUrl: z.string(),
      publicId: z.string(),
    }).nullable().optional(),
  });

  registry.register('Project', projectResponseSchema);

  // POST /projects
  registry.registerPath({
    method: 'post',
    path: '/api/v1/projects',
    tags: ['Projects'],
    summary: 'Create a new project',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createProjectSchema.shape.body,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Project created successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Project created successfully' }),
              data: projectResponseSchema,
            }),
          },
        },
      },
      400: {
        description: 'Validation Error',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // GET /projects
  registry.registerPath({
    method: 'get',
    path: '/api/v1/projects',
    tags: ['Projects'],
    summary: 'List projects for authenticated user',
    security: [{ bearerAuth: [] }],
    request: {
      query: listProjectsQuerySchema.shape.query,
    },
    responses: {
      200: {
        description: 'Projects retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Projects retrieved successfully' }),
              data: z.object({
                meta: z.object({
                  total: z.number(),
                  page: z.number(),
                  limit: z.number(),
                  totalPages: z.number(),
                  hasNextPage: z.boolean(),
                  hasPrevPage: z.boolean(),
                }),
                data: z.array(projectResponseSchema),
              }),
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // GET /projects/{id}
  registry.registerPath({
    method: 'get',
    path: '/api/v1/projects/{id}',
    tags: ['Projects'],
    summary: 'Get project by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: getProjectSchema.shape.params,
    },
    responses: {
      200: {
        description: 'Project retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Project retrieved successfully' }),
              data: projectResponseSchema,
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: 'Forbidden (Not the owner)',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: 'Project not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // PUT /projects/{id}
  registry.registerPath({
    method: 'put',
    path: '/api/v1/projects/{id}',
    tags: ['Projects'],
    summary: 'Update project by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: updateProjectSchema.shape.params,
      body: {
        content: {
          'application/json': {
            schema: updateProjectSchema.shape.body,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Project updated successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Project updated successfully' }),
              data: projectResponseSchema,
            }),
          },
        },
      },
      400: {
        description: 'Validation Error',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: 'Project not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // DELETE /projects/{id}
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/projects/{id}',
    tags: ['Projects'],
    summary: 'Delete project by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: deleteProjectSchema.shape.params,
    },
    responses: {
      200: {
        description: 'Project deleted successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Project deleted successfully' }),
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: 'Project not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
