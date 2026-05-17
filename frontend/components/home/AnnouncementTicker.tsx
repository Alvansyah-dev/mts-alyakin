'use client';

import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import useSWR from 'swr';
import { get } from '@/lib/api';

const fetcher = (url: string) => get(url).then(res => res?.data || res);

const SAMPLE_ANNOUNCEMENTS = [
  { content: 'Penerimaan Peserta Didik Baru (PPDB) Tahun Pelajaran 2024/2025 telah dibuka! Daftar sekarang.' },
  { content: 'Selamat kepada ananda Muhammad Rifki atas Juara 1 Lomba Pidato Bahasa Arab tingkat Nasional.' },
  { content: 'Libur menyambut bulan suci Ramadhan dimulai dari tanggal 11 - 13 Maret 2024.' },
];

export default function AnnouncementTicker({ settings }: { settings?: any }) {
  const { data: apiAnnouncements } = useSWR('/api/announcements?isActive=true', fetcher);
  
  // Clean settings items to get active ones
  const settingsItems = settings?.items?.filter((item: any) => item.isActive) || [];
  
  const announcements = settingsItems.length > 0 
    ? settingsItems 
    : (apiAnnouncements && apiAnnouncements.length > 0 ? apiAnnouncements : SAMPLE_ANNOUNCEMENTS);

  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="bg-green-600 dark:bg-green-700 py-3 relative z-30 overflow-hidden shadow-xl">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-6">
        {/* Label */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white text-green-700 shadow-md shrink-0 z-10 relative">
          <Bell size={14} className="animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Pengumuman</span>
        </div>

        {/* Ticker Container */}
        <div className="flex-1 overflow-hidden relative flex items-center">
          <motion.div
            className="flex whitespace-nowrap gap-12"
            animate={{ x: [0, -1000] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 40,
            }}
          >
            {/* Double the content for seamless loop */}
            {[...announcements, ...announcements, ...announcements].map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 group cursor-default">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-white transition-colors" />
                <span className="text-sm font-bold text-white group-hover:text-green-100 transition-colors tracking-tight">
                  {item.text || item.content}
                </span>
              </div>
            ))}
          </motion.div>
          
          {/* Fade Gradients */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-green-600 dark:from-green-700 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-green-600 dark:from-green-700 to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
