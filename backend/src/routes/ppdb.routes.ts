// src/routes/ppdb.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import * as ppdbController from '../controllers/ppdb.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const registerSchema = z.object({
  namaLengkap: z.string().min(3),
  nisn: z.string().length(10),
  tempatLahir: z.string().min(3),
  tanggalLahir: z.string().datetime().or(z.string()),
  jenisKelamin: z.enum(['L', 'P']),
  agama: z.string().min(1),
  alamatLengkap: z.string().min(10),
  asalSekolah: z.string().min(3),
  namaAyah: z.string().min(3),
  pekerjaanAyah: z.string().min(1),
  namaIbu: z.string().min(3),
  pekerjaanIbu: z.string().min(1),
  noHpOrtu: z.string().min(10),
  fotoUrl: z.string().url().optional(),
  ijazahUrl: z.string().url().optional(),
  kkUrl: z.string().url().optional(),
  aktaUrl: z.string().url().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['MENUNGGU', 'DIVERIFIKASI', 'DITERIMA', 'DITOLAK', 'REVISI']),
  catatan: z.string().optional(),
});

// Public routes
router.post('/register', validate(registerSchema), ppdbController.register);
router.get('/check/:noPendaftaran', ppdbController.checkStatus);

// Protected routes
router.get('/', verifyToken, ppdbController.getAllPpdb);
router.get('/:id', verifyToken, ppdbController.getPpdbById);
router.put('/:id/status', verifyToken, validate(updateStatusSchema), ppdbController.updateStatus);
router.delete('/:id', verifyToken, ppdbController.deletePpdb);

export default router;
