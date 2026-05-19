// app/galeri/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionBanner from '@/components/ui/SectionBanner';
import { ZoomIn, AlertCircle, ImageIcon } from 'lucide-react';
import Lightbox from '@/components/galeri/Lightbox';
import { Gallery } from '@/types';
import { SkeletonImage } from '@/components/ui/LoadingSkeleton';

const CATEGORIES = ['Semua', 'Kegiatan Sekolah', 'Prestasi', 'Fasilitas', 'Belajar Mengajar', 'Ekskul'];

const DEFAULT_GALLERY: Gallery[] = [
  {
    id: '1',
    title: 'Upacara Bendera Hari Senin',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    category: 'Kegiatan Sekolah',
    description: 'Upacara bendera rutin dilaksanakan setiap hari Senin untuk meningkatkan kedisiplinan dan rasa nasionalisme siswa.',
    isPublic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Pembelajaran di Laboratorium Komputer',
    imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80',
    category: 'Belajar Mengajar',
    description: 'Siswa MTs Al-Yakin melakukan praktek teknologi informasi di laboratorium komputer yang lengkap.',
    isPublic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Juara 1 Lomba Pidato Bahasa Arab',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    category: 'Prestasi',
    description: 'Siswa MTs Al-Yakin meraih peringkat pertama dalam ajang kejuaraan pidato tingkat provinsi.',
    isPublic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Kegiatan Ekstrakurikuler Pramuka',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    category: 'Ekskul',
    description: 'Pendidikan karakter dan kemandirian siswa melalui latihan rutin pramuka setiap hari Sabtu.',
    isPublic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Wisuda Tahfidz Al-Qur\'an',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    category: 'Kegiatan Sekolah',
    description: 'Apresiasi kepada para hafiz/hafizah siswa MTs Al-Yakin yang menyelesaikan target hafalan juz.',
    isPublic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Studi Banding & Karya Wisata',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    category: 'Kegiatan Sekolah',
    description: 'Kegiatan edukatif di luar kelas untuk memperluas wawasan dan pengalaman praktis siswa.',
    isPublic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Fasilitas Laboratorium IPA',
    imageUrl: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=800&q=80',
    category: 'Fasilitas',
    description: 'Praktikum biologi dan fisika menggunakan alat peraga dan mikroskop modern di Laboratorium IPA.',
    isPublic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Kegiatan Sholat Dhuha Berjamaah',
    imageUrl: 'https://images.unsplash.com/photo-1597935258735-e254c1839512?auto=format&fit=crop&w=800&q=80',
    category: 'Belajar Mengajar',
    description: 'Pembiasaan ibadah sunnah sholat dhuha berjamaah setiap pagi di Masjid sekolah.',
    isPublic: true,
    createdAt: new Date().toISOString(),
  }
];

export default function GaleriPage() {
  const [category, setCategory] = useState('Semua');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<Gallery[]>(DEFAULT_GALLERY);
  const [loading, setLoading] = useState(true);
  const [bannerPhoto, setBannerPhoto] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/settings/homepage`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data?.gallery?.backgroundImage) {
          setBannerPhoto(res.data.gallery.backgroundImage);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Construct query parameters
    const queryParams = new URLSearchParams({
      limit: '100',
      isPublic: 'true',
    });
    if (category !== 'Semua') {
      queryParams.append('category', category);
    }

    fetch(`${apiUrl}/api/gallery?${queryParams.toString()}`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setData(res.data);
        } else {
          const filtered = category === 'Semua' 
            ? DEFAULT_GALLERY 
            : DEFAULT_GALLERY.filter(item => item.category === category);
          setData(filtered);
        }
      })
      .catch(() => {
        const filtered = category === 'Semua' 
          ? DEFAULT_GALLERY 
          : DEFAULT_GALLERY.filter(item => item.category === category);
        setData(filtered);
      })
      .finally(() => setLoading(false));
  }, [category]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    if (data.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }
  };

  const prevImage = () => {
    if (data.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
    }
  };

  return (
    <main className="pb-20 font-inter">
      {/* Page Hero */}
      <SectionBanner
        title="Galeri Foto MTs Al-Yakin"
        subtitle="Momen-momen berharga dan kegiatan menarik di lingkungan sekolah."
        breadcrumb="Dokumentasi Visual"
        backgroundImage={bannerPhoto}
      />

      <div className="container mx-auto px-4 max-w-7xl mt-10">
        {/* Filter Categories */}
        <div className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar justify-start md:justify-center space-x-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-black transition-all ${
                category === cat 
                  ? 'bg-green-600 text-white shadow-md scale-105' 
                  : 'bg-bg-subtle text-text-secondary hover:bg-bg-subtle/80 border border-border hover:scale-105'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 masonry-grid">
            {[...Array(9)].map((_, i) => (
              <SkeletonImage key={i} className={`rounded-xl mb-6 ${i % 2 === 0 ? 'h-64' : 'h-80'}`} />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-32 bg-bg-subtle rounded-2xl border border-border">
            <div className="bg-white dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ImageIcon className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Belum ada foto di galeri</h3>
            <p className="text-text-secondary">Tidak ditemukan foto untuk kategori "{category}".</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative overflow-hidden rounded-xl group cursor-pointer break-inside-avoid border border-gray-150 dark:border-gray-800"
                onClick={() => openLightbox(index)}
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <ZoomIn className="text-white w-8 h-8 mb-3" />
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-green-100 text-sm line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Lightbox 
        images={data} 
        currentIndex={currentIndex} 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </main>
  );
}
