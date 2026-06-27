import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

const MediaResponseSchema = z.object({
  id: z.string(),
  originalName: z.string(),
  publicId: z.string(),
  url: z.string(),
  secureUrl: z.string(),
  resourceType: z.string(),
  format: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  bytes: z.number(),
  folder: z.string().nullable(),
  uploadedById: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export function registerMediaDocs(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/api/v1/media/upload',
    tags: ['Media'],
    summary: 'Upload media',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                  description: 'File to upload (max 2MB)',
                },
                folder: {
                  type: 'string',
                  enum: ['avatars', 'projects', 'blogs', 'certificates', 'resume'],
                  description: 'Target folder in Cloudinary',
                },
              },
              required: ['file'],
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Media uploaded successfully',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({ media: MediaResponseSchema }),
            }),
          },
        },
      },
      400: { description: 'Bad Request / Validation Error' },
      401: { description: 'Unauthorized' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/media/{id}',
    tags: ['Media'],
    summary: 'Get media by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'Media retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({ media: MediaResponseSchema }),
            }),
          },
        },
      },
      401: { description: 'Unauthorized' },
      404: { description: 'Media not found' },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/v1/media/{id}',
    tags: ['Media'],
    summary: 'Delete media',
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'Media deleted successfully',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              message: z.string(),
              data: z.null(),
            }),
          },
        },
      },
      401: { description: 'Unauthorized' },
      404: { description: 'Media not found' },
    },
  });
}
