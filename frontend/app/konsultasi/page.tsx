'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import SectionBanner from '@/components/ui/SectionBanner';
import { 
  MessageSquare, 
  HelpCircle, 
  Loader2, 
  Filter, 
  Search,
  Users,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { get } from '@/lib/api';
import QuestionThread from '@/components/konsultasi/QuestionThread';
import QuestionForm from '@/components/konsultasi/QuestionForm';
import { Consultation } from '@/types';
import Button from '@/components/ui/Button';

const fetcher = (url: string) => get(url).then(res => res.data);

const CATEGORIES = ['Semua', 'Akademik', 'PPDB', 'Fasilitas', 'Umum'];

export default function KonsultasiPage() {
  const [category, setCategory] = useState('Semua');
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const limit = 10;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-time fetching every 30 seconds
  const { data: consultations, error, isLoading, mutate } = useSWR<Consultation[]>(
    mounted ? `/api/consultation?isPublic=true&isModerated=true&isHidden=false&limit=${limit * page}${category !== 'Semua' ? `&category=${category}` : ''}` : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  const handleSuccessSubmit = () => {
    setTimeout(() => mutate(), 1000);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Page Hero */}
      <SectionBanner
        title="Pusat Informasi & Diskusi Interaktif"
        subtitle="Ajukan pertanyaan Anda seputar MTs Al-Yakin. Kami siap membantu memberikan solusi dan informasi yang akurat secara transparan."
        breadcrumb="Layanan Konsultasi Publik"
      />

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Sidebar: Form & Stats */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-1 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-800">
              <QuestionForm onSuccess={handleSuccessSubmit} />
            </div>

            {/* Stats Card */}
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <Users size={20} className="text-green-600" />
                Statistik Komunitas
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Diskusi Selesai', value: '1,240+', color: 'text-green-600' },
                  { label: 'Rata-rata Respon', value: ' < 4 Jam', color: 'text-emerald-600' },
                  { label: 'Pencarian Populer', value: 'PPDB 2024', color: 'text-blue-600' }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</span>
                    <span className={`text-sm font-black ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-green-600 rounded-[3rem] p-10 text-white shadow-xl shadow-green-600/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <HelpCircle size={40} className="mb-6 text-green-200" />
              <h3 className="text-xl font-bold mb-4">Butuh Respon Cepat?</h3>
              <p className="text-green-50 text-sm leading-relaxed mb-8 opacity-90 font-medium">
                Admin kami aktif pada jam kerja (Senin - Sabtu, 07.00 - 15.00 WIB). Pertanyaan diluar jam tersebut akan dijawab pada hari berikutnya.
              </p>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-fit">
                <Clock size={14} />
                Aktif: 07.00 - 15.00
              </div>
            </div>
          </div>

          {/* Right Content: Discussions */}
          <div className="lg:col-span-8">
            {/* Elegant Filter System */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-3 p-1.5 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 w-full md:w-auto overflow-x-auto hide-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`px-8 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                      category === cat 
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-6 py-3 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
                <Filter size={16} className="text-green-600" />
                Urutkan: Terbaru
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isLoading && page === 1 ? (
                 <motion.div 
                   key="loading"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="space-y-8"
                 >
                   {[...Array(3)].map((_, i) => (
                     <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[3rem] p-12 h-64 animate-pulse shadow-sm"></div>
                   ))}
                 </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-24 bg-red-50 dark:bg-red-900/10 rounded-[3rem] border border-red-100 dark:border-red-900/30"
                >
                  <p className="text-red-600 dark:text-red-400 font-bold text-xl">Gagal memuat diskusi.</p>
                  <button onClick={() => mutate()} className="mt-6 text-red-700 dark:text-red-300 underline font-medium">Coba lagi</button>
                </motion.div>
              ) : !Array.isArray(consultations) || consultations.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                  <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <MessageSquare size={48} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Belum ada diskusi</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-sm mx-auto leading-relaxed">
                    Jadilah yang pertama bertanya untuk kategori <span className="text-green-600 font-bold">{category}</span>.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {consultations.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <QuestionThread consultation={item} />
                    </motion.div>
                  ))}
                  
                  {Array.isArray(consultations) && consultations.length >= limit * page && (
                    <div className="text-center pt-8">
                      <button 
                        onClick={() => setPage(p => p + 1)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-12 py-5 rounded-2xl font-black text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-xl shadow-gray-200/40 dark:shadow-none group"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Muat Lebih Banyak
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  );
}
