'use client';

import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Users, Award, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection({ settings }: { settings?: any }) {
  const badgeText = settings?.badge || '🏫 Madrasah Terakreditasi A';
  const title = settings?.title || 'Cerdas, Beradab, \nBermanfaat.';
  const subtitle = settings?.subtitle || 'Selamat datang di MTs Al-Yakin. Kami berkomitmen membentuk karakter islami yang unggul dalam ilmu pengetahuan dan berakhlak mulia.';
  const button1Text = settings?.button1Text || 'Daftar PPDB 2024';
  const button1Url = settings?.button1Url || '/ppdb';
  const button2Text = settings?.button2Text || 'Eksplorasi Profil';
  const button2Url = settings?.button2Url || '/profil';
  const backgroundImage = settings?.backgroundImage || '';

  const bgStyle = settings?.backgroundImage 
    ? {
        backgroundImage: `url(${settings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  const bgClass = settings?.backgroundImage
    ? '' 
    : 'bg-gradient-to-br from-green-700 via-green-600 to-emerald-500';

  return (
    <section 
      className={`relative min-h-screen flex items-center overflow-hidden pt-20 ${bgClass}`}
      style={bgStyle}
    >
      {/* Overlay gelap HANYA jika ada foto */}
      {settings?.backgroundImage && (
        <div className="absolute inset-0 bg-black/55 z-0" />
      )}
      
      {/* Jika tidak ada foto, pakai overlay pattern dekoratif & gradient */}
      {!settings?.backgroundImage && (
        <>
          <div className="absolute inset-0 bg-[#064e3b] z-0" />
          <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 opacity-90 z-0" />
          
          {/* Dynamic Glows */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] -mr-96 -mt-96 z-0" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-[100px] -ml-64 -mb-64 z-0" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="absolute inset-0 opacity-10 z-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} 
          />
        </>
      )}
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-2xl"
            >
              <Sparkles size={14} className="text-green-300" />
              {badgeText}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter whitespace-pre-line"
            >
              {title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-green-50 text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed font-medium opacity-90"
            >
              {subtitle}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              <Link 
                href={button1Url} 
                className="group relative px-10 py-5 bg-white text-green-700 font-black rounded-2xl shadow-2xl hover:shadow-white/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-green-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10">{button1Text}</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <Link 
                href={button2Url} 
                className="px-10 py-5 bg-transparent border-2 border-white/30 text-white font-black rounded-2xl hover:bg-white/10 transition-all active:scale-95 flex items-center gap-3 backdrop-blur-sm"
              >
                {button2Text}
              </Link>
            </motion.div>


            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 flex items-center gap-4 text-white/60 text-sm font-bold"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-green-700 bg-green-800 flex items-center justify-center text-[10px]">
                    <User size={14} />
                  </div>
                ))}
              </div>
              <span>Bergabung dengan 500+ alumni sukses</span>
            </motion.div>
          </div>

          {/* Right Side: Visuals */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="space-y-6 pt-12">
                <StatCard icon={<GraduationCap />} value="500+" label="Alumni" color="bg-blue-500" />
                <StatCard icon={<Users />} value="250+" label="Siswa Aktif" color="bg-emerald-500" />
              </div>
              <div className="space-y-6">
                <StatCard icon={<Award />} value="12+" label="Penghargaan" color="bg-amber-500" />
                <StatCard icon={<BookOpen />} value="18+" label="Ekskul" color="bg-indigo-500" />
              </div>

              {/* Decorative Floating Card */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-4 md:-right-10 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl border border-white dark:border-gray-800 z-20 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">Terakreditasi A</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">BAN-S/M 2023</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
    </section>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode, value: string, label: string, color: string }) {
  return (
    <div className="group relative bg-white/10 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/20 dark:border-gray-700/50 p-8 rounded-[2.5rem] shadow-2xl hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-500 cursor-default">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
        {icon}
      </div>
      <div className="text-4xl font-black text-white dark:text-white mb-2 tracking-tight">{value}</div>
      <div className="text-green-100 dark:text-green-200 text-xs font-black uppercase tracking-widest opacity-60">{label}</div>
    </div>
  );
}

function User({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
