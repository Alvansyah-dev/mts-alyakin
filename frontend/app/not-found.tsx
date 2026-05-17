// app/not-found.tsx
import { SearchX, Home } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8 inline-block">
          <div className="text-9xl font-heading font-black text-slate-200 dark:text-slate-800 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl">
              <SearchX className="w-12 h-12 text-accent" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-4">
          Halaman Tidak Ditemukan
        </h1>
        
        <p className="text-text-secondary mb-8 leading-relaxed max-w-sm mx-auto">
          Maaf, halaman yang Anda cari mungkin telah dihapus, diubah namanya, atau memang tidak pernah ada.
        </p>

        <Button 
          asChild
          className="px-8 shadow-lg shadow-accent/20 hover:shadow-accent/40"
          icon={<Home className="w-4 h-4" />}
        >
          <a href="/">Kembali ke Beranda</a>
        </Button>
      </div>
    </div>
  );
}
