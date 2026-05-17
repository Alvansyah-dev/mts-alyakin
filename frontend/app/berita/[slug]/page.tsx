// app/berita/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Calendar, User, Eye, Share2, Link as LinkIcon, ChevronRight, Home, Facebook, Twitter, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { get, post } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { SkeletonText, SkeletonImage } from '@/components/ui/LoadingSkeleton';

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

const fetcher = (url: string) => get(url).then(res => res.data);

export default function BeritaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const { data: news, error, isLoading } = useSWR(slug ? `/api/news/slug/${slug}` : null, fetcher);
  const { data: relatedNews } = useSWR(
    news?.category ? `/api/news?limit=3&category=${news.category}&status=PUBLISHED` : null, 
    fetcher
  );

  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    // Increment view
    if (news?.id) {
      post(`/api/news/${news.id}/view`).catch(console.error);
    }
  }, [news?.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <SkeletonText height="2rem" width="60%" className="mb-4" />
        <SkeletonText height="1rem" width="40%" className="mb-8" />
        <SkeletonImage className="h-[400px] mb-8" />
        <div className="space-y-4">
          <SkeletonText height="1rem" />
          <SkeletonText height="1rem" />
          <SkeletonText height="1rem" width="80%" />
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-2xl max-w-md mx-auto border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Berita Tidak Ditemukan</h2>
          <p className="text-red-600/80 dark:text-red-400/80 mb-6">Berita yang Anda cari mungkin telah dihapus atau URL tidak valid.</p>
          <Link href="/berita" className="text-accent hover:underline font-medium">
            &larr; Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
    );
  }

  const shareTitle = encodeURIComponent(news.title);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter out current news from related
  const filteredRelated = relatedNews?.filter((n: any) => n.id !== news.id).slice(0, 3) || [];

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent transform origin-left z-50"
        style={{ scaleX }}
      />
      <main className="pb-20">
        {/* Breadcrumbs */}
        <div className="bg-bg-subtle border-b border-border py-4">
          <div className="container mx-auto px-4 max-w-4xl flex items-center text-sm text-text-secondary overflow-x-auto whitespace-nowrap hide-scrollbar">
            <Link href="/" className="hover:text-accent flex items-center"><Home className="w-3.5 h-3.5 mr-1" /> Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2" />
            <Link href="/berita" className="hover:text-accent">Berita</Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2" />
            <span className="text-text-primary font-medium truncate max-w-[200px] sm:max-w-md">{news.title}</span>
          </div>
        </div>

        <article className="container mx-auto px-4 max-w-4xl mt-10">
          <header className="mb-8 text-center md:text-left">
            <Badge variant="info" className="mb-4">{news.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-text-primary leading-tight mb-6">
              {news.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start text-sm text-text-muted gap-y-2 gap-x-6 border-y border-border py-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span className="font-medium">{news.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(news.publishedAt || news.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                <span>{news.views || 0} dibaca</span>
              </div>
            </div>
          </header>

          <figure className="mb-10 h-64 md:h-[400px] overflow-hidden rounded-2xl shadow-md relative w-full">
            {news.thumbnail ? (
              <img 
                src={news.thumbnail} 
                alt={news.title}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br 
                ${getCategoryGradient(news.category)} 
                flex items-center justify-center rounded-2xl`}>
                <span className="text-7xl">📰</span>
              </div>
            )}
          </figure>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Share Sidebar */}
            <div className="md:w-16 shrink-0 flex md:flex-col gap-4 items-center order-2 md:order-1 border-t md:border-t-0 md:border-r border-border pt-6 md:pt-0 md:pr-6">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider md:-rotate-90 md:mb-6">Bagikan</span>
              <a 
                href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-200 transition-colors"
                aria-label="Share on WhatsApp"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <button 
                onClick={copyToClipboard}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors relative"
                aria-label="Copy link"
              >
                <LinkIcon className="w-5 h-5" />
                {copied && (
                  <span className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded">Tersalin!</span>
                )}
              </button>
            </div>

            {/* Content Body */}
            <div 
              className="prose prose-lg dark:prose-invert prose-green max-w-none order-1 md:order-2 flex-1"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>
        </article>

        {/* Related News */}
        {filteredRelated.length > 0 && (
          <section className="bg-bg-subtle py-16 mt-20 border-t border-border">
            <div className="container mx-auto px-4 max-w-6xl">
              <h3 className="text-2xl font-heading font-bold text-text-primary mb-8 border-l-4 border-accent pl-4">
                Berita Terkait
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredRelated.map((item: any, idx: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="h-full group">
                      <Link href={`/berita/${item.slug}`} className="block">
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={item.thumbnail || '/placeholder-news.jpg'} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-heading font-bold text-text-primary line-clamp-2 group-hover:text-accent transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-xs text-text-muted mt-2 block">{formatDate(item.publishedAt || item.createdAt)}</span>
                        </div>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
