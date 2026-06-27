import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '@prisma/client';

import { ForbiddenError } from '../errors/index.js';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      next(new ForbiddenError());
      return;
    }

    next();
  };
}
