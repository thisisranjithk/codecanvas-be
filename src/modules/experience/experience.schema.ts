import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const createExperienceSchema = z.object({
  company: z.string().min(1).openapi({ example: 'Google' }),
  role: z.string().min(1).openapi({ example: 'Software Engineer' }),
  employmentTypeId: z.string().cuid('Invalid employment type ID').openapi({ example: 'cuid_value_here' }),
  location: z.string().optional().openapi({ example: 'Mountain View, CA' }),
  startDate: z.string().datetime().openapi({ example: '2020-01-01T00:00:00Z' }),
  endDate: z.string().datetime().nullable().optional().openapi({ example: '2023-01-01T00:00:00Z' }),
  isCurrent: z.boolean().optional().default(false).openapi({ example: false }),
  description: z.string().optional().openapi({ example: 'Worked on Google Cloud Platform' }),
  responsibilities: z.array(z.string()).default([]).openapi({ example: ['Built things', 'Fixed bugs'] }),
  technologies: z.array(z.string()).default([]).openapi({ example: ['Go', 'Kubernetes'] }),
  displayOrder: z.number().int().optional().default(0).openapi({ example: 0 }),
}).superRefine((data, ctx) => {
  if (data.isCurrent) {
    if (data.endDate !== null && data.endDate !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Current experience cannot have an end date',
        path: ['endDate'],
      });
    }
  } else {
    if (data.endDate === null || data.endDate === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Previous experience must have an end date',
        path: ['endDate'],
      });
    }
  }
});

export const updateExperienceSchema = z.object({
  company: z.string().min(1).optional().openapi({ example: 'Google' }),
  role: z.string().min(1).optional().openapi({ example: 'Software Engineer' }),
  employmentTypeId: z.string().cuid('Invalid employment type ID').optional().openapi({ example: 'cuid_value_here' }),
  location: z.string().optional().openapi({ example: 'Mountain View, CA' }),
  startDate: z.string().datetime().optional().openapi({ example: '2020-01-01T00:00:00Z' }),
  endDate: z.string().datetime().nullable().optional().openapi({ example: '2023-01-01T00:00:00Z' }),
  isCurrent: z.boolean().optional().openapi({ example: false }),
  description: z.string().optional().openapi({ example: 'Worked on Google Cloud Platform' }),
  responsibilities: z.array(z.string()).optional().openapi({ example: ['Built things', 'Fixed bugs'] }),
  technologies: z.array(z.string()).optional().openapi({ example: ['Go', 'Kubernetes'] }),
  displayOrder: z.number().int().optional().openapi({ example: 0 }),
}).superRefine((data, ctx) => {
  if (data.isCurrent === true) {
    if (data.endDate !== null && data.endDate !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Current experience cannot have an end date',
        path: ['endDate'],
      });
    }
  } else if (data.isCurrent === false) {
    if (data.endDate === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Previous experience must have an end date',
        path: ['endDate'],
      });
    }
  }
});

export const experienceIdParamSchema = z.object({
  id: z.string(),
});

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
