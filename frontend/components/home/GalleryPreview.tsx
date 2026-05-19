'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ArrowRight, X, Camera, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Gallery } from '../../types';
import Modal from '@/components/ui/Modal';

const DEFAULT_GALLERY: Gallery[] = [
  {
    id: '1',
    title: 'Upacara Bendera Hari Senin',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    category: 'Kegiatan',
    description: 'Upacara bendera rutin dilaksanakan setiap hari Senin untuk meningkatkan kedisiplinan dan rasa nasionalisme siswa.',
    isPublic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Pembelajaran di Laboratorium Komputer',
    imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80',
    category: 'Akademik',
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
    category: 'Kegiatan',
    description: 'Apresiasi kepada para hafiz/hafizah siswa MTs Al-Yakin yang menyelesaikan target hafalan juz.',
    isPublic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Studi Banding & Karya Wisata',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    category: 'Kegiatan',
    description: 'Kegiatan edukatif di luar kelas untuk memperluas wawasan dan pengalaman praktis siswa.',
    isPublic: true,
    createdAt: new Date().toISOString(),
  }
];

export default function GalleryPreview({ settings }: { settings?: any }) {
  const [data, setData] = useState<Gallery[]>(DEFAULT_GALLERY);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  const showSection = settings?.showSection !== false;
  const title = settings?.title || 'Galeri Kegiatan \nSiswa & Guru';
  const subtitle = settings?.subtitle || 'Dokumentasi kegiatan, prestasi, dan kebersamaan di MTs Al-Yakin.';
  const buttonText = settings?.buttonText || 'Lihat Semua Galeri';
  const buttonUrl = settings?.url || '/galeri';

  useEffect(() => {
    setMounted(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/gallery?limit=6&isPublic=true`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setData(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!mounted) return null;
  if (!showSection) return null;

  const hasBg = !!settings?.backgroundImage;

  return (
    <section 
      className={`py-24 overflow-hidden font-inter border-y border-transparent dark:border-gray-900 relative ${
        hasBg ? 'text-white' : 'bg-gray-50 dark:bg-gray-800'
      }`}
      style={hasBg ? {
        backgroundImage: `url(${settings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      } : {}}
    >
      {hasBg && <div className="absolute inset-0 bg-black/65 z-0" />}
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4 ${
                hasBg ? 'bg-white/10 backdrop-blur-md text-white border border-white/10' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
              Dokumentasi
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-4xl md:text-5xl font-black leading-tight tracking-tight whitespace-pre-line ${
                hasBg ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}
            >
              {title}
            </motion.h2>
            {subtitle && (
              <p className={`mt-4 text-lg font-medium leading-relaxed ${
                hasBg ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {subtitle}
              </p>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href={buttonUrl} 
              className={`inline-flex items-center gap-2 font-bold hover:gap-3 transition-all group ${
                hasBg ? 'text-white hover:text-green-300' : 'text-green-600 dark:text-green-400'
              }`}
            >
              {buttonText} 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="aspect-square bg-white dark:bg-gray-900 animate-pulse rounded-[2.5rem] border border-gray-100 dark:border-gray-700" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-8 text-center"
              >
                <Camera size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
                {index === 2 && (
                  <p className="text-gray-400 dark:text-gray-550 font-black uppercase tracking-wider text-xs">Belum ada foto</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.slice(0, 6).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-900 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-green-600/10 group-hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center opacity-50 bg-white dark:bg-gray-900">
                      <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-700" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                        {item.category || 'Kegiatan'}
                      </span>
                      <h4 className="text-white font-bold text-xl leading-tight">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {/* Zoom Icon */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 border border-white/20">
                    <ZoomIn className="text-white w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        className="max-w-4xl p-0 bg-transparent shadow-none overflow-visible border-none"
      >
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-16 right-0 text-white hover:text-green-400 p-2 transition-colors z-50 flex items-center gap-2 font-bold"
              >
                <span>Tutup</span>
                <X size={32} />
              </button>
              
              <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="aspect-video relative">
                  <img 
                    src={selectedImage.imageUrl} 
                    alt={selectedImage.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      {selectedImage.category || 'Kegiatan'}
                    </span>
                  </div>
                </div>
                <div className="p-10 bg-white dark:bg-gray-900">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {selectedImage.title}
                  </h3>
                  {selectedImage.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                      {selectedImage.description}
                    </p>
                  )}
                  {!selectedImage.description && (
                    <p className="text-gray-500 dark:text-gray-400 text-lg italic">
                      Dokumentasi kegiatan MTs Al-Yakin.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </section>
  );
}
