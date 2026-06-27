import type { ErrorRequestHandler } from 'express';

import { env } from '../../config/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import type { ApiErrorResponse } from '../types/index.js';
import { AppError } from './app-error.js';

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

  if (env.NODE_ENV === 'development') {
    console.error(err);
  }

  const body: ApiErrorResponse = {
    success: false,
    message: 'An unexpected error occurred.',
  };

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(body);
};
