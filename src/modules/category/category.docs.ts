import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { CategoryType } from '@prisma/client';

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
  getCategoryDropdownSchema,
} from './category.schema.js';

const errorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: 'An error occurred' }),
});

export function registerCategoryDocs(registry: OpenAPIRegistry) {
  const categoryResponseSchema = z.object({
    id: z.string().cuid(),
    name: z.string(),
    slug: z.string(),
    type: z.nativeEnum(CategoryType),
    displayOrder: z.number().int(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  });

  const categoryDropdownResponseSchema = z.object({
    id: z.string().cuid(),
    name: z.string(),
  });

  registry.register('Category', categoryResponseSchema);
  registry.register('CategoryDropdown', categoryDropdownResponseSchema);

  // POST /categories
  registry.registerPath({
    method: 'post',
    path: '/api/v1/categories',
    tags: ['Categories'],
    summary: 'Create a new category',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createCategorySchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Category created successfully',
        content: {
          'application/json': {
            schema: categoryResponseSchema,
          },
        },
      },
      400: {
        description: 'Validation Error or duplicate slug/name',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // GET /categories
  registry.registerPath({
    method: 'get',
    path: '/api/v1/categories',
    tags: ['Categories'],
    summary: 'List all categories',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Categories retrieved successfully',
        content: {
          'application/json': {
            schema: z.array(categoryResponseSchema),
          },
        },
      },
    },
  });

  // GET /categories/dropdown
  registry.registerPath({
    method: 'get',
    path: '/api/v1/categories/dropdown',
    tags: ['Categories'],
    summary: 'Get categories for dropdowns',
    security: [{ bearerAuth: [] }],
    request: {
      query: getCategoryDropdownSchema,
    },
    responses: {
      200: {
        description: 'Dropdown items retrieved',
        content: {
          'application/json': {
            schema: z.array(categoryDropdownResponseSchema),
          },
        },
      },
    },
  });

  // GET /categories/{id}
  registry.registerPath({
    method: 'get',
    path: '/api/v1/categories/{id}',
    tags: ['Categories'],
    summary: 'Get category by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: categoryIdParamSchema,
    },
    responses: {
      200: {
        description: 'Category retrieved',
        content: {
          'application/json': {
            schema: categoryResponseSchema,
          },
        },
      },
      404: {
        description: 'Not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // PUT /categories/{id}
  registry.registerPath({
    method: 'put',
    path: '/api/v1/categories/{id}',
    tags: ['Categories'],
    summary: 'Update category by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: categoryIdParamSchema,
      body: {
        content: {
          'application/json': {
            schema: updateCategorySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Category updated',
        content: {
          'application/json': {
            schema: categoryResponseSchema,
          },
        },
      },
      400: {
        description: 'Validation Error or duplicate name',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // DELETE /categories/{id}
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/categories/{id}',
    tags: ['Categories'],
    summary: 'Delete category by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: categoryIdParamSchema,
    },
    responses: {
      204: {
        description: 'Category deleted',
      },
      400: {
        description: 'Category in use',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
