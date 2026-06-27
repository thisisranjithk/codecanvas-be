import { Router } from 'express';

import { authenticate, validate } from '../../shared/middleware/index.js';
import { authController } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
