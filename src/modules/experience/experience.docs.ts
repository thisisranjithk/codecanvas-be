import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  createExperienceSchema,
  updateExperienceSchema,
  experienceIdParamSchema,
} from './experience.schema.js';

const errorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: 'An error occurred' }),
});

export function registerExperienceDocs(registry: OpenAPIRegistry) {
  const experienceResponseSchema = z.object({
    id: z.string().cuid(),
    company: z.string(),
    role: z.string(),
    employmentTypeId: z.string(),
    location: z.string().nullable(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().nullable(),
    isCurrent: z.boolean(),
    description: z.string().nullable(),
    responsibilities: z.array(z.string()),
    technologies: z.array(z.string()),
    displayOrder: z.number().int(),
    userId: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    employmentType: z.object({
      id: z.string(),
      name: z.string(),
    }).optional(),
  });

  registry.register('Experience', experienceResponseSchema);

  // POST /experiences
  registry.registerPath({
    method: 'post',
    path: '/api/v1/experiences',
    tags: ['Experiences'],
    summary: 'Create a new experience',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createExperienceSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Experience created successfully',
        content: {
          'application/json': {
            schema: z.object({
               success: z.boolean().openapi({ example: true }),
               message: z.string().openapi({ example: 'Experience created successfully' }),
               data: experienceResponseSchema,
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

  // GET /experiences
  registry.registerPath({
    method: 'get',
    path: '/api/v1/experiences',
    tags: ['Experiences'],
    summary: 'List experiences for authenticated user',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Experiences retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Experiences retrieved successfully' }),
              data: z.array(experienceResponseSchema),
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

  // GET /experiences/{id}
  registry.registerPath({
    method: 'get',
    path: '/api/v1/experiences/{id}',
    tags: ['Experiences'],
    summary: 'Get experience by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: experienceIdParamSchema,
    },
    responses: {
      200: {
        description: 'Experience retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Experience retrieved successfully' }),
              data: experienceResponseSchema,
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
        description: 'Experience not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // PUT /experiences/{id}
  registry.registerPath({
    method: 'put',
    path: '/api/v1/experiences/{id}',
    tags: ['Experiences'],
    summary: 'Update experience by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: experienceIdParamSchema,
      body: {
        content: {
          'application/json': {
            schema: updateExperienceSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Experience updated successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Experience updated successfully' }),
              data: experienceResponseSchema,
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
        description: 'Experience not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // DELETE /experiences/{id}
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/experiences/{id}',
    tags: ['Experiences'],
    summary: 'Delete experience by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: experienceIdParamSchema,
    },
    responses: {
      200: {
        description: 'Experience deleted successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Experience deleted successfully' }),
            }),
          },
        },
      },
      204: {
        description: 'Experience deleted successfully (No Content)',
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
        description: 'Experience not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
