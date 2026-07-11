import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export class QueryBuilder {
  /**
   * Build Prisma query options based on standard pagination query, search fields, and additional filters
   */
  static build<T extends Record<string, unknown>>(
    query: PaginationQuery,
    searchFields: string[] = [],
    filters: T = {} as T
  ) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Record<string, unknown> & { OR?: Record<string, unknown>[] } = { ...filters };

    if (search && searchFields.length > 0) {
      where.OR = searchFields.map((field) => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {
      [sortBy]: sortOrder as 'asc' | 'desc',
    };

    return {
      where,
      orderBy,
      skip,
      take,
    };
  }

  /**
   * Return standard pagination metadata
   */
  static paginate(total: number, page: number, limit: number) {
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }
}
