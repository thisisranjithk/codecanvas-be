import { z } from 'zod';

export const createSkillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  categoryId: z.string().cuid('Invalid category ID'),
  proficiency: z.number().int().min(0).max(100).default(0),
  yearsOfExperience: z.number().int().min(0).default(0),
  displayOrder: z.number().int().default(0),
});

export const updateSkillSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  categoryId: z.string().cuid('Invalid category ID').optional(),
  proficiency: z.number().int().min(0).max(100).optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  displayOrder: z.number().int().optional(),
});

export const skillIdParamSchema = z.object({
  id: z.string().cuid('Invalid Skill ID'),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
