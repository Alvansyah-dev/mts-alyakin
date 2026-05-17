'use client';

// components/ui/WhatsAppFloat.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useWhatsAppSettings } from '@/hooks/useFirestoreSettings';

interface WhatsAppFloatProps {
  overrideMessage?: string;
}

export default function WhatsAppFloat({ overrideMessage }: WhatsAppFloatProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();
  const settings = useWhatsAppSettings();

  // Show tooltip after 2 seconds automatically to draw attention
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);
    
    // Hide it after 6 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!settings || !settings.enabled || !settings.number) {
    return null;
  }

  // Determine which message to use based on path or override
  let message = settings.defaultMessage;
  if (overrideMessage) {
    message = overrideMessage;
  } else if (pathname === '/ppdb') {
    message = settings.ppdbMessage || message;
  } else if (pathname === '/konsultasi') {
    message = settings.konsultasiMessage || message;
  }

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${settings.number}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-full mr-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2 rounded-xl shadow-lg text-sm font-medium whitespace-nowrap border border-border pointer-events-none"
          >
            Hubungi Kami
            {/* Arrow */}
            <div className="absolute top-1/2 -mt-1.5 -right-1.5 w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-border transform -rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 1 // Delay appearance slightly
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
        className="relative group focus:outline-none"
        aria-label="Chat WhatsApp"
      >
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75 duration-1000"></div>
        <div className="absolute -inset-2 rounded-full border border-green-500 opacity-20 group-hover:animate-pulse"></div>
        
        {/* Main button */}
        <div className="relative w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-xl flex items-center justify-center text-white">
          <MessageCircle className="w-7 h-7" />
        </div>
      </motion.button>
    </div>
  );
}
