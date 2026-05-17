'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ArrowRight, X, Camera, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Gallery } from '../../types';
import Modal from '@/components/ui/Modal';

export default function GalleryPreview({ settings }: { settings?: any }) {
  const [data, setData] = useState<Gallery[]>([]);
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
        if (res.success) {
          setData(res.data || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!mounted) return null;
  if (!showSection) return null;

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800 overflow-hidden font-inter border-y border-transparent dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-widest mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
              Dokumentasi
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tight whitespace-pre-line"
            >
              {title}
            </motion.h2>
            {subtitle && (
              <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg font-medium leading-relaxed">
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
              className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-bold hover:gap-3 transition-all group"
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
