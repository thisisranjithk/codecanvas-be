import { z } from 'zod';
import { CategoryType } from '@prisma/client';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug is too long').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric and can contain hyphens'),
  type: z.nativeEnum(CategoryType),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
  type: z.nativeEnum(CategoryType).optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
}).strict();

export const categoryIdParamSchema = z.object({
  id: z.string().cuid('Invalid category ID'),
});

export const getCategoryDropdownSchema = z.object({
  type: z.nativeEnum(CategoryType),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type GetCategoryDropdownQuery = z.infer<typeof getCategoryDropdownSchema>;
