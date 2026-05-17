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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/settings/general`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data && res.data.identity) {
          setSettings(res.data);
        }
      })
      .catch(err => console.error('Failed to fetch general settings:', err));
  }, []);

  return (
    <nav
      className={`sticky top-0 inset-x-0 z-50 transition-all duration-300 border-b border-transparent ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-3 dark:border-gray-800' 
          : 'bg-white dark:bg-gray-900/95 backdrop-blur py-5 dark:border-gray-800'
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
          <span className="text-gray-900 dark:text-white tracking-tight">
            {settings.identity.siteName}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-bold transition-all hover:text-green-600 dark:hover:text-green-400 ${
                    pathname === link.href ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-300'
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
          className="md:hidden p-2 text-gray-600 dark:text-gray-300"
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
            className="md:hidden bg-white dark:bg-gray-900 overflow-hidden border-t dark:border-gray-800"
          >
            <ul className="px-6 py-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-lg font-bold hover:text-green-600 dark:hover:text-green-400 ${
                      pathname === link.href ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 mt-4 border-t dark:border-gray-800 flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white">Mode Gelap</span>
                <ThemeToggle />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
