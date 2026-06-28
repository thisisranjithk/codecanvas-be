import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const createEducationSchema = z.object({
  institution: z.string().min(1).openapi({ example: 'Harvard University' }),
  degree: z.string().min(1).openapi({ example: 'Bachelor of Science' }),
  fieldOfStudy: z.string().min(1).openapi({ example: 'Computer Science' }),
  startDate: z.string().datetime().openapi({ example: '2016-09-01T00:00:00Z' }),
  endDate: z.string().datetime().nullable().optional().openapi({ example: '2020-06-01T00:00:00Z' }),
  gpa: z.string().optional().openapi({ example: '3.8' }),
  location: z.string().optional().openapi({ example: 'Cambridge, MA' }),
  description: z.string().optional().openapi({ example: 'Studied algorithms and data structures' }),
  activities: z.array(z.string()).default([]).openapi({ example: ['Coding Club', 'Robotics Team'] }),
  displayOrder: z.number().int().optional().default(0).openapi({ example: 0 }),
});

export const updateEducationSchema = z.object({
  institution: z.string().min(1).optional().openapi({ example: 'Harvard University' }),
  degree: z.string().min(1).optional().openapi({ example: 'Bachelor of Science' }),
  fieldOfStudy: z.string().min(1).optional().openapi({ example: 'Computer Science' }),
  startDate: z.string().datetime().optional().openapi({ example: '2016-09-01T00:00:00Z' }),
  endDate: z.string().datetime().nullable().optional().openapi({ example: '2020-06-01T00:00:00Z' }),
  gpa: z.string().optional().openapi({ example: '3.8' }),
  location: z.string().optional().openapi({ example: 'Cambridge, MA' }),
  description: z.string().optional().openapi({ example: 'Studied algorithms and data structures' }),
  activities: z.array(z.string()).optional().openapi({ example: ['Coding Club', 'Robotics Team'] }),
  displayOrder: z.number().int().optional().openapi({ example: 0 }),
});

export const educationIdParamSchema = z.object({
  id: z.string(),
});

export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;
