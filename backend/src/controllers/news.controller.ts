// src/controllers/news.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient, NewsStatus } from '@prisma/client';
import { success, error } from '../utils/response';
import { deleteImage } from '../services/cloudinary.service';

const prisma = new PrismaClient();

export const getNews = async (req: Request, res: Response) => {
  try {
    const { 
      page = '1', 
      limit = '9', 
      category, 
      status,
      search 
    } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: any = {}
    
    // Jika tidak ada token (public request), 
    // hanya tampilkan PUBLISHED
    const authHeader = req.headers.authorization
    if (!authHeader) {
      where.status = 'PUBLISHED'
    } else if (status) {
      where.status = status
    }
    
    if (category && category !== 'SEMUA') {
      where.category = category
    }
    
    if (search) {
      where.title = { 
        contains: search as string,
        mode: 'insensitive'
      }
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.news.count({ where })
    ])

    return res.json({
      success: true,
      data: news,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      pagination: {
        totalItems: total,
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        limit: limitNum,
      }
    })
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

export const getNewsBySlug = async (req: Request, res: Response) => {
  try {
    const news = await prisma.news.findFirst({
      where: { 
        slug: req.params.slug,
        status: 'PUBLISHED'
      }
    })
    
    if (!news) {
      return res.status(404).json({ 
        success: false, 
        message: 'Berita tidak ditemukan' 
      })
    }
    
    // Increment view
    await prisma.news.update({
      where: { id: news.id },
      data: { views: { increment: 1 } }
    })
    
    return res.json({ success: true, data: news })
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

export const getNewsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const news = await prisma.news.findUnique({ where: { id } });

    if (!news) return error(res, 'Berita tidak ditemukan', 404);

    return success(res, news, 'Berhasil mengambil berita');
  } catch (err) {
    next(err);
  }
};

export const createNews = async (req: Request, res: Response) => {
  console.log('=== CREATE NEWS ===')
  console.log('Body:', JSON.stringify(req.body, null, 2))
  console.log('Admin:', req.admin)
  
  try {
    const { title, slug, content, excerpt, thumbnail,
            cloudinaryId, category, status, publishedAt } = req.body
    
    // Validasi wajib
    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Judul wajib diisi' 
      })
    }
    
    // Auto slug jika tidak ada
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
    
    // Cek slug unik
    const existing = await prisma.news.findUnique({
      where: { slug: finalSlug }
    })
    
    if (existing) {
      // Tambahkan timestamp jika slug sudah ada
      const uniqueSlug = `${finalSlug}-${Date.now()}`
      req.body.slug = uniqueSlug
    }
    
    const news = await prisma.news.create({
      data: {
        title,
        slug: existing ? `${finalSlug}-${Date.now()}` : finalSlug,
        content: content || '',
        excerpt: excerpt || '',
        thumbnail: thumbnail || '',
        cloudinaryId: cloudinaryId || '',
        category: category || 'UMUM',
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' 
          ? new Date() : null,
        views: 0,
      }
    })
    
    console.log('News created:', news.id)
    
    return res.status(201).json({ 
      success: true, 
      data: news,
      message: 'Berita berhasil disimpan'
    })
  } catch (error: any) {
    console.error('Create news error:', error)
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

export const updateNews = async (req: Request, res: Response) => {
  console.log('=== UPDATE NEWS ===')
  console.log('Body:', JSON.stringify(req.body, null, 2))
  console.log('Params:', req.params)
  console.log('Admin:', req.admin)
  
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, thumbnail,
            cloudinaryId, category, status, publishedAt } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ success: false, message: 'ID berita wajib diisi' });
    }
    
    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }

    let finalSlug = existingNews.slug;
    if ((title && title !== existingNews.title) || (slug && slug !== existingNews.slug)) {
      const targetSlug = slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
      finalSlug = targetSlug;
      
      const checkSlug = await prisma.news.findFirst({
        where: { slug: finalSlug, id: { not: id } }
      });
      if (checkSlug) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }
    }

    const news = await prisma.news.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingNews.title,
        slug: finalSlug,
        content: content !== undefined ? content : existingNews.content,
        excerpt: excerpt !== undefined ? excerpt : existingNews.excerpt,
        thumbnail: thumbnail !== undefined ? thumbnail : existingNews.thumbnail,
        cloudinaryId: cloudinaryId !== undefined ? cloudinaryId : existingNews.cloudinaryId,
        category: category !== undefined ? category : existingNews.category,
        status: status !== undefined ? status : existingNews.status,
        publishedAt: status === 'PUBLISHED'
          ? (existingNews.publishedAt || new Date())
          : (status === 'DRAFT' ? null : existingNews.publishedAt),
      },
    });

    console.log('News updated:', news.id)

    return res.status(200).json({ 
      success: true, 
      data: news,
      message: 'Berita berhasil diupdate'
    })
  } catch (error: any) {
    console.error('Update news error:', error)
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

export const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) return error(res, 'Berita tidak ditemukan', 404);

    if (news.cloudinaryId) {
      await deleteImage(news.cloudinaryId).catch(console.error);
    }

    await prisma.news.delete({ where: { id } });
    return success(res, null, 'Berita berhasil dihapus');
  } catch (err) {
    next(err);
  }
};

export const incrementViews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const news = await prisma.news.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return success(res, { views: news.views }, 'Views berhasil ditambahkan');
  } catch (err) {
    next(err);
  }
};
