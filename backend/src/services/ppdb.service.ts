// src/services/ppdb.service.ts
import { PrismaClient } from '@prisma/client';
import { generateNoPendaftaran } from '../utils/generateNoPendaftaran';

const prisma = new PrismaClient();

export const registerPpdb = async (data: any) => {
  let noPendaftaran = generateNoPendaftaran();
  
  // Ensure uniqueness
  let isUnique = false;
  while (!isUnique) {
    const existing = await prisma.ppdbRegistration.findUnique({
      where: { noPendaftaran }
    });
    if (!existing) {
      isUnique = true;
    } else {
      noPendaftaran = generateNoPendaftaran();
    }
  }

  const result = await prisma.ppdbRegistration.create({
    data: {
      ...data,
      noPendaftaran,
      tanggalLahir: new Date(data.tanggalLahir),
    }
  });

  return result;
};
