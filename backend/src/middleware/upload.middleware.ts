// src/middleware/upload.middleware.ts
import multer from 'multer';

// Use memory storage for Cloudinary upload
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.') as any, false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});
