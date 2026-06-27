// ─── API Response Types ──────────────────────────────────────────────────────

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

// ─── Pagination Types ─────────────────────────────────────────────────────────

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

// ─── Request Context ──────────────────────────────────────────────────────────

export type RequestContext = {
  userId?: string;
};
