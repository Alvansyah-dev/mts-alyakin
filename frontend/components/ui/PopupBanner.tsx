'use client';

// components/ui/PopupBanner.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useSWR from 'swr';
import { get } from '@/lib/api';
import Button from './Button';
import Link from 'next/link';

const fetcher = (url: string) => get(url).then(res => res.data);

export default function PopupBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [neverShow, setNeverShow] = useState(false);
  
  const { data: rawBannerSetting } = useSWR('/api/settings/popup_settings', fetcher);

  const bannerSetting = rawBannerSetting ? {
    enabled: rawBannerSetting.isEnabled !== undefined ? rawBannerSetting.isEnabled : rawBannerSetting.enabled,
    title: rawBannerSetting.title,
    content: rawBannerSetting.content,
    imageUrl: rawBannerSetting.imageUrl,
    buttonText: rawBannerSetting.ctaText || rawBannerSetting.buttonText,
    buttonUrl: rawBannerSetting.ctaUrl || rawBannerSetting.buttonUrl
  } : null;

  useEffect(() => {
    // Check session storage first
    const hideBanner = sessionStorage.getItem('hidePopupBanner') === 'true';
    const neverShowLocal = localStorage.getItem('neverShowPopupBanner') === 'true';
    
    if (hideBanner || neverShowLocal) {
      setIsVisible(false);
      return;
    }

    // If banner is enabled in settings, show it after a delay
    if (bannerSetting?.enabled) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // 3 seconds delay
      return () => clearTimeout(timer);
    }
  }, [bannerSetting]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hidePopupBanner', 'true');
    if (neverShow) {
      localStorage.setItem('neverShowPopupBanner', 'true');
    }
  };

  if (!bannerSetting?.enabled || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Popup Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-bg-primary rounded-2xl shadow-2xl overflow-hidden border border-border"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {bannerSetting.imageUrl && (
              <div className="w-full h-48 sm:h-56 relative overflow-hidden bg-bg-subtle">
                <img 
                  src={bannerSetting.imageUrl} 
                  alt={bannerSetting.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <h2 className="text-2xl font-heading font-bold text-text-primary mb-3">
                {bannerSetting.title || 'Informasi Penting'}
              </h2>
              
              <p className="text-text-secondary mb-6 leading-relaxed">
                {bannerSetting.content || 'Ada informasi terbaru dari MTs Al-Yakin.'}
              </p>

              <div className="flex flex-col space-y-4">
                {bannerSetting.buttonText && bannerSetting.buttonUrl && (
                  <Button asChild className="w-full justify-center">
                    <Link href={bannerSetting.buttonUrl} onClick={handleClose}>
                      {bannerSetting.buttonText}
                    </Link>
                  </Button>
                )}
                
                <label className="flex items-center space-x-2 cursor-pointer text-sm text-text-muted hover:text-text-primary transition-colors">
                  <input
                    type="checkbox"
                    checked={neverShow}
                    onChange={(e) => setNeverShow(e.target.checked)}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span>Jangan tampilkan pesan ini lagi</span>
                </label>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
