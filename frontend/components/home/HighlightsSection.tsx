'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HighlightsSection({ settings }: { settings?: any }) {
  const items = settings?.items || [
    { title: 'Kurikulum Modern', description: 'Memadukan nilai agama dan ilmu pengetahuan umum.', icon: '📚' },
    { title: 'Fasilitas Lengkap', description: 'Laboratorium, perpustakaan, dan sarana olahraga modern.', icon: '🏫' },
    { title: 'Pengajar Berpengalaman', description: 'Guru yang kompeten dan berdedikasi tinggi.', icon: '👨‍🏫' },
    { title: 'Eskul Variatif', description: 'Berbagai pilihan ekstrakurikuler untuk bakat siswa.', icon: '🏀' },
    { title: 'Tahfidz Qur\'an', description: 'Program hafalan Al-Qur\'an intensif.', icon: '📖' },
    { title: 'Lingkungan Islami', description: 'Budaya sekolah yang kental dengan nilai keislaman.', icon: '🌙' }
  ];

  const getCardLink = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('fasilitas')) return '/profil#fasilitas';
    if (t.includes('kurikulum')) return '/profil';
    if (t.includes('pengajar') || t.includes('guru')) return '/profil#guru';
    return '/profil';
  };

  return (
    <section className="py-32 relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -ml-64 -mb-64" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-green-100 dark:border-green-800/50"
          >
            <Sparkles size={14} />
            Standar Pendidikan Tinggi
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter leading-[1.1]"
          >
            Mengapa Memilih <br />
            <span className="text-green-600 dark:text-green-400">MTs Al-Yakin?</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed"
          >
            Kami berkomitmen memberikan pengalaman pendidikan terbaik yang melampaui batas ruang kelas tradisional.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: any, index: number) => {
            const href = getCardLink(item.title);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group h-full"
              >
                <Link href={href} className="block h-full">
                  <div className="relative z-10 h-full p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-green-200 dark:hover:border-green-700 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="bg-green-50 dark:bg-green-900/30 rounded-2xl p-4 w-16 h-16 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors mb-6 text-3xl">
                        {item.icon || '✨'}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 tracking-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
