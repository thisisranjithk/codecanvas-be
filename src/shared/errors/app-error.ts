import type { ApiErrorDetail } from '../types/api-response.js';
import { HTTP_STATUS } from '../constants/http-status.js';

export class AppError extends Error {
  readonly statusCode: number;
  readonly errors?: ApiErrorDetail[];

  constructor(statusCode: number, message: string, errors?: ApiErrorDetail[]) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    if (errors) {
      this.errors = errors;
    }
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request.', errors?: ApiErrorDetail[]) {
    super(HTTP_STATUS.BAD_REQUEST, message, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized.') {
    super(HTTP_STATUS.UNAUTHORIZED, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden.') {
    super(HTTP_STATUS.FORBIDDEN, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found.') {
    super(HTTP_STATUS.NOT_FOUND, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict.') {
    super(HTTP_STATUS.CONFLICT, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'An unexpected error occurred.') {
    super(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
  }
}
