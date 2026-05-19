// app/profil/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionBanner from '@/components/ui/SectionBanner';
import { 
  Target, Eye, BookOpen, Monitor, Library, Trophy, 
  Users, School, Sparkles, Award, Star, GraduationCap,
  Building, MapPin, Calendar, Heart, Shield
} from 'lucide-react';

export default function ProfilPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/settings/profile`)
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setProfile(res.data || null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="py-40 text-center font-inter bg-slate-50/50 dark:bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-black uppercase tracking-wider text-xs">Memuat profil sekolah...</p>
        </div>
      </div>
    );
  }

  // General Settings
  const general = profile?.general || {
    schoolName: 'MTs Al-Yakin',
    tagline: 'Membentuk Generasi Cerdas, Berakhlak Mulia, dan Bertaqwa.',
    description: 'MTs Al-Yakin adalah lembaga pendidikan menengah tingkat madrasah tsanawiyah yang berdedikasi tinggi menyelenggarakan pendidikan unggulan berbasis karakter Islami.',
    bannerPhoto: null
  };

  // Visi & Misi
  const vision = profile?.visionMission?.vision || 'Mewujudkan insan yang bertaqwa, berakhlak mulia, cerdas, terampil, dan berwawasan lingkungan.';
  const missions = (profile?.visionMission?.mission && profile.visionMission.mission.length > 0) 
    ? profile.visionMission.mission 
    : [
        { text: 'Menyelenggarakan proses pembelajaran yang efektif dan Islami.' },
        { text: 'Membiasakan pengamalan nilai-nilai keagamaan dalam kehidupan sehari-hari.' },
        { text: 'Meningkatkan prestasi akademik dan non-akademik siswa.' },
        { text: 'Mengembangkan keterampilan teknologi informasi dan komunikasi.' }
      ];

  // Sejarah
  const historyContent = profile?.history?.content || 'MTs Al-Yakin didirikan dengan komitmen kuat untuk menyediakan pendidikan berkualitas yang memadukan kurikulum nasional dan nilai-nilai kepesantrenan. Sejak berdiri, sekolah ini terus melahirkan lulusan berprestasi.';
  const timelineItems = (profile?.history?.timeline && profile.history.timeline.length > 0)
    ? profile.history.timeline
    : [
        { year: '2010', title: 'Yayasan Didirikan', description: 'Cikal bakal MTs Al-Yakin dimulai dengan pendirian yayasan pendidikan.' },
        { year: '2012', title: 'Angkatan Pertama', description: 'Menerima pendaftaran siswa angkatan pertama dengan fasilitas mandiri.' },
        { year: '2018', title: 'Akreditasi A', description: 'Meraih nilai akreditasi A (Sangat Baik) dari Badan Akreditasi Nasional.' }
      ];

  // Fasilitas
  const facilitiesItems = (profile?.facilities?.items && profile.facilities.items.length > 0)
    ? profile.facilities.items
    : [
        { name: 'Laboratorium Komputer', description: 'Dilengkapi komputer modern dan koneksi internet super cepat.', icon: '💻' },
        { name: 'Perpustakaan Digital', description: 'Ribuan koleksi buku digital dan fisik untuk riset literatur siswa.', icon: '📖' },
        { name: 'Sarana Olahraga', description: 'Lapangan basket, futsal, dan bulutangkis yang luas.', icon: '🏀' },
        { name: 'Masjid Al-Yakin', description: 'Pusat ibadah, bimbingan takwa, dan kegiatan rohani islam.', icon: '🕌' }
      ];

  // Prestasi
  const achievementsItems = (profile?.achievements?.items && profile.achievements.items.length > 0)
    ? profile.achievements.items
    : [
        { year: '2023', category: 'Akademik', title: 'Juara 1 Olimpiade Matematika Kabupaten' },
        { year: '2023', category: 'Keagamaan', title: 'Juara Umum Musabaqah Tilawatil Qur\'an (MTQ)' }
      ];

  // Guru & Staff
  const teachersItems = (profile?.teachers?.items && profile.teachers.items.length > 0)
    ? profile.teachers.items
    : [
        { name: 'Drs. H. Ahmad Fauzi', gelar: 'M.Pd.', subject: 'Kepala Madrasah & Guru Akidah Akhlak', education: 'S2 Pendidikan' },
        { name: 'Siti Rahmawati', gelar: 'S.Pd.', subject: 'Guru Matematika', education: 'S1 Pendidikan Matematika' },
        { name: 'Rahmat Hidayat', gelar: 'S.Pd.I.', subject: 'Guru Bahasa Arab & Fiqih', education: 'S1 Sastra Arab' }
      ];

  // Struktur Organisasi
  const organizationItems = (profile?.organization?.items && profile.organization.items.length > 0)
    ? profile.organization.items
    : [
        { name: 'Drs. H. Ahmad Fauzi, M.Pd.', role: 'Kepala Madrasah', level: 1 },
        { name: 'Siti Rahmawati, S.Pd.', role: 'Waka Kurikulum', level: 2 },
        { name: 'Rahmat Hidayat, S.Pd.I.', role: 'Waka Kesiswaan', level: 2 }
      ];

  return (
    <main className="pb-20 font-inter bg-slate-50/50 dark:bg-gray-950 transition-colors duration-300">
      {/* Page Hero */}
      <SectionBanner
        title={general.schoolName}
        subtitle={general.tagline}
        backgroundImage={general.bannerPhoto || null}
        breadcrumb="Lembaga Pendidikan Islam"
      />

      <div className="container mx-auto px-6 max-w-7xl mt-24 space-y-32">
        
        {/* Visi & Misi */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-xl shadow-slate-100 dark:shadow-none border border-slate-100 dark:border-gray-800 flex flex-col justify-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-950 flex items-center justify-center text-green-600 dark:text-green-400 shadow-md">
                <Eye size={28} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Visi Sekolah</h2>
            </div>
            {vision ? (
              <p className="text-2xl md:text-3xl text-slate-800 dark:text-gray-200 font-extrabold italic leading-normal tracking-tight">
                "{vision}"
              </p>
            ) : (
              <p className="text-gray-400 italic">Visi sekolah belum diisi.</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-xl shadow-slate-100 dark:shadow-none border border-slate-100 dark:border-gray-800 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md">
                <Target size={28} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Misi Sekolah</h2>
            </div>
            {missions.length > 0 ? (
              <ul className="space-y-4 text-slate-600 dark:text-gray-400">
                {missions.map((m: any, idx: number) => (
                  <li key={idx} className="flex gap-4 items-start font-medium text-base md:text-lg">
                    <span className="w-6 h-6 rounded-full bg-green-50 dark:bg-green-950/50 border border-green-100 dark:border-green-800 flex items-center justify-center text-green-600 dark:text-green-400 font-black text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{m.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">Misi sekolah belum diisi.</p>
            )}
          </motion.div>
        </section>

        {/* Sejarah */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-widest mb-6">
              <Calendar size={14} />
              Napak Tilas
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Sejarah Singkat</h2>
            {historyContent ? (
              <p className="text-slate-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
                {historyContent}
              </p>
            ) : (
              <p className="text-gray-400 italic">Konten sejarah madrasah belum diisi.</p>
            )}
          </div>

          {timelineItems.length > 0 ? (
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] bg-slate-200 dark:bg-gray-800 h-full hidden md:block" />
              {timelineItems.map((item: any, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`mb-16 flex justify-between items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} flex-col`}
                >
                  <div className="hidden md:block w-5/12" />
                  <div className="z-20 flex items-center order-1 bg-green-600 text-white shadow-xl shadow-green-600/30 w-16 h-16 rounded-3xl mb-6 md:mb-0 transform hover:scale-110 transition-transform">
                    <h1 className="mx-auto font-black text-lg">{item.year}</h1>
                  </div>
                  <div className="order-1 w-full md:w-5/12 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-gray-800 shadow-xl shadow-slate-100/50 dark:shadow-none hover:-translate-y-1 transition-transform relative overflow-hidden group">
                    {item.photo && (
                      <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 relative">
                        <img src={item.photo} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <h3 className="font-black text-slate-900 dark:text-white text-2xl mb-3 tracking-tight group-hover:text-green-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-gray-400 text-base leading-relaxed font-medium">
                      {item.description || item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-gray-800 max-w-4xl mx-auto">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Garis waktu sejarah belum ditambahkan.</p>
            </div>
          )}
        </section>

        {/* Fasilitas */}
        <section className="bg-slate-100/40 dark:bg-gray-900/30 -mx-6 px-6 py-24 rounded-[3.5rem] border border-slate-100 dark:border-gray-900/50">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
              <Building size={14} />
              Sarana & Prasarana
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Fasilitas Unggulan</h2>
            <p className="text-slate-500 dark:text-gray-400 text-lg font-medium">
              Kami menyediakan lingkungan belajar yang representatif dengan sarana modern demi kenyamanan siswa.
            </p>
          </div>

          {facilitiesItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {facilitiesItems.map((fac: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-gray-800 shadow-xl shadow-slate-100/50 dark:shadow-none group hover:border-green-500 hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full overflow-hidden"
                >
                  {fac.photo ? (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 relative shrink-0">
                      <img src={fac.photo} alt={fac.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950 flex items-center justify-center text-green-600 dark:text-green-400 text-3xl mb-8 group-hover:rotate-6 transition-transform">
                      {fac.icon || '🏫'}
                    </div>
                  )}
                  <h3 className="font-black text-slate-900 dark:text-white text-xl mb-3 tracking-tight group-hover:text-green-600 transition-colors">{fac.name}</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-base leading-relaxed font-medium flex-grow">{fac.description || fac.desc}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-gray-800">
              <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Belum ada data fasilitas yang ditambahkan.</p>
            </div>
          )}
        </section>

        {/* Struktur Organisasi */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-widest mb-6">
              <Users size={14} />
              Manajemen
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Struktur Organisasi</h2>
            <p className="text-slate-500 dark:text-gray-400 text-lg font-medium">
              Pimpinan dan struktural manajemen pengelola lembaga pendidikan MTs Al-Yakin.
            </p>
          </div>

          {organizationItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {organizationItems.map((org: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white dark:bg-gray-900 text-center p-8 rounded-[2.5rem] border border-slate-100 dark:border-gray-800 shadow-xl shadow-slate-100/50 dark:shadow-none hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="w-28 h-28 mx-auto rounded-3xl overflow-hidden mb-6 relative shadow-inner">
                    {org.photo ? (
                      <img src={org.photo} alt={org.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center text-white text-3xl font-black">
                        {org.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-lg mb-1">{org.name}</h3>
                  <p className="text-green-600 dark:text-green-400 text-sm font-bold uppercase tracking-wider mb-2">{org.role}</p>
                  <span className="text-xs font-bold text-slate-400 dark:text-gray-500 bg-slate-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                    Level {org.level}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-gray-800">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Struktur organisasi belum diatur.</p>
            </div>
          )}
        </section>

        {/* Prestasi */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-widest mb-6">
              <Trophy size={14} />
              Kebanggaan Madrasah
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Prestasi Terkini</h2>
            <p className="text-slate-500 dark:text-gray-400 text-lg font-medium">
              Bukti nyata dedikasi dan keuletan civitas akademika dalam meraih kejuaraan di berbagai bidang.
            </p>
          </div>

          {achievementsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {achievementsItems.map((ach: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/50 dark:shadow-none border border-slate-100 dark:border-gray-800 group hover:border-amber-500 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                  <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-2xl mr-6 shrink-0 text-amber-600 dark:text-amber-400 group-hover:rotate-6 transition-transform">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-xs font-black bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 px-3 py-1 rounded-full uppercase tracking-wider">{ach.year}</span>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">{ach.category}</span>
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white text-xl leading-snug">{ach.title}</h3>
                    {ach.description && (
                      <p className="text-slate-500 dark:text-gray-400 text-sm mt-2 leading-relaxed font-medium">{ach.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-gray-800">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Belum ada prestasi yang ditambahkan.</p>
            </div>
          )}
        </section>

        {/* Data Guru */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
              <GraduationCap size={14} />
              Tenaga Pendidik
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Dewan Guru & Staff</h2>
            <p className="text-slate-500 dark:text-gray-400 text-lg font-medium">
              Didukung oleh tenaga pendidik yang kompeten, berdedikasi tinggi, dan berjiwa teladan Islami.
            </p>
          </div>

          {teachersItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teachersItems.map((teacher: any, index: number) => {
                const nameText = teacher.name || '';
                const displayInitials = nameText.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-white dark:bg-gray-900 text-center p-8 rounded-[2.5rem] border border-slate-100 dark:border-gray-800 shadow-xl shadow-slate-100/50 dark:shadow-none hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="w-28 h-28 mx-auto rounded-3xl overflow-hidden mb-6 relative shadow-inner">
                      {teacher.photo ? (
                        <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center text-white text-3xl font-black">
                          {displayInitials}
                        </div>
                      )}
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg mb-1 leading-tight group-hover:text-green-600 transition-colors">{teacher.name}{teacher.gelar ? `, ${teacher.gelar}` : ''}</h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">{teacher.subject}</p>
                    {teacher.education && (
                      <span className="text-[10px] font-black text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 border border-green-100/50 dark:border-green-900/30 px-3 py-1 rounded-full uppercase tracking-wider">
                        {teacher.education}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-gray-800">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Data dewan guru belum diisi.</p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
