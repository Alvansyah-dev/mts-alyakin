import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/stats', verifyToken, async (req, res) => {
  try {
    const [
      totalPpdb,
      totalNews,
      totalGallery,
      totalConsultation,
      pendingPpdb,
      unansweredConsultation
    ] = await Promise.all([
      prisma.ppdbRegistration.count(),
      prisma.news.count(),
      prisma.gallery.count(),
      prisma.consultation.count(),
      prisma.ppdbRegistration.count({ where: { status: 'MENUNGGU' } }),
      prisma.consultation.count({ where: { replies: { none: {} } } })
    ]);

    res.json({
      success: true,
      data: {
        totalPpdb,
        totalNews,
        totalGallery,
        totalConsultation,
        pendingPpdb,
        unansweredConsultation
      }
    });
  } catch (error: any) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
