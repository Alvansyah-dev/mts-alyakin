// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { error } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return error(res, 'Validasi gagal', 400, formattedErrors);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return error(res, 'Data sudah ada (unik constraint).', 400);
    }
    if (err.code === 'P2025') {
      return error(res, 'Data tidak ditemukan.', 404);
    }
  }

  if (err.message && err.message.includes('Cloudinary')) {
    return error(res, 'Gagal upload gambar ke server', 500);
  }

  return error(res, 'Terjadi kesalahan internal server', 500);
};
