// src/routes/news.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import * as newsController from '../controllers/news.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const createNewsSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  thumbnail: z.string().optional(),
  cloudinaryId: z.string().optional(),
  category: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  publishedAt: z.string().datetime().optional(),
});

const updateNewsSchema = createNewsSchema.partial();

// Public routes
// Optionally apply custom auth check without throwing error if no token
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

router.get('/', optionalAuth, newsController.getNews);
router.get('/slug/:slug', optionalAuth, newsController.getNewsBySlug);
router.post('/:id/view', newsController.incrementViews);

// Protected routes
router.get('/:id', verifyToken, newsController.getNewsById);
router.post('/', verifyToken, validate(createNewsSchema), newsController.createNews);
router.put('/:id', verifyToken, validate(updateNewsSchema), newsController.updateNews);
router.delete('/:id', verifyToken, newsController.deleteNews);

export default router;
