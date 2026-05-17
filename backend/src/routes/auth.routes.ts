// src/routes/auth.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import * as authController from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

const seedSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
});

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', verifyToken, authController.logout);
router.put('/change-password', verifyToken, validate(changePasswordSchema), authController.changePassword);
router.get('/me', verifyToken, authController.getMe);
router.post('/seed', validate(seedSchema), authController.seedAdmin);

export default router;
