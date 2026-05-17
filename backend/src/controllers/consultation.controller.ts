// src/controllers/consultation.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, error } from '../utils/response';

const prisma = new PrismaClient();

export const createConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    
    const consultation = await prisma.consultation.create({
      data: {
        ...data,
        isModerated: false, // Must be approved by admin
      }
    });

    return success(res, consultation, 'Pertanyaan berhasil dikirim dan menunggu moderasi', 201);
  } catch (err) {
    next(err);
  }
};

export const getConsultations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const category = req.query.category as string;
    
    const isAdmin = !!req.admin;
    const where: any = {};

    if (!isAdmin) {
      where.isPublic = true;
      where.isModerated = true;
      where.isHidden = false;
    }

    if (category) {
      where.category = category;
    }

    const data = await prisma.consultation.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { replies: true }
    });

    // If not admin, do not send emails in public queries
    if (!isAdmin) {
      data.forEach(item => {
        item.email = '***@***.***';
      });
    }

    return success(res, data, 'Berhasil mengambil data konsultasi');
  } catch (err) {
    next(err);
  }
};

export const moderateConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isModerated, isHidden } = req.body;

    const consultation = await prisma.consultation.update({
      where: { id },
      data: { isModerated, isHidden },
    });

    return success(res, consultation, 'Status moderasi berhasil diupdate');
  } catch (err) {
    next(err);
  }
};

export const replyConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const newReply = await prisma.consultationReply.create({
      data: {
        consultationId: id,
        adminId: req.admin.id,
        reply,
      }
    });

    // Automatically set isModerated to true when replied
    await prisma.consultation.update({
      where: { id },
      data: { isModerated: true }
    });

    return success(res, newReply, 'Balasan berhasil dikirim', 201);
  } catch (err) {
    next(err);
  }
};

export const deleteConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    await prisma.consultation.delete({ where: { id } });
    return success(res, null, 'Pertanyaan berhasil dihapus');
  } catch (err) {
    next(err);
  }
};
