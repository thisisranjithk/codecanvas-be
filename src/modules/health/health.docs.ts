import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerHealthDocs(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/api/v1/health',
    operationId: 'checkHealth',
    summary: 'API Health Check',
    description: 'Returns the health status of the API.',
    tags: ['Health'],
    responses: {
      200: {
        description: 'Healthy response',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
              data: z.object({
                status: z.string(),
              }),
            }),
          },
        },
      },
    },
  });
}
