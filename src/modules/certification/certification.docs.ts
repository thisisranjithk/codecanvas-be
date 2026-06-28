import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  createCertificationSchema,
  updateCertificationSchema,
  certificationIdParamSchema,
} from './certification.schema.js';

const errorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: 'An error occurred' }),
});

export function registerCertificationDocs(registry: OpenAPIRegistry) {
  const certificationResponseSchema = z.object({
    id: z.string().cuid(),
    name: z.string(),
    issuer: z.string(),
    issueDate: z.string().datetime(),
    expiryDate: z.string().datetime().nullable(),
    credentialId: z.string().nullable(),
    verificationUrl: z.string().url().nullable(),
    certificateMediaId: z.string().nullable(),
    displayOrder: z.number().int(),
    userId: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  });

  registry.register('Certification', certificationResponseSchema);

  // POST /certifications
  registry.registerPath({
    method: 'post',
    path: '/api/v1/certifications',
    tags: ['Certifications'],
    summary: 'Create a new certification',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createCertificationSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Certification created successfully',
        content: {
          'application/json': {
            schema: z.object({
               success: z.boolean().openapi({ example: true }),
               data: certificationResponseSchema,
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

  // GET /certifications
  registry.registerPath({
    method: 'get',
    path: '/api/v1/certifications',
    tags: ['Certifications'],
    summary: 'List certifications for authenticated user',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Certifications retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              data: z.array(certificationResponseSchema),
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

  // GET /certifications/{id}
  registry.registerPath({
    method: 'get',
    path: '/api/v1/certifications/{id}',
    tags: ['Certifications'],
    summary: 'Get certification by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: certificationIdParamSchema,
    },
    responses: {
      200: {
        description: 'Certification retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              data: certificationResponseSchema,
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
        description: 'Certification not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // PUT /certifications/{id}
  registry.registerPath({
    method: 'put',
    path: '/api/v1/certifications/{id}',
    tags: ['Certifications'],
    summary: 'Update certification by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: certificationIdParamSchema,
      body: {
        content: {
          'application/json': {
            schema: updateCertificationSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Certification updated successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              data: certificationResponseSchema,
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
        description: 'Certification not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // DELETE /certifications/{id}
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/certifications/{id}',
    tags: ['Certifications'],
    summary: 'Delete certification by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: certificationIdParamSchema,
    },
    responses: {
      204: {
        description: 'Certification deleted successfully (No Content)',
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
        description: 'Certification not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
