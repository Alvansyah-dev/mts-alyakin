'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const current = theme === 'system' ? systemTheme : theme;
  const isDark = current === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:border dark:border-gray-700 dark:hover:bg-gray-700 transition-colors duration-200"
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun size={18} className="text-yellow-400" />
        ) : (
          <Moon size={18} className="text-gray-700" />
        )}
      </motion.div>
    </button>
  );
}
