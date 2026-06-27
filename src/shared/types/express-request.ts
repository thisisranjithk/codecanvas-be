import type { JwtUser } from './auth.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtUser;
  }
}

export {};
