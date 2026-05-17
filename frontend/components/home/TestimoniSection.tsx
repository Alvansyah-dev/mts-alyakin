'use client';

import { motion } from 'framer-motion';
import { Quote, Star, User } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ahmad Faisal',
    role: 'Alumni 2020',
    content: 'Pendidikan di MTs Al-Yakin sangat berkesan. Bukan hanya ilmu dunia yang saya dapatkan, tapi juga bekal agama yang kuat untuk kehidupan.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Siti Aminah',
    role: 'Wali Murid',
    content: 'Alhamdulillah, sejak anak saya bersekolah di sini, banyak perubahan positif. Guru-gurunya sangat perhatian dan lingkungan sekolahnya agamis.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Budi Santoso',
    role: 'Siswa Kelas IX',
    content: 'Fasilitas belajarnya lengkap dan ekstrakurikulernya seru. Saya bisa mengembangkan minat saya di bidang olahraga dan tetap fokus hafalan Qur\'an.',
    rating: 5,
  },
];

export default function TestimoniSection({ settings }: { settings?: any }) {
  const items = settings?.items || [
    {
      name: 'Ahmad Faisal',
      role: 'Alumni 2020',
      quote: 'Pendidikan di MTs Al-Yakin sangat berkesan. Bukan hanya ilmu dunia yang saya dapatkan, tapi juga bekal agama yang kuat untuk kehidupan.',
      rating: 5,
    },
    {
      name: 'Siti Aminah',
      role: 'Wali Murid',
      quote: 'Alhamdulillah, sejak anak saya bersekolah di sini, banyak perubahan positif. Guru-gurunya sangat perhatian dan lingkungan sekolahnya agamis.',
      rating: 5,
    },
    {
      name: 'Budi Santoso',
      role: 'Siswa Kelas IX',
      quote: 'Fasilitas belajarnya lengkap dan ekstrakurikulernya seru. Saya bisa mengembangkan minat saya di bidang olahraga dan tetap fokus hafalan Qur\'an.',
      rating: 5,
    },
  ];

  return (
    <section className="py-32 bg-white dark:bg-gray-900 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100/50 dark:bg-green-900/10 rounded-full blur-[100px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-[100px] -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-widest mb-6"
          >
            <Quote size={14} />
            Testimoni
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter"
          >
            Suara <span className="text-green-600 dark:text-green-400">Komunitas</span> Kami
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((t: any, index: number) => {
            const rating = t.rating || 5;
            const text = t.quote || t.content || '';
            const photo = t.photo || '';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-green-600/10 flex flex-col h-full">
                  <div className="flex gap-1 mb-8">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-12 flex-grow font-medium italic">
                    "{text}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-8 border-t border-gray-100 dark:border-gray-700">
                    {photo ? (
                      <img 
                        src={photo} 
                        alt={t.name} 
                        className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-md group-hover:rotate-6 transition-transform" 
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-green-600 dark:bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-600/20 group-hover:rotate-6 transition-transform">
                        <User size={24} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white text-lg leading-none mb-1">{t.name}</h4>
                      <p className="text-green-600 dark:text-green-400 text-sm font-bold uppercase tracking-wider">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

