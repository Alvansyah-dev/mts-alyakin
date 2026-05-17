// app/berita/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionBanner from '@/components/ui/SectionBanner';
import { Search, Calendar, User, Eye, AlertCircle, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/LoadingSkeleton';
import { News } from '@/types';

const CATEGORIES = ['Semua', 'Akademik', 'Kegiatan', 'Pengumuman', 'Prestasi', 'Umum'];

const getCategoryColor = (category?: string) => {
  const norm = (category || 'UMUM').toUpperCase();
  const colors: Record<string, string> = {
    'AKADEMIK': 'bg-blue-100 text-blue-700',
    'KEGIATAN': 'bg-green-100 text-green-700',
    'PENGUMUMAN': 'bg-yellow-100 text-yellow-700',
    'PRESTASI': 'bg-purple-100 text-purple-700',
    'UMUM': 'bg-gray-100 text-gray-700',
  }
  return colors[norm] || colors['UMUM']
}

const getCategoryGradient = (category?: string) => {
  const norm = (category || 'UMUM').toUpperCase();
  const gradients: Record<string, string> = {
    'AKADEMIK': 'from-blue-500 to-blue-600',
    'KEGIATAN': 'from-green-500 to-green-600',
    'PENGUMUMAN': 'from-yellow-500 to-orange-500',
    'PRESTASI': 'from-purple-500 to-purple-600',
    'UMUM': 'from-gray-500 to-gray-600',
  }
  return gradients[norm] || gradients['UMUM']
}

export default function BeritaPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [page, setPage] = useState(1);
  const limit = 9;

  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [settings, setSettings] = useState<any>({
    header: {
      title: 'Berita & Informasi',
      subtitle: 'Dapatkan informasi terbaru seputar kegiatan, prestasi, dan pengumuman di MTs Al-Yakin.',
      bannerPhoto: ''
    }
  });

  const [categories, setCategories] = useState<string[]>(['Semua', 'Akademik', 'Kegiatan', 'Pengumuman', 'Prestasi', 'Umum']);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/settings/news_settings`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          if (res.data.header) {
            setSettings(res.data);
          }
          if (res.data.categories) {
            const activeCats = res.data.categories
              .filter((c: any) => c.isActive)
              .map((c: any) => c.name);
            setCategories(['Semua', ...activeCats]);
          }
        }
      })
      .catch(err => console.error('Failed to fetch news settings:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    
    // Construct query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: 'PUBLISHED',
    });
    if (search.trim()) {
      queryParams.append('search', search.trim());
    }
    if (category !== 'Semua') {
      queryParams.append('category', category);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/news?${queryParams.toString()}`)
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setNewsItems(res.data || []);
          setTotalPages(res.pagination?.totalPages || 1);
        } else {
          setError(true);
        }
      })
      .catch(err => {
        console.error('Failed to fetch news:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [search, category, page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset page on search
  };

  const handleCategory = (cat: string) => {
    setCategory(cat);
    setPage(1); // Reset page on category change
  };

  return (
    <main className="pb-20 font-inter">
      {/* Page Hero */}
      <SectionBanner
        title={settings?.header?.title || 'Berita & Informasi'}
        subtitle={settings?.header?.subtitle || 'Dapatkan informasi terbaru seputar kegiatan, prestasi, dan pengumuman di MTs Al-Yakin.'}
        backgroundImage={settings?.header?.bannerPhoto || null}
        breadcrumb="Portal Berita"
      />

      <div className="container mx-auto px-4 max-w-7xl mt-10">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar space-x-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-black transition-colors ${
                  category === cat 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-bg-subtle text-text-secondary hover:bg-bg-subtle/80 border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Cari berita..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-bg-card focus:outline-none focus:ring-2 focus:ring-accent/50 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-text-muted" />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} className="h-[400px]" />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Gagal memuat berita. Silakan coba lagi nanti.</p>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="text-center py-20 bg-bg-subtle rounded-2xl border border-border">
            <div className="bg-white dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Belum ada berita</h3>
            <p className="text-text-secondary">Tidak ditemukan berita untuk kategori atau pencarian ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={index === 0 && page === 1 ? 'md:col-span-2 lg:col-span-2' : ''}
              >
                <Link href={`/berita/${item.slug}`} key={item.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl 
                    overflow-hidden border border-gray-100 
                    dark:border-gray-700 shadow-sm 
                    hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                  
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden shrink-0">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover 
                          group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br 
                        ${getCategoryGradient(item.category)} 
                        flex items-center justify-center`}>
                        <span className="text-5xl">📰</span>
                      </div>
                    )}
                    {/* Category badge di atas gambar */}
                    <span className={`absolute top-3 left-3 
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-900 dark:text-white 
                      text-lg mb-2 line-clamp-2 
                      group-hover:text-green-600 dark:group-hover:text-green-400 
                      transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm 
                      line-clamp-2 mb-4 flex-grow">
                      {item.excerpt || item.content?.substring(0, 100) + '...'}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-gray-400">
                        {new Date(item.publishedAt || item.createdAt)
                          .toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                      </span>
                      <span className="text-green-600 dark:text-green-400 
                        text-sm font-bold flex items-center gap-1
                        group-hover:gap-2 transition-all">
                        Baca <span>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-md bg-card border border-border text-text-primary disabled:opacity-50 hover:bg-bg-subtle transition-colors"
            >
              Sebelumnya
            </button>
            <span className="px-4 py-2 flex items-center text-text-secondary">
              Halaman {page} dari {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-md bg-card border border-border text-text-primary disabled:opacity-50 hover:bg-bg-subtle transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
