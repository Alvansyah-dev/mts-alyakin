// src/routes/gallery.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import * as galleryController from '../controllers/gallery.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const createGallerySchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  cloudinaryId: z.string().optional(),
  category: z.string().min(1),
  isPublic: z.boolean().optional(),
});

const updateGallerySchema = createGallerySchema.partial().extend({
  order: z.number().int().optional(),
});

const reorderSchema = z.array(z.object({
  id: z.string().uuid(),
  order: z.number().int(),
}));

const optionalAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    import('jsonwebtoken').then(jwt => {
      try {
        req.admin = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      } catch (e) {}
      next();
    });
  } else {
    next();
  }
};

router.get('/', optionalAuth, galleryController.getGallery);

router.post('/', verifyToken, validate(createGallerySchema), galleryController.createGallery);
router.put('/reorder', verifyToken, validate(z.object({ body: reorderSchema }).passthrough()), galleryController.reorderGallery);
router.put('/:id', verifyToken, validate(updateGallerySchema), galleryController.updateGallery);
router.delete('/:id', verifyToken, galleryController.deleteGallery);

export default router;
