import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import { env } from './env.js';
import { registerAuthDocs } from '../modules/auth/auth.docs.js';
import { registerHealthDocs } from '../modules/health/health.docs.js';

export const registry = new OpenAPIRegistry();

// Register Security Scheme
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// Register module documentation
registerAuthDocs(registry);
registerHealthDocs(registry);

export function generateOpenAPI() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Portfolio CMS API',
      description: 'API documentation for Portfolio CMS',
      contact: {
        name: 'Developer',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: '/',
        description: 'Current Environment',
      },
    ],
  });
}
