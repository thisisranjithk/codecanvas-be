import type { PaginationMeta } from './pagination.ts';

export type ApiErrorDetail = {
  field: string;
  message: string;
};

export type ApiSuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: ApiErrorDetail[];
};
