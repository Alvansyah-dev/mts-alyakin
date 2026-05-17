// src/routes/announcement.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { success, error } from '../utils/response';
import { verifyToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();
const prisma = new PrismaClient();

const schema = z.object({
  title: z.string().min(3),
  content: z.string().min(5),
  priority: z.number().int().min(1).max(5).optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional()
});

// GET Public
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    return success(res, data, 'Berhasil mengambil pengumuman');
  } catch (err) {
    next(err);
  }
});

// POST Protected
router.post('/', verifyToken, validate(schema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.announcement.create({ data: req.body });
    return success(res, data, 'Pengumuman berhasil dibuat', 201);
  } catch (err) {
    next(err);
  }
});

// PUT Protected
router.put('/:id', verifyToken, validate(schema.partial()), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.announcement.update({
      where: { id: req.params.id },
      data: req.body
    });
    return success(res, data, 'Pengumuman berhasil diupdate');
  } catch (err) {
    next(err);
  }
});

// DELETE Protected
router.delete('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    return success(res, null, 'Pengumuman berhasil dihapus');
  } catch (err) {
    next(err);
  }
});

export default router;
