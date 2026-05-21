'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil' },
  { href: '/berita', label: 'Berita' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/ppdb', label: 'PPDB' },
  { href: '/konsultasi', label: 'Konsultasi' },
  { href: '/kontak', label: 'Kontak' },
];

const DEFAULT_SETTINGS = {
  identity: {
    siteName: 'MTs Al-Yakin',
    tagline: 'Mencetak Generasi Unggul dan Berakhlak Mulia',
    logoUrl: '',
    faviconUrl: ''
  }
};

import { getSettings } from '@/lib/firestore';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<any>(DEFAULT_SETTINGS);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings('general');
        if (data && data.identity) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to fetch general settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <nav
      className={`sticky top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200 dark:border-gray-750 shadow-sm py-3' 
          : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200 dark:border-gray-750 shadow-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          {settings.identity.logoUrl ? (
            <img src={settings.identity.logoUrl} className="w-10 h-10 object-contain" alt="Logo" />
          ) : (
            <span className="bg-green-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-green-600/20">
              {settings.identity.siteName?.substring(0, 1) || 'A'}
            </span>
          )}
          <span className="text-green-700 dark:text-green-400 font-bold tracking-tight">
            {settings.identity.siteName}
          </span>
        </Link>
 
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm transition-all hover:text-green-600 dark:hover:text-green-400 ${
                    pathname === link.href 
                      ? 'text-green-600 dark:text-green-400 font-semibold' 
                      : 'text-gray-700 dark:text-gray-200 font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
          <ThemeToggle />
        </div>
 
        <button
          className="md:hidden p-2 text-gray-700 dark:text-gray-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
 
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 overflow-hidden border-t border-gray-250 dark:border-gray-750"
          >
            <ul className="px-6 py-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-lg transition-all hover:text-green-600 dark:hover:text-green-400 ${
                      pathname === link.href 
                        ? 'text-green-600 dark:text-green-400 font-semibold' 
                        : 'text-gray-700 dark:text-gray-200 font-medium'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 mt-4 border-t border-gray-250 dark:border-gray-750 flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-white">Mode Gelap</span>
                <ThemeToggle />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
