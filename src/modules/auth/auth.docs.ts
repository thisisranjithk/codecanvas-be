import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { loginSchema, registerSchema, changePasswordSchema, deleteAccountSchema } from './auth.schema.js';

export function registerAuthDocs(registry: OpenAPIRegistry) {
  const userSchema = z.object({
    id: z.string().uuid(),
    fullName: z.string(),
    username: z.string(),
    email: z.string().email(),
    role: z.string(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  });

  registry.register('RegisterInput', registerSchema);
  registry.register('LoginInput', loginSchema);
  registry.register('User', userSchema);

  registry.registerPath({
    method: 'post',
    path: '/api/v1/auth/register',
    operationId: 'registerUser',
    summary: 'Register User',
    description: 'Register a new user account.',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: registerSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User registered successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
              data: z.object({
                user: userSchema,
              }),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/auth/login',
    operationId: 'loginUser',
    summary: 'Login User',
    description: 'Login to an existing user account.',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: loginSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
              data: z.object({
                user: userSchema,
                accessToken: z.string(),
              }),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/auth/me',
    operationId: 'getCurrentUser',
    summary: 'Get Current User',
    description: 'Fetch the profile of the currently authenticated user.',
    tags: ['Auth'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'User profile fetched successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
              data: z.object({
                user: userSchema,
              }),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'put',
    path: '/api/v1/auth/change-password',
    operationId: 'changePassword',
    summary: 'Change Password',
    description: 'Change the password of the authenticated user.',
    tags: ['Auth'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: changePasswordSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password changed successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/v1/auth/account',
    operationId: 'deleteAccount',
    summary: 'Delete Account',
    description: 'Permanently delete the authenticated user account and all associated data.',
    tags: ['Auth'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: deleteAccountSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Account deleted successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
            }),
          },
        },
      },
    },
  });
}
