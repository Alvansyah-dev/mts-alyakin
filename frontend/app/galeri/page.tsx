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

export default function GaleriPage() {
  const [category, setCategory] = useState('Semua');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

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
        if (res.success) {
          setData(res.data || []);
        }
      })
      .catch(console.error)
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
