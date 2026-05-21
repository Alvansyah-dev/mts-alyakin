// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import AppContent from './AppContent';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-jakarta',
});

import { getSettings } from '@/lib/firestore';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getSettings('general');
    if (data) {
      const identity = data.identity || {};
      const seo = data.seo || {};
      
      return {
        title: {
          default: identity.siteName || 'MTs Al-Yakin',
          template: `%s | ${identity.siteName || 'MTs Al-Yakin'}`,
        },
        description: seo.metaDescription || identity.tagline || 'Official website of MTs Al-Yakin, an Islamic junior high school.',
        keywords: seo.keywords ? seo.keywords.split(',').map((k: string) => k.trim()) : ['MTs Al-Yakin', 'Madrasah Tsanawiyah', 'Islamic School', 'Education'],
        openGraph: {
          title: identity.siteName || 'MTs Al-Yakin',
          description: seo.metaDescription || identity.tagline || 'Official website of MTs Al-Yakin, an Islamic junior high school.',
          url: seo.productionUrl || process.env.NEXT_PUBLIC_SITE_URL,
          siteName: identity.siteName || 'MTs Al-Yakin',
          images: [
            {
              url: identity.logoUrl || '/og-image.png',
              width: 1200,
              height: 630,
              alt: identity.siteName || 'MTs Al-Yakin',
            },
          ],
          locale: 'en_US',
          type: 'website',
        },
      };
    }
  } catch (error) {
    console.error('Failed to generate dynamic metadata:', error);
  }

  // Fallback metadata
  return {
    title: {
      default: 'MTs Al-Yakin',
      template: `%s | MTs Al-Yakin`,
    },
    description: 'Official website of MTs Al-Yakin, an Islamic junior high school.',
    keywords: ['MTs Al-Yakin', 'Madrasah Tsanawiyah', 'Islamic School', 'Education'],
    openGraph: {
      title: 'MTs Al-Yakin',
      description: 'Official website of MTs Al-Yakin, an Islamic junior high school.',
      url: process.env.NEXT_PUBLIC_SITE_URL,
      siteName: 'MTs Al-Yakin',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'MTs Al-Yakin',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <AppContent interVariable={inter.variable} jakartaVariable={jakarta.variable}>
        {children}
      </AppContent>
    </html>
  );
}
