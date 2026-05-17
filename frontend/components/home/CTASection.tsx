'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';
import { get } from '@/lib/api';

const fetcher = (url: string) => get(url).then(res => res.data);

export default function CTASection({ settings }: { settings?: any }) {
  const { data: siteSettings } = useSWR('/api/settings', fetcher);
  
  const waSetting = siteSettings?.find((s: any) => s.key === 'whatsapp');
  const waNumber = waSetting?.value?.number || '6281234567890';
  const waMessage = waSetting?.value?.defaultMessage || 'Halo admin MTs Al-Yakin, saya ingin bertanya tentang informasi pendaftaran.';
  
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const title = settings?.title || 'Mulai Perjalanan Masa Depan \nPutra-Putri Anda Sekarang.';
  const subtitle = settings?.subtitle || 'Wujudkan impian pendidikan terbaik dengan nilai karakter Islami yang kuat dan prestasi gemilang.';
  const button1Text = settings?.button1Text || 'Daftar PPDB Online';
  const button1Url = settings?.button1Url || '/ppdb';
  const button2Text = settings?.button2Text || 'Tanya via WhatsApp';
  const button2Url = settings?.button2Url || waLink;

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[3rem] bg-green-600 dark:bg-green-900/40 border border-green-500/20 shadow-2xl shadow-green-600/20">
          {/* Decorative Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[100px] -ml-48 -mb-48" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="relative z-10 px-8 py-20 md:py-32 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest mb-8 border border-white/20"
            >
              <Sparkles size={14} />
              Kesempatan Terbatas
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1] max-w-4xl mx-auto whitespace-pre-line"
            >
              {title}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-green-50 text-lg md:text-2xl mb-14 max-w-2xl mx-auto leading-relaxed font-medium opacity-90"
            >
              {subtitle}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-6"
            >
              <Link 
                href={button1Url}
                className="w-full sm:w-auto bg-white text-green-700 hover:bg-green-50 px-12 py-6 rounded-2xl font-black text-xl shadow-2xl shadow-black/10 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {button1Text}
                <ArrowRight size={24} />
              </Link>
              
              <a 
                href={button2Url} 
                target={button2Url.startsWith('http') ? "_blank" : undefined} 
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white px-12 py-6 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {button2Text}
                <MessageCircle size={24} />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

