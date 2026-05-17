// src/routes/contact.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { success } from '../utils/response';
import { validate } from '../middleware/validate.middleware';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10)
});

// POST Public
router.post('/', validate(schema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.contactMessage.create({ data: req.body });
    
    // Optional: Send email notification to admin here using nodemailer
    
    return success(res, data, 'Pesan berhasil dikirim', 201);
  } catch (err) {
    next(err);
  }
});

// GET Protected
router.get('/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return success(res, data, 'Berhasil mengambil data pesan');
  } catch (err) {
    next(err);
  }
});

export default router;
