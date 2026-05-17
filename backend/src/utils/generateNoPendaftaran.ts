// src/utils/generateNoPendaftaran.ts
export const generateNoPendaftaran = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `PPDB-${year}-${rand}`;
};
