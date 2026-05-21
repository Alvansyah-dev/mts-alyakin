// app/ppdb/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import SectionBanner from '@/components/ui/SectionBanner';
import { 
  ClipboardCheck, 
  Search, 
  Info, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText,
  HelpCircle,
  PhoneCall,
  UserCheck,
  ChevronDown,
  Lock,
  DollarSign,
  Users
} from 'lucide-react';
import RegistrationForm from '@/components/ppdb/RegistrationForm';
import StatusChecker from '@/components/ppdb/StatusChecker';
import { get } from '@/lib/api';

const fetcher = async (url: string) => {
  if (url === '/api/settings/ppdb') {
    const { getSettings } = await import('@/lib/firestore');
    return getSettings('ppdb');
  }
  return get(url).then(res => res?.data || res);
};

const DEFAULT_STEPS = [
  { icon: '📝', title: 'Lengkapi Data', description: 'Isi formulir pendaftaran online dengan data yang benar.' },
  { icon: '📂', title: 'Verifikasi', description: 'Tim kami akan memverifikasi berkas yang telah Anda unggah.' },
  { icon: '✅', title: 'Ujian Masuk', description: 'Ikuti tes seleksi akademik dan wawancara sesuai jadwal.' },
  { icon: '📢', title: 'Daftar Ulang', description: 'Lakukan daftar ulang untuk konfirmasi sebagai siswa baru.' }
];

const DEFAULT_REQUIREMENTS = [
  'Lulus SD/MI atau sederajat',
  'Fotokopi Ijazah/SKL (3 lembar)',
  'Fotokopi Kartu Keluarga (2 lembar)',
  'Fotokopi Akta Kelahiran (2 lembar)',
  'Pas Foto 3x4 (4 lembar)',
  'Mengisi formulir pendaftaran online/offline'
];

const DEFAULT_FAQS = [
  {
    question: 'Kapan pendaftaran terakhir gelombang 2?',
    answer: 'Pendaftaran gelombang 2 ditutup sesuai dengan batas waktu yang ditentukan. Pastikan Anda sudah mengunggah berkas sebelum tanggal tersebut.'
  },
  {
    question: 'Apakah ada tes masuk?',
    answer: 'Ya, ada tes seleksi yang meliputi baca tulis Al-Qur\'an (BTQ) dan wawancara dasar untuk mengenal potensi siswa.'
  },
  {
    question: 'Bagaimana cara cek status pendaftaran?',
    answer: 'Anda dapat menggunakan fitur "Cek Status" di halaman ini dengan memasukkan Nomor Pendaftaran atau NIK yang digunakan saat mendaftar.'
  }
];

export default function PPDBPage() {
  const { data: ppdbSettings, isLoading } = useSWR('/api/settings/ppdb', fetcher);
  const [activeTab, setActiveTab] = useState<'info' | 'register' | 'status'>('info');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isOpen = ppdbSettings?.isOpen !== false;
  const academicYear = ppdbSettings?.academicYear || '2024/2025';
  const quota = ppdbSettings?.quota || 100;
  const registrationFee = ppdbSettings?.registrationFee !== undefined ? ppdbSettings.registrationFee : 0;
  
  const steps = Array.isArray(ppdbSettings?.steps) ? ppdbSettings.steps : DEFAULT_STEPS;
  const requirements = Array.isArray(ppdbSettings?.requirements) ? ppdbSettings.requirements : DEFAULT_REQUIREMENTS;
  const docs = Array.isArray(ppdbSettings?.requiredDocuments) ? ppdbSettings.requiredDocuments : [
    { name: 'FC Akta Kelahiran', note: '3 Lembar' },
    { name: 'FC Kartu Keluarga', note: '3 Lembar' },
    { name: 'Pas Foto 3x4', note: '4 Lembar' }
  ];
  const faqItems = Array.isArray(ppdbSettings?.faq) ? ppdbSettings.faq : DEFAULT_FAQS;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-24 font-inter transition-colors duration-300">
      {/* Page Hero */}
      <SectionBanner
        title="PPDB Online"
        subtitle={`Penerimaan Peserta Didik Baru (PPDB) MTs Al-Yakin Tahun Pelajaran ${academicYear}. Dapatkan pendidikan berkualitas dengan nuansa islami yang modern dan berkarakter.`}
        backgroundImage={ppdbSettings?.bannerPhoto || null}
        breadcrumb={`PPDB Tahun Pelajaran ${academicYear}`}
      >
        {/* Tab Navigation */}
        <div className="mt-12 flex flex-wrap justify-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl shadow-green-900/20 dark:shadow-none border border-white/20 max-w-2xl mx-auto backdrop-blur-md bg-white/90 dark:bg-gray-800/90">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-8 py-4 rounded-[1.8rem] font-bold transition-all text-sm uppercase tracking-wider ${
              activeTab === 'info'
                ? 'bg-green-600 text-white shadow-xl shadow-green-600/30'
                : 'text-gray-500 hover:text-green-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <Info size={18} />
            Informasi
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-8 py-4 rounded-[1.8rem] font-bold transition-all text-sm uppercase tracking-wider ${
              activeTab === 'register'
                ? 'bg-green-600 text-white shadow-xl shadow-green-600/30'
                : 'text-gray-500 hover:text-green-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <FileText size={18} />
            Pendaftaran
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center gap-2 px-8 py-4 rounded-[1.8rem] font-bold transition-all text-sm uppercase tracking-wider ${
              activeTab === 'status'
                ? 'bg-green-600 text-white shadow-xl shadow-green-600/30'
                : 'text-gray-500 hover:text-green-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <Search size={18} />
            Cek Status
          </button>
        </div>
      </SectionBanner>

      {/* Content Area */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <AnimatePresence mode="wait">
          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-20"
            >
              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Syarat Pendaftaran Card */}
                <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border border-slate-100 dark:border-gray-700 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl transition-all duration-500 group flex flex-col">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-8 shrink-0 group-hover:scale-105 transition-transform">
                    <ClipboardCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 leading-tight">Syarat Calon Siswa</h3>
                  <ul className="space-y-4 flex-grow">
                    {requirements.map((item: any, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-gray-400 text-sm font-medium">
                        <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                        <span>{typeof item === 'string' ? item : item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dokumen Persyaratan Card */}
                <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border border-slate-100 dark:border-gray-700 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl transition-all duration-500 group flex flex-col">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8 shrink-0 group-hover:scale-105 transition-transform">
                    <FileText size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 leading-tight">Berkas Persyaratan</h3>
                  <ul className="space-y-4 flex-grow">
                    {docs.map((doc: any, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-gray-400 text-sm font-medium">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-gray-800 dark:text-gray-200">{doc.name}</p>
                          {doc.note && <p className="text-xs text-slate-400 dark:text-gray-500">{doc.note}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Biaya & Kuota Card */}
                <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border border-slate-100 dark:border-gray-700 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl transition-all duration-500 group flex flex-col">
                  <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-8 shrink-0 group-hover:scale-105 transition-transform">
                    <DollarSign size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 leading-tight">Biaya & Kuota</h3>
                  <div className="space-y-6 flex-grow">
                    <div className="p-4 bg-slate-50 dark:bg-gray-900/50 rounded-2xl border border-slate-100 dark:border-gray-800">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Uang Pendaftaran</p>
                      <p className="text-2xl font-black text-green-600">
                        {registrationFee === 0 ? 'GRATIS' : `Rp ${registrationFee.toLocaleString('id-ID')}`}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-gray-900/50 rounded-2xl border border-slate-100 dark:border-gray-800">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kuota Terbatas</p>
                      <p className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Users size={18} className="text-amber-500" />
                        {quota} Calon Siswa
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-gray-900/50 rounded-2xl border border-slate-100 dark:border-gray-800">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status Pendaftaran</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mt-1 ${
                        isOpen 
                          ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`} />
                        {isOpen ? 'Dibuka' : 'Ditutup'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alur Pendaftaran */}
              <div className="bg-white dark:bg-gray-800 rounded-[4rem] p-16 md:p-24 border border-slate-100 dark:border-gray-700 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 dark:bg-green-900/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-20 text-center relative z-10 tracking-tight">Alur Pendaftaran Online</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 relative z-10">
                  {steps.map((step: any, idx: number) => (
                    <div key={idx} className="relative text-center space-y-4 group">
                      <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto shadow-xl shadow-green-600/30 border-[6px] border-slate-50 dark:border-gray-950 group-hover:scale-105 transition-transform">
                        {step.icon || (idx + 1)}
                      </div>
                      <h4 className="text-lg font-black text-gray-900 dark:text-white leading-tight">{step.title}</h4>
                      <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed font-medium">{step.description || step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-8 lg:sticky lg:top-32">
                  <div className="inline-flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-[0.2em]">
                    <HelpCircle size={20} />
                    Frequently Asked Questions
                  </div>
                  <h2 className="text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                    Ada <span className="text-green-600">Pertanyaan?</span> <br /> Kami Siap Membantu
                  </h2>
                  <p className="text-slate-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
                    Jangan ragu untuk menghubungi panitia PPDB kami jika Anda memerlukan bantuan lebih lanjut mengenai pendaftaran.
                  </p>
                  <div className="pt-6">
                    <a href="https://wa.me/628123456789" className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 px-10 py-5 rounded-[2rem] font-bold text-gray-900 dark:text-white hover:bg-slate-50 transition-all shadow-xl shadow-slate-100 dark:shadow-none group">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all text-green-600 shrink-0">
                        <PhoneCall size={22} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 dark:text-gray-500 uppercase tracking-widest font-black">Hubungi Kami</p>
                        <p className="text-lg">0812-3456-7890</p>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="space-y-6">
                  {faqItems.map((faq: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
                      <h4 className="text-lg font-black text-gray-900 dark:text-white mb-4 leading-tight">{faq.question || faq.q}</h4>
                      <p className="text-slate-500 dark:text-gray-400 leading-relaxed font-medium text-base">{faq.answer || faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-[4rem] p-8 md:p-20 border border-slate-100 dark:border-gray-700 shadow-2xl relative overflow-hidden"
            >
              <div className="max-w-4xl mx-auto relative z-10">
                {!isOpen ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                      <Lock size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Pendaftaran Ditutup</h2>
                    <p className="text-slate-500 dark:text-gray-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                      Mohon maaf, pendaftaran peserta didik baru untuk periode ini saat ini sedang ditutup atau kuota telah terpenuhi. Silakan hubungi admin sekolah.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-16">
                      <div className="w-20 h-20 bg-green-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-600/30">
                        <UserCheck size={40} />
                      </div>
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Formulir Pendaftaran</h2>
                      <p className="text-slate-500 dark:text-gray-400 text-lg font-medium">Silakan lengkapi biodata calon siswa dengan teliti.</p>
                    </div>
                    <RegistrationForm />
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'status' && (
            <motion.div
              key="status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-[4rem] p-16 md:p-24 border border-slate-100 dark:border-gray-700 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-green-600" />
                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <Search size={48} />
                </div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">Cek Status Pendaftaran</h2>
                <p className="text-slate-500 dark:text-gray-400 mb-16 max-w-xl mx-auto text-lg font-medium leading-relaxed">
                  Masukkan Nomor Pendaftaran atau NIK calon siswa untuk melihat status terbaru proses seleksi.
                </p>
                <div className="bg-slate-50 dark:bg-gray-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-gray-800">
                  <StatusChecker />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
