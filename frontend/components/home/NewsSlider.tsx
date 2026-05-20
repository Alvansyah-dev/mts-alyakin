'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { News } from '../../types';

const DEFAULT_NEWS: News[] = [];

export default function NewsSlider({ settings }: { settings?: any }) {
  const [data, setData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const showSection = settings?.showSection !== false;
  const title = settings?.title || 'Jendela Informasi \nTerpercaya.';
  const subtitle = settings?.subtitle || 'Dapatkan informasi terkini seputar kegiatan dan pengumuman sekolah.';
  const buttonText = settings?.buttonText || 'Semua Berita';
  const buttonUrl = settings?.buttonUrl || '/berita';

  useEffect(() => {
    setMounted(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/news?limit=6&status=PUBLISHED`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setData(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const nextSlide = () => {
    if (data && data.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }
  };

  const prevSlide = () => {
    if (data && data.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
    }
  };

  useEffect(() => {
    if (!isHovered && data && data.length > 1) {
      timerRef.current = setInterval(nextSlide, 6000);
    }
    return () => clearInterval(timerRef.current);
  }, [isHovered, data, currentIndex]);

  // Safe bounds check
  useEffect(() => {
    if (data.length > 0 && currentIndex >= data.length) {
      setCurrentIndex(0);
    }
  }, [data, currentIndex]);

  const currentItem = data[currentIndex] || data[0] || DEFAULT_NEWS[0];

  if (!mounted) return null;
  if (!showSection) return null;

  if (loading) {
    return (
      <section className="py-32 bg-gray-50 dark:bg-gray-800 overflow-hidden font-inter border-y border-transparent dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="aspect-[21/9] min-h-[500px] md:min-h-[600px] bg-white dark:bg-gray-900 animate-pulse rounded-[3rem] border border-gray-200 dark:border-gray-700" />
        </div>
      </section>
    );
  }

  if (data.length === 0) {
    return (
      <section className="py-32 bg-gray-50 dark:bg-gray-800 overflow-hidden font-inter border-y border-transparent dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-widest mb-6">
                <Newspaper size={14} />
                Warta Sekolah
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter whitespace-pre-line">
                {title}
              </h2>
            </div>
          </div>
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700">
            <Newspaper size={64} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Belum ada berita</h3>
            <p className="text-gray-500 dark:text-gray-400">Warta dan pengumuman sekolah belum tersedia.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-gray-50 dark:bg-gray-800 overflow-hidden font-inter border-y border-transparent dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-widest mb-6"
            >
              <Newspaper size={14} />
              Warta Sekolah
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter whitespace-pre-line"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-600 dark:text-gray-300 mt-4 text-base font-medium max-w-lg"
            >
              {subtitle}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href={buttonUrl} 
              className="group flex items-center gap-4 bg-white dark:bg-gray-900 hover:bg-green-600 px-8 py-4 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-600 dark:hover:border-green-400"
            >
              <span className="text-gray-900 dark:text-white font-black group-hover:text-white transition-colors">{buttonText}</span>
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all">
                <ArrowRight size={20} className="text-green-600 dark:text-green-400 group-hover:text-green-600" />
              </div>
            </Link>
          </motion.div>
        </div>

        <div 
          className="relative group/slider"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-[21/9] min-h-[500px] md:min-h-[600px] overflow-hidden rounded-[3rem] shadow-2xl shadow-green-600/5 border border-gray-100 dark:border-gray-700">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                {currentItem.thumbnail || currentItem.imageUrl ? (
                  <img 
                    src={currentItem.thumbnail || currentItem.imageUrl} 
                    alt={currentItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-600 to-emerald-950 flex items-center justify-center">
                    <Newspaper size={80} className="text-white opacity-20" />
                  </div>
                )}
                
                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 via-transparent to-transparent hidden md:block" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="max-w-4xl"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-green-600/30">
                        {currentItem.category || 'Update'}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-300 font-bold">
                        <Calendar size={16} className="text-green-400" />
                        {formatDate(currentItem.publishedAt || currentItem.createdAt)}
                      </div>
                    </div>
                    <h3 className="text-3xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
                      {currentItem.title}
                    </h3>
                    {currentItem.excerpt && (
                      <p className="text-gray-300 mb-10 line-clamp-2 text-lg md:text-xl max-w-2xl font-medium leading-relaxed opacity-85">
                        {currentItem.excerpt}
                      </p>
                    )}
                    <Link 
                      href={`/berita/${currentItem.slug || currentItem.id}`}
                      className="inline-flex items-center gap-3 bg-white text-gray-900 hover:bg-green-600 hover:text-white font-black px-10 py-5 rounded-2xl transition-all shadow-2xl active:scale-95"
                    >
                      Baca Selengkapnya
                      <ArrowRight size={20} />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {data.length > 1 && (
              <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex gap-4 z-20">
                <button 
                  onClick={prevSlide}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-2xl active:scale-90"
                >
                  <ChevronLeft size={28} />
                </button>
                <button 
                  onClick={nextSlide}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-2xl active:scale-90"
                >
                  <ChevronRight size={28} />
                </button>
              </div>
            )}

            {/* Progress Bar */}
            {data.length > 1 && (
              <div className="absolute bottom-0 left-0 h-1.5 bg-white/10 w-full z-20">
                <motion.div 
                  key={currentIndex}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className="h-full bg-green-500"
                />
              </div>
            )}
          </div>

          {/* Indicators */}
          {data.length > 1 && (
            <div className="flex justify-center gap-3 mt-12">
              {data.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === currentIndex 
                      ? 'w-12 bg-green-600 dark:bg-green-400' 
                      : 'w-2 bg-gray-200 dark:bg-gray-700 hover:bg-green-200 dark:hover:bg-green-900'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
