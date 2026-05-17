// app/page.tsx
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import NewsSlider from '@/components/home/NewsSlider';
import AnnouncementTicker from '@/components/home/AnnouncementTicker';
import HighlightsSection from '@/components/home/HighlightsSection';
import GalleryPreview from '@/components/home/GalleryPreview';
import TestimoniSection from '@/components/home/TestimoniSection';
import CTASection from '@/components/home/CTASection';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'MTs Al-Yakin - Home',
  description: 'Selamat Datang di MTs Al-Yakin, sekolah Islam modern.',
};

async function getHomeSettings() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/settings/homepage`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch home settings:', error);
    return null;
  }
}

export default async function HomePage() {
  const homeSettings = await getHomeSettings();

  return (
    <main className="font-inter">
      <HeroSection settings={homeSettings?.hero} />
      <StatsSection settings={homeSettings?.stats} />
      <AnnouncementTicker settings={homeSettings?.announcements} />
      <NewsSlider settings={homeSettings?.news} />
      <HighlightsSection settings={homeSettings?.highlights} />
      <GalleryPreview settings={homeSettings?.gallery} />
      <TestimoniSection settings={homeSettings?.testimonials} />
      <CTASection settings={homeSettings?.cta} />
      <WhatsAppFloat />
    </main>
  );
}

