'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowUpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FooterLink {
  name: string;
  url: string;
}

interface OperatingHour {
  day: string;
  time: string;
  status: 'BUKA' | 'LIBUR';
}

interface FooterSettings {
  school: {
    logoUrl?: string;
    title: string;
    subtitle: string;
    description: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
  quickLinks: FooterLink[];
  operatingHours: OperatingHour[];
  other: {
    copyright: string;
    credit: string;
    showSocialIcons: boolean;
    showOperatingHours: boolean;
  };
}

const DEFAULT_FOOTER: FooterSettings = {
  school: {
    logoUrl: '',
    title: 'MTs Al-Yakin',
    subtitle: 'Madrasah Tsanawiyah',
    description: 'Membangun generasi cerdas berakhlak mulia dengan pendidikan yang memadukan keunggulan akademik dan nilai-nilai luhur Al-Qur\'an.'
  },
  contact: {
    address: 'Jl. Raya Pendidikan No. 45, Kecamatan Madani, Jawa Timur 12345',
    phone: '(021) 1234 5678',
    email: 'info@mtsalyakin.sch.id',
    whatsapp: '6281234567890',
    instagram: '#',
    facebook: '#',
    youtube: '#',
    twitter: '#'
  },
  quickLinks: [
    { name: 'Profil Sekolah', url: '/profil' },
    { name: 'Berita & Update', url: '/berita' },
    { name: 'Galeri Foto', url: '/galeri' },
    { name: 'Pendaftaran PPDB', url: '/ppdb' },
    { name: 'Layanan Konsultasi', url: '/konsultasi' }
  ],
  operatingHours: [
    { day: 'Senin - Jumat', time: '07.00 - 16.00', status: 'BUKA' },
    { day: 'Sabtu', time: '07.00 - 12.00', status: 'BUKA' },
    { day: 'Minggu', time: '-', status: 'LIBUR' }
  ],
  other: {
    copyright: '© 2024 MTs Al-Yakin. Crafted for Excellence.',
    credit: 'Dibuat dengan ❤️ oleh Tim IT MTs Al-Yakin',
    showSocialIcons: true,
    showOperatingHours: true
  }
};

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings>(DEFAULT_FOOTER);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/settings/footer`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setSettings({
            school: { ...DEFAULT_FOOTER.school, ...res.data.school },
            contact: { ...DEFAULT_FOOTER.contact, ...res.data.contact },
            quickLinks: res.data.quickLinks || DEFAULT_FOOTER.quickLinks,
            operatingHours: res.data.operatingHours || DEFAULT_FOOTER.operatingHours,
            other: { ...DEFAULT_FOOTER.other, ...res.data.other }
          });
        }
      })
      .catch(err => console.error('Failed to fetch footer settings:', err));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 text-gray-400 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-900/10 rounded-full blur-[120px] -ml-64 -mb-64" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="group flex items-center gap-3">
              {settings.school.logoUrl ? (
                <img src={settings.school.logoUrl} className="w-12 h-12 object-contain" alt="Logo" />
              ) : (
                <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-green-600/30 group-hover:rotate-12 transition-transform duration-500">
                  {settings.school.title?.substring(0, 1) || 'A'}
                </div>
              )}
              <div>
                <span className="block text-xl font-black tracking-tight leading-none text-white">
                  {settings.school.title}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-100/50">
                  {settings.school.subtitle}
                </span>
              </div>
            </Link>
            <p className="text-gray-500 leading-relaxed font-medium">
              {settings.school.description}
            </p>
            {settings.other.showSocialIcons && (
              <div className="flex gap-4">
                {[
                  { icon: Facebook, href: settings.contact.facebook },
                  { icon: Instagram, href: settings.contact.instagram },
                  { icon: Twitter, href: settings.contact.twitter },
                  { icon: Youtube, href: settings.contact.youtube },
                ].map((social, i) => {
                  if (!social.href || social.href === '#') return null;
                  const isUrl = social.href.startsWith('http') || social.href.startsWith('//');
                  const finalHref = isUrl ? social.href : `https://${social.href}`;
                  return (
                    <Link 
                      key={i} 
                      href={finalHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all active:scale-90"
                    >
                      <social.icon size={20} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Informasi</h4>
            <ul className="space-y-4">
              {settings.quickLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.url} className="font-bold hover:text-green-500 transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 scale-0 group-hover:scale-100 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Hubungi Kami</h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-green-500 shrink-0">
                  <MapPin size={20} />
                </div>
                <span className="font-medium text-sm leading-relaxed whitespace-pre-line">
                  {settings.contact.address}
                </span>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-green-500 shrink-0">
                  <Phone size={20} />
                </div>
                <span className="font-medium text-sm">{settings.contact.phone}</span>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-green-500 shrink-0">
                  <Mail size={20} />
                </div>
                <span className="font-medium text-sm">{settings.contact.email}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Jam Operasional ATAU Newsletter / CTA */}
          {settings.other.showOperatingHours ? (
            <div className="space-y-8">
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Jam Operasional</h4>
              <div className="space-y-4 bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
                {settings.operatingHours.map((h, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">{h.day}</span>
                    <span className={`font-black uppercase text-xs ${h.status === 'BUKA' ? 'text-green-500' : 'text-red-500'}`}>
                      {h.status === 'BUKA' ? h.time : 'Libur'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/50 p-8 rounded-[2rem] border border-gray-800 relative group overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-white font-black text-lg mb-4">Ingin tahu lebih lanjut?</h4>
                <p className="text-sm text-gray-500 font-medium mb-6">Jangan lewatkan informasi terbaru seputar kegiatan dan prestasi sekolah kami.</p>
                <Link 
                  href="/kontak" 
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  Hubungi Kami Sekarang
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-green-600/10 transition-colors" />
            </div>
          )}
        </div>

        <div className="pt-12 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
            {settings.other.copyright} {settings.other.credit}
          </p>
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-gray-500 hover:text-white transition-colors"
          >
            <span className="text-xs font-black uppercase tracking-widest">Kembali ke Atas</span>
            <ArrowUpCircle className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
