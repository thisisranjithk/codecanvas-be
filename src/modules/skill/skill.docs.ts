import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  createSkillSchema,
  updateSkillSchema,
  skillIdParamSchema,
} from './skill.schema.js';

const errorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: 'An error occurred' }),
});

export function registerSkillDocs(registry: OpenAPIRegistry) {
  const skillResponseSchema = z.object({
    id: z.string().cuid(),
    name: z.string(),
    category: z.string(),
    proficiency: z.number().int(),
    yearsOfExperience: z.number().int(),
    displayOrder: z.number().int(),
    userId: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  });

  registry.register('Skill', skillResponseSchema);

  // POST /skills
  registry.registerPath({
    method: 'post',
    path: '/api/v1/skills',
    tags: ['Skills'],
    summary: 'Create a new skill',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createSkillSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Skill created successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Skill created successfully' }),
              data: skillResponseSchema,
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

  // GET /skills
  registry.registerPath({
    method: 'get',
    path: '/api/v1/skills',
    tags: ['Skills'],
    summary: 'List skills for authenticated user',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Skills retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Skills retrieved successfully' }),
              data: z.array(skillResponseSchema),
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

  // GET /skills/{id}
  registry.registerPath({
    method: 'get',
    path: '/api/v1/skills/{id}',
    tags: ['Skills'],
    summary: 'Get skill by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: skillIdParamSchema,
    },
    responses: {
      200: {
        description: 'Skill retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Skill retrieved successfully' }),
              data: skillResponseSchema,
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
        description: 'Skill not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // PUT /skills/{id}
  registry.registerPath({
    method: 'put',
    path: '/api/v1/skills/{id}',
    tags: ['Skills'],
    summary: 'Update skill by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: skillIdParamSchema,
      body: {
        content: {
          'application/json': {
            schema: updateSkillSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Skill updated successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Skill updated successfully' }),
              data: skillResponseSchema,
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
        description: 'Skill not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // DELETE /skills/{id}
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/skills/{id}',
    tags: ['Skills'],
    summary: 'Delete skill by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: skillIdParamSchema,
    },
    responses: {
      200: {
        description: 'Skill deleted successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Skill deleted successfully' }),
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
        description: 'Skill not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
