import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { createProfileSchema, updateProfileSchema } from './profile.schema.js';

const profileResponseSchema = z.object({
  id: z.string().openapi({ example: 'clq9z2x3a000008l9g7h8i9j0' }),
  userId: z.string().openapi({ example: 'clq9z2x3a000008l9g7h8i9j1' }),
  headline: z.string().nullable().openapi({ example: 'Software Engineer' }),
  bio: z.string().nullable().openapi({ example: 'Passionate about web development.' }),
  location: z.string().nullable().openapi({ example: 'San Francisco, CA' }),
  timezone: z.string().nullable().openapi({ example: 'America/Los_Angeles' }),
  github: z.string().nullable().openapi({ example: 'https://github.com/johndoe' }),
  linkedin: z.string().nullable().openapi({ example: 'https://linkedin.com/in/johndoe' }),
  twitter: z.string().nullable().openapi({ example: 'https://twitter.com/johndoe' }),
  website: z.string().nullable().openapi({ example: 'https://johndoe.com' }),
  avatar: z.string().nullable().openapi({ example: 'cmqwq73540001sossbo9bqclq' }),
  avatarUrl: z.string().nullable().openapi({ example: 'https://res.cloudinary.com/.../image.jpg' }),
  createdAt: z.string().datetime().openapi({ example: '2023-12-18T10:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-12-18T10:00:00Z' }),
});

export function registerProfileDocs(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/api/v1/profile',
    tags: ['Profile'],
    summary: 'Create user profile',
    description: 'Creates a profile for the authenticated user.',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createProfileSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Profile created successfully.',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Profile created successfully.' }),
              data: profileResponseSchema,
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
      409: {
        description: 'Profile already exists for this user.',
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/profile',
    tags: ['Profile'],
    summary: 'Get user profile',
    description: 'Retrieves the profile of the authenticated user.',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Profile retrieved successfully.',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Profile retrieved successfully.' }),
              data: profileResponseSchema,
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
      404: {
        description: 'Profile not found.',
      },
    },
  });

  registry.registerPath({
    method: 'put',
    path: '/api/v1/profile',
    tags: ['Profile'],
    summary: 'Update user profile',
    description: 'Updates the profile of the authenticated user.',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: updateProfileSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Profile updated successfully.',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Profile updated successfully.' }),
              data: profileResponseSchema,
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
      404: {
        description: 'Profile not found.',
      },
    },
  });
}
