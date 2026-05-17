// src/services/cloudinary.service.ts
import { v2 as cloudinary } from 'cloudinary';
import { env } from 'process';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(filePath: string, folder: string): Promise<{
  url: string
  publicId: string
  width: number
  height: number
}> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: `mts-alyakin/${folder}`,
    quality: 'auto',
    fetch_format: 'auto',
  })
  return { 
    url: result.secure_url, 
    publicId: result.public_id, 
    width: result.width, 
    height: result.height 
  }
}

export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error('Cloudinary Delete Error: ' + error);
  }
};
