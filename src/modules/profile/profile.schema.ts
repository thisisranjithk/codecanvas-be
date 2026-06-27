import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const createProfileSchema = z.object({
  headline: z.string().max(150).optional().openapi({ example: 'Software Engineer' }),
  bio: z.string().max(1000).optional().openapi({ example: 'Passionate about web development.' }),
  location: z.string().max(100).optional().openapi({ example: 'San Francisco, CA' }),
  timezone: z.string().max(50).optional().openapi({ example: 'America/Los_Angeles' }),
  github: z.string().url().max(200).optional().openapi({ example: 'https://github.com/johndoe' }),
  linkedin: z.string().url().max(200).optional().openapi({ example: 'https://linkedin.com/in/johndoe' }),
  twitter: z.string().url().max(200).optional().openapi({ example: 'https://twitter.com/johndoe' }),
  website: z.string().url().max(200).optional().openapi({ example: 'https://johndoe.com' }),
  avatar: z.string().optional().openapi({ example: 'cuid_of_media_record' }),
}).openapi('CreateProfileRequest');

export const updateProfileSchema = z.object({
  headline: z.string().max(150).optional(),
  bio: z.string().max(1000).optional(),
  location: z.string().max(100).optional(),
  timezone: z.string().max(50).optional(),
  github: z.string().url().max(200).optional().or(z.literal('')),
  linkedin: z.string().url().max(200).optional().or(z.literal('')),
  twitter: z.string().url().max(200).optional().or(z.literal('')),
  website: z.string().url().max(200).optional().or(z.literal('')),
  avatar: z.string().optional().or(z.literal('')),
}).openapi('UpdateProfileRequest');

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
