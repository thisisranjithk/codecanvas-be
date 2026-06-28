import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const createCertificationSchema = z.object({
  name: z.string().min(1).openapi({ example: 'AWS Certified Solutions Architect' }),
  issuer: z.string().min(1).openapi({ example: 'Amazon Web Services' }),
  issueDate: z.string().datetime().openapi({ example: '2023-01-15T00:00:00Z' }),
  expiryDate: z.string().datetime().nullable().optional().openapi({ example: '2026-01-15T00:00:00Z' }),
  credentialId: z.string().optional().openapi({ example: 'AWS-12345678' }),
  verificationUrl: z.string().url().optional().openapi({ example: 'https://aws.amazon.com/verify/12345678' }),
  certificateMediaId: z.string().nullable().optional().openapi({ example: null }),
  displayOrder: z.number().int().optional().default(0).openapi({ example: 0 }),
});

export const updateCertificationSchema = z.object({
  name: z.string().min(1).optional().openapi({ example: 'AWS Certified Solutions Architect' }),
  issuer: z.string().min(1).optional().openapi({ example: 'Amazon Web Services' }),
  issueDate: z.string().datetime().optional().openapi({ example: '2023-01-15T00:00:00Z' }),
  expiryDate: z.string().datetime().nullable().optional().openapi({ example: '2026-01-15T00:00:00Z' }),
  credentialId: z.string().optional().openapi({ example: 'AWS-12345678' }),
  verificationUrl: z.string().url().optional().openapi({ example: 'https://aws.amazon.com/verify/12345678' }),
  certificateMediaId: z.string().nullable().optional().openapi({ example: null }),
  displayOrder: z.number().int().optional().openapi({ example: 0 }),
});

export const certificationIdParamSchema = z.object({
  id: z.string(),
});

export type CreateCertificationInput = z.infer<typeof createCertificationSchema>;
export type UpdateCertificationInput = z.infer<typeof updateCertificationSchema>;
