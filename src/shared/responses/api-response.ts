import type { Response } from 'express';

import { HTTP_STATUS } from '../constants/http-status.js';
import type {
  ApiErrorDetail,
  ApiErrorResponse,
  ApiSuccessResponse,
} from '../types/api-response.js';
import type { PaginationMeta } from '../types/pagination.js';

export function sendSuccess<T>(
  res: Response,
  message: string,
  data: T,
  statusCode: number = HTTP_STATUS.OK,
  meta?: PaginationMeta,
): void {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  if (meta) {
    body.meta = meta;
  }

  res.status(statusCode).json(body);
}

export function sendCreated<T>(res: Response, message: string, data: T): void {
  sendSuccess(res, message, data, HTTP_STATUS.CREATED);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.BAD_REQUEST,
  errors?: ApiErrorDetail[],
): void {
  const body: ApiErrorResponse = {
    success: false,
    message,
  };

  if (errors) {
    body.errors = errors;
  }

  res.status(statusCode).json(body);
}

export function sendNoContent(res: Response): void {
  res.status(HTTP_STATUS.NO_CONTENT).send();
}
