import { Router, Request, Response, NextFunction } from 'express'
import { verifyToken } from '../middleware/auth.middleware'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET setting by key
router.get('/:key', async (req: Request, res: Response) => {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key: req.params.key }
    })
    res.json({ success: true, data: setting?.value || null })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// PUT update setting
router.put('/:key', verifyToken, async (req: Request, res: Response) => {
  try {
    const setting = await prisma.siteSettings.upsert({
      where: { key: req.params.key },
      update: { value: req.body },
      create: { key: req.params.key, value: req.body }
    })
    res.json({ success: true, data: setting.value })
  } catch (error) {
    console.error('Save setting error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router
