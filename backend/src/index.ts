import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import newsRoutes from './routes/news.routes';
import galleryRoutes from './routes/gallery.routes';
import ppdbRoutes from './routes/ppdb.routes';
import consultationRoutes from './routes/consultation.routes';
import announcementRoutes from './routes/announcement.routes';
import settingsRoutes from './routes/settings.routes';
import contactRoutes from './routes/contact.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: (origin: string | undefined, 
            callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const frontendUrl = process.env.FRONTEND_URL;
    const isLocalhost = /^http:\/\/localhost(:\d+)?$/.test(origin);
    const isVercelSubdomain = /\.vercel\.app$/.test(origin);
    const isAllowedCustomDomain = frontendUrl && (origin === frontendUrl || origin.replace(/\/$/, '') === frontendUrl.replace(/\/$/, ''));

    if (isLocalhost || isVercelSubdomain || isAllowedCustomDomain) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { 
    success: false, 
    message: 'Terlalu banyak request, coba lagi nanti' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Khusus upload, beri limit lebih longgar
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
});

app.use('/api/', limiter);
app.use('/api/upload', uploadLimiter);

// Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/ppdb', ppdbRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'MTs Al-Yakin API is running' });
});

// Error Handler Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
