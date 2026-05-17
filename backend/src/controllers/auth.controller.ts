// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { success, error } from '../utils/response';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return error(res, 'Email atau password salah', 401);
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return error(res, 'Email atau password salah', 401);
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );

    console.log(`[AUTH] Admin login: ${admin.email}`);

    return res.json({
      success: true,
      data: {
        token: token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(`[AUTH] Admin logout: ${req.admin?.email}`);
    return success(res, null, 'Berhasil logout');
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) return error(res, 'Admin tidak ditemukan', 404);

    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) return error(res, 'Password saat ini salah', 400);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    });

    return success(res, null, 'Password berhasil diubah');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    if (!admin) return error(res, 'Admin tidak ditemukan', 404);

    const { password: _, ...adminData } = admin;
    return success(res, adminData, 'Berhasil mengambil data admin');
  } catch (err) {
    next(err);
  }
};

export const seedAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await prisma.admin.count();
    if (count > 0) {
      return error(res, 'Admin sudah ada, tidak bisa melakukan seed', 403);
    }

    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    const { password: _, ...adminData } = admin;
    return success(res, adminData, 'Admin berhasil dibuat', 201);
  } catch (err) {
    next(err);
  }
};
