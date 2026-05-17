// src/controllers/gallery.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, error } from '../utils/response';
import { deleteImage } from '../services/cloudinary.service';

const prisma = new PrismaClient();

export const getGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category as string;
    const isPublicParam = req.query.isPublic as string;
    const limit = parseInt(req.query.limit as string) || 50;

    const isAdmin = !!req.admin;
    const where: any = {};

    if (!isAdmin || isPublicParam === 'true') {
      where.isPublic = true;
    }

    if (category) {
      where.category = category;
    }

    const data = await prisma.gallery.findMany({
      where,
      take: limit,
      orderBy: { order: 'asc' },
    });

    return success(res, data, 'Berhasil mengambil data galeri');
  } catch (err) {
    next(err);
  }
};

export const createGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    
    // Get highest order to append to end
    const lastItem = await prisma.gallery.findFirst({
      orderBy: { order: 'desc' }
    });
    
    const newOrder = lastItem ? lastItem.order + 1 : 0;

    const gallery = await prisma.gallery.create({ 
      data: { ...data, order: newOrder } 
    });
    
    return success(res, gallery, 'Foto berhasil ditambahkan', 201);
  } catch (err) {
    next(err);
  }
};

export const updateGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const gallery = await prisma.gallery.update({
      where: { id },
      data,
    });

    return success(res, gallery, 'Data foto berhasil diupdate');
  } catch (err) {
    next(err);
  }
};

export const deleteGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const gallery = await prisma.gallery.findUnique({ where: { id } });
    if (!gallery) return error(res, 'Foto tidak ditemukan', 404);

    if (gallery.cloudinaryId) {
      await deleteImage(gallery.cloudinaryId).catch(console.error);
    }

    await prisma.gallery.delete({ where: { id } });
    return success(res, null, 'Foto berhasil dihapus');
  } catch (err) {
    next(err);
  }
};

export const reorderGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = req.body as { id: string, order: number }[];
    
    // Use transaction for batch update
    await prisma.$transaction(
      items.map((item) => 
        prisma.gallery.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    return success(res, null, 'Urutan galeri berhasil diperbarui');
  } catch (err) {
    next(err);
  }
};
