// src/controllers/ppdb.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient, PpdbStatus } from '@prisma/client';
import { success, error } from '../utils/response';
import { registerPpdb } from '../services/ppdb.service';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const result = await registerPpdb(data);
    
    return success(res, { noPendaftaran: result.noPendaftaran }, 'Pendaftaran berhasil disimpan', 201);
  } catch (err) {
    next(err);
  }
};

export const checkStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { noPendaftaran } = req.params;
    const ppdb = await prisma.ppdbRegistration.findUnique({ 
      where: { noPendaftaran },
      select: {
        noPendaftaran: true,
        namaLengkap: true,
        status: true,
        catatan: true,
        createdAt: true
      }
    });

    if (!ppdb) return error(res, 'Data pendaftaran tidak ditemukan', 404);

    return success(res, ppdb, 'Data ditemukan');
  } catch (err) {
    next(err);
  }
};

export const getAllPpdb = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string;
    
    const where: any = {};

    if (status) {
      where.status = status as PpdbStatus;
    }

    if (search) {
      where.OR = [
        { namaLengkap: { contains: search } },
        { noPendaftaran: { contains: search } },
        { nisn: { contains: search } }
      ];
    }

    const total = await prisma.ppdbRegistration.count({ where });
    const totalPages = Math.ceil(total / limit);

    const data = await prisma.ppdbRegistration.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: data,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: totalPages,
        limit,
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getPpdbById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const ppdb = await prisma.ppdbRegistration.findUnique({ where: { id } });

    if (!ppdb) return error(res, 'Data pendaftaran tidak ditemukan', 404);

    return success(res, ppdb, 'Berhasil mengambil data pendaftaran');
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body;

    const ppdb = await prisma.ppdbRegistration.update({
      where: { id },
      data: { status, catatan },
    });

    return success(res, ppdb, 'Status berhasil diperbarui');
  } catch (err) {
    next(err);
  }
};

export const deletePpdb = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    await prisma.ppdbRegistration.delete({ where: { id } });
    return success(res, null, 'Data pendaftaran berhasil dihapus');
  } catch (err) {
    if ((err as any).code === 'P2025') {
      return error(res, 'Data tidak ditemukan', 404);
    }
    next(err);
  }
};
