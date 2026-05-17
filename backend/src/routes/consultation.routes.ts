// src/routes/consultation.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import * as consultationController from '../controllers/consultation.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const createSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  question: z.string().min(10),
  category: z.string().optional(),
  isPublic: z.boolean().optional(),
});

const moderateSchema = z.object({
  isModerated: z.boolean().optional(),
  isHidden: z.boolean().optional(),
});

const replySchema = z.object({
  reply: z.string().min(1),
});

const optionalAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    import('jsonwebtoken').then(jwt => {
      try {
        req.admin = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      } catch (e) {}
      next();
    });
  } else {
    next();
  }
};

// Public
router.post('/', validate(createSchema), consultationController.createConsultation);
router.get('/', optionalAuth, consultationController.getConsultations);

// Protected
router.put('/:id/moderate', verifyToken, validate(moderateSchema), consultationController.moderateConsultation);
router.post('/:id/reply', verifyToken, validate(replySchema), consultationController.replyConsultation);
router.delete('/:id', verifyToken, consultationController.deleteConsultation);

export default router;
