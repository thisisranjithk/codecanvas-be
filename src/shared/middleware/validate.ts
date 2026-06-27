import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';

import { BadRequestError } from '../errors/index.js';

type ValidationSource = 'body' | 'query' | 'params';

export function validate(schema: ZodType, source: ValidationSource = 'body'): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.length > 0 ? issue.path.join('.') : source,
        message: issue.message,
      }));

      next(new BadRequestError('Validation failed.', errors));
      return;
    }

    req[source] = result.data;
    next();
  };
}
