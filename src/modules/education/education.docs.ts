import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  createEducationSchema,
  updateEducationSchema,
  educationIdParamSchema,
} from './education.schema.js';

const errorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: 'An error occurred' }),
});

export function registerEducationDocs(registry: OpenAPIRegistry) {
  const educationResponseSchema = z.object({
    id: z.string().cuid(),
    institution: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().nullable(),
    gpa: z.string().nullable(),
    location: z.string().nullable(),
    description: z.string().nullable(),
    activities: z.array(z.string()),
    displayOrder: z.number().int(),
    userId: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  });

  registry.register('Education', educationResponseSchema);

  // POST /educations
  registry.registerPath({
    method: 'post',
    path: '/api/v1/educations',
    tags: ['Educations'],
    summary: 'Create a new education',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createEducationSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Education created successfully',
        content: {
          'application/json': {
            schema: z.object({
               success: z.boolean().openapi({ example: true }),
               message: z.string().openapi({ example: 'Education created successfully' }),
               data: educationResponseSchema,
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

  // GET /educations
  registry.registerPath({
    method: 'get',
    path: '/api/v1/educations',
    tags: ['Educations'],
    summary: 'List educations for authenticated user',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Educations retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Educations retrieved successfully' }),
              data: z.array(educationResponseSchema),
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

  // GET /educations/{id}
  registry.registerPath({
    method: 'get',
    path: '/api/v1/educations/{id}',
    tags: ['Educations'],
    summary: 'Get education by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: educationIdParamSchema,
    },
    responses: {
      200: {
        description: 'Education retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Education retrieved successfully' }),
              data: educationResponseSchema,
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
        description: 'Education not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // PUT /educations/{id}
  registry.registerPath({
    method: 'put',
    path: '/api/v1/educations/{id}',
    tags: ['Educations'],
    summary: 'Update education by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: educationIdParamSchema,
      body: {
        content: {
          'application/json': {
            schema: updateEducationSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Education updated successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Education updated successfully' }),
              data: educationResponseSchema,
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
        description: 'Education not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // DELETE /educations/{id}
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/educations/{id}',
    tags: ['Educations'],
    summary: 'Delete education by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: educationIdParamSchema,
    },
    responses: {
      200: {
        description: 'Education deleted successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Education deleted successfully' }),
            }),
          },
        },
      },
      204: {
        description: 'Education deleted successfully (No Content)',
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
        description: 'Education not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
