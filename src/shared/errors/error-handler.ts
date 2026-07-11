import type { ErrorRequestHandler } from 'express';

import { env } from '../../config/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import type { ApiErrorResponse } from '../types/index.js';
import { AppError } from './app-error.js';
import { Prisma } from '@prisma/client';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    const body: ApiErrorResponse = {
      success: false,
      message: err.message,
    };

    if (err.errors) {
      body.errors = err.errors;
    }

    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let statusCode: number = HTTP_STATUS.BAD_REQUEST;
    let message = 'Database error occurred.';

    if (err.code === 'P2002') {
      statusCode = HTTP_STATUS.CONFLICT;
      message = 'Unique constraint failed. This record already exists.';
    } else if (err.code === 'P2025') {
      statusCode = HTTP_STATUS.NOT_FOUND;
      message = 'Record not found.';
    }

    if (env.NODE_ENV === 'development' && err.code !== 'P2002' && err.code !== 'P2025') {
      message = err.message;
    }

    res.status(statusCode).json({
      success: false,
      message,
    });
    return;
  }

  if (typeof err === 'object' && err !== null && 'name' in (err as Record<string, unknown>) && (err as Record<string, unknown>).name === 'MulterError') {
    const errorObj = err as Record<string, unknown>;
    const code = 'code' in errorObj ? errorObj.code : 'UNKNOWN';
    const errMessage = 'message' in errorObj ? String(errorObj.message) : 'Unknown Multer Error';
    const message = code === 'LIMIT_FILE_SIZE'
      ? 'File size exceeds the 2MB limit.'
      : errMessage;

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message,
    });
    return;
  }

  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid JSON payload format. Please check for syntax errors like trailing commas.',
    });
    return;
  }

  if (env.NODE_ENV === 'development') {
    console.error(err);
  }

  const body: ApiErrorResponse = {
    success: false,
    message: 'An unexpected error occurred.',
  };

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(body);
};
