// app/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error('Global Error Boundary caught an error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-heading font-bold text-text-primary mb-3">
          Oops! Terjadi Kesalahan
        </h1>
        
        <p className="text-text-secondary mb-8 leading-relaxed">
          Maaf, terjadi kesalahan sistem yang tidak terduga saat memuat halaman ini. Tim kami telah diberitahu.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => reset()} 
            icon={<RefreshCcw className="w-4 h-4" />}
          >
            Coba Lagi
          </Button>
          <Button 
            variant="outline" 
            asChild
            icon={<Home className="w-4 h-4" />}
          >
            <a href="/">Kembali ke Beranda</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
