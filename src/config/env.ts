import dotenv from 'dotenv';

dotenv.config();

function getRequiredEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

export const env = {
  NODE_ENV: getOptionalEnv('NODE_ENV', 'development'),
  PORT: Number(getOptionalEnv('PORT', '3000')),
  DATABASE_URL: getRequiredEnv('DATABASE_URL'),
  JWT_ACCESS_SECRET: getRequiredEnv('JWT_ACCESS_SECRET'),
  JWT_ACCESS_EXPIRES_IN: getOptionalEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
  JWT_REFRESH_SECRET: getRequiredEnv('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: getOptionalEnv('JWT_REFRESH_EXPIRES_IN', '24h'),
  COOKIE_SECURE: getOptionalEnv('COOKIE_SECURE', 'false') === 'true',
  COOKIE_SAME_SITE: getOptionalEnv('COOKIE_SAME_SITE', 'lax') as 'lax' | 'strict' | 'none',
  COOKIE_DOMAIN: getOptionalEnv('COOKIE_DOMAIN', ''),
  CLOUDINARY_CLOUD_NAME: getRequiredEnv('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: getRequiredEnv('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getRequiredEnv('CLOUDINARY_API_SECRET'),
  CLOUDINARY_URL: getRequiredEnv('CLOUDINARY_URL'),
  FRONTEND_URL: getRequiredEnv('FRONTEND_URL'),
} as const;

export type Env = typeof env;
