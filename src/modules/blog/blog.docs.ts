import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  createBlogSchema,
  updateBlogSchema,
  blogIdParamSchema,
  listBlogsQuerySchema,
} from './blog.schema.js';

const errorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: 'An error occurred' }),
});

export function registerBlogDocs(registry: OpenAPIRegistry) {
  const blogResponseSchema = z.object({
    id: z.string().cuid(),
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    content: z.string(),
    coverMediaId: z.string().nullable(),
    readTime: z.number().nullable(),
    tags: z.array(z.string()),
    status: z.string(),
    featured: z.boolean(),
    publishedAt: z.string().datetime().nullable(),
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),
    userId: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    coverMedia: z
      .object({
        id: z.string(),
        url: z.string(),
        secureUrl: z.string(),
        publicId: z.string(),
      })
      .nullable()
      .optional(),
  });

  registry.register('Blog', blogResponseSchema);

  // POST /blogs
  registry.registerPath({
    method: 'post',
    path: '/api/v1/blogs',
    tags: ['Blogs'],
    summary: 'Create a new blog',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createBlogSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Blog created successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Blog created successfully' }),
              data: blogResponseSchema,
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
      409: {
        description: 'Conflict',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // GET /blogs
  registry.registerPath({
    method: 'get',
    path: '/api/v1/blogs',
    tags: ['Blogs'],
    summary: 'List blogs for authenticated user',
    security: [{ bearerAuth: [] }],
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
              data: z.object({
                meta: z.object({
                  total: z.number(),
                  page: z.number(),
                  limit: z.number(),
                  totalPages: z.number(),
                  hasNextPage: z.boolean(),
                  hasPrevPage: z.boolean(),
                }),
                data: z.array(blogResponseSchema),
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

  // GET /blogs/{id}
  registry.registerPath({
    method: 'get',
    path: '/api/v1/blogs/{id}',
    tags: ['Blogs'],
    summary: 'Get blog by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: blogIdParamSchema,
    },
    responses: {
      200: {
        description: 'Blog retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Blog retrieved successfully' }),
              data: blogResponseSchema,
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
        description: 'Blog not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // PUT /blogs/{id}
  registry.registerPath({
    method: 'put',
    path: '/api/v1/blogs/{id}',
    tags: ['Blogs'],
    summary: 'Update blog by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: blogIdParamSchema,
      body: {
        content: {
          'application/json': {
            schema: updateBlogSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Blog updated successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Blog updated successfully' }),
              data: blogResponseSchema,
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
        description: 'Blog not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      409: {
        description: 'Conflict',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  // DELETE /blogs/{id}
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/blogs/{id}',
    tags: ['Blogs'],
    summary: 'Delete blog by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: blogIdParamSchema,
    },
    responses: {
      200: {
        description: 'Blog deleted successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Blog deleted successfully' }),
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
        description: 'Blog not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
