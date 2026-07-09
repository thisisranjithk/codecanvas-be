import { Router } from 'express';

import { authenticate, validate } from '../../shared/middleware/index.js';
import * as authController from './auth.controller.js';
import { loginSchema, registerSchema, changePasswordSchema, deleteAccountSchema } from './auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.registerHandler);
router.post('/login', validate(loginSchema), authController.loginHandler);
router.post('/refresh', authController.refreshHandler);
router.post('/logout', authController.logoutHandler);
router.get('/me', authenticate, authController.getCurrentUserHandler);
router.put('/change-password', authenticate, validate(changePasswordSchema), authController.changePasswordHandler);
router.delete('/account', authenticate, validate(deleteAccountSchema), authController.deleteAccountHandler);

export default router;
