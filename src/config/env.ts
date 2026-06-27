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
} as const;

export type Env = typeof env;
