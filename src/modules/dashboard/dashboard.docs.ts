import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

const errorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: 'An error occurred' }),
});

export function registerDashboardDocs(registry: OpenAPIRegistry) {
  const dashboardResponseSchema = z.object({
    stats: z.object({
      projects: z.number().openapi({ example: 12 }),
      publishedProjects: z.number().openapi({ example: 10 }),
      draftProjects: z.number().openapi({ example: 2 }),
      blogs: z.number().openapi({ example: 5 }),
      publishedBlogs: z.number().openapi({ example: 4 }),
      draftBlogs: z.number().openapi({ example: 1 }),
      skills: z.number().openapi({ example: 18 }),
      experience: z.number().openapi({ example: 4 }),
      education: z.number().openapi({ example: 2 }),
      certifications: z.number().openapi({ example: 6 }),
    }),
    recentActivity: z.array(z.object({
      type: z.string().openapi({ example: 'PROJECT_CREATED' }),
      title: z.string().openapi({ example: 'Portfolio CMS' }),
      timestamp: z.string().datetime().openapi({ example: '2026-06-30T10:00:00Z' }),
    })),
    featuredContent: z.object({
      featuredProject: z.any().nullable(),
      latestBlog: z.any().nullable(),
      latestCertification: z.any().nullable(),
    }),
  });

  registry.register('Dashboard', dashboardResponseSchema);

  // GET /dashboard
  registry.registerPath({
    method: 'get',
    path: '/api/v1/dashboard',
    tags: ['Dashboard'],
    summary: 'Get dashboard statistics and recent activity',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Dashboard data retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Dashboard data fetched successfully.' }),
              data: dashboardResponseSchema,
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
}
