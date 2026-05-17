import { Router } from 'express'
import multer from 'multer'
import { verifyToken } from '../middleware/auth.middleware'
import { uploadImage, deleteImage } from '../services/cloudinary.service'
import * as fs from 'fs'
import * as os from 'os'

const router = Router()

// Multer config - simpan ke folder temp OS (untuk mendukung serverless /tmp)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = os.tmpdir()
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

const fileFilter = (req: any, file: any, cb: any) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Format file tidak didukung'), false)
  }
}

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

// POST /api/upload/image
router.post('/image', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tidak ada file yang diupload' 
      })
    }

    const folder = (req.body.folder as string) || 'general'
    
    // Upload ke Cloudinary
    const result = await uploadImage(req.file.path, folder)
    
    // Hapus file temp
    fs.unlinkSync(req.file.path)
    
    return res.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height
      }
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    // Hapus file temp jika ada error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Gagal upload gambar' 
    })
  }
})

// DELETE /api/upload/:publicId
router.delete('/:publicId', verifyToken, async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId)
    await deleteImage(publicId)
    res.json({ success: true, message: 'Gambar berhasil dihapus' })
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Gagal hapus gambar' 
    })
  }
})

export default router
