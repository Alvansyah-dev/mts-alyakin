'use client';

// components/ui/Toast.tsx
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: ToastVariant;
  duration?: number; // ms
}

const variantClasses: Record<ToastVariant, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  error: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
};

export default function Toast({ isOpen, onClose, children, variant = 'info', duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn('fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg', variantClasses[variant])}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
