'use client'

import React, { useState, useEffect } from 'react'
import { 
  Layout, 
  Settings, 
  Image as ImageIcon, 
  Star, 
  MessageSquare, 
  Zap, 
  BarChart3, 
  Bell, 
  Plus, 
  Type,
  Link as LinkIcon,
  Smile,
  Megaphone,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Quote,
  Shield
} from 'lucide-react'
import EditorLayout from '@/components/admin/EditorLayout'
import SectionCard from '@/components/admin/SectionCard'
import TabNav from '@/components/admin/TabNav'
import ListEditor from '@/components/admin/ListEditor'
import ImageUploadField from '@/components/admin/ImageUploadField'
import { get, put } from '@/lib/api'
import { toast } from 'sonner'
import { getSettings, saveSettings } from '@/lib/firestore'

// --- Interfaces ---

interface StatItem {
  label: string
  value: string
  icon: string
}

interface HighlightItem {
  title: string
  description: string
  icon: string
}

interface TestimonialItem {
  name: string
  role: string
  quote: string
  rating: number
  photo?: string
  photoTitle?: string
}

interface AnnouncementItem {
  id: string
  text: string
  isActive: boolean
  link?: string
}

interface HeroStatCard {
  id: string
  value: string
  label: string
  icon: string
  color: string
}

interface HomePageSettings {
  hero: {
    title: string
    subtitle: string
    badge: string
    button1Text: string
    button1Url: string
    button2Text: string
    button2Url: string
    backgroundImage: string
    photoTitle?: string
    akreditasiBadge?: {
      show: boolean
      title: string
      subtitle: string
    }
    heroStats?: HeroStatCard[]
  }
  stats: {
    items: StatItem[]
  }
  news: {
    showSection: boolean
    title: string
    subtitle: string
    buttonText: string
    buttonUrl: string
  }
  highlights: {
    items: HighlightItem[]
  }
  gallery: {
    showSection: boolean
    title: string
    subtitle: string
    buttonText: string
    url: string
    backgroundImage?: string
    photoTitle?: string
  }
  testimonials: {
    items: TestimonialItem[]
  }
  cta: {
    title: string
    subtitle: string
    button1Text: string
    button1Url: string
    button2Text: string
    button2Url: string
  }
  announcements: {
    items: AnnouncementItem[]
  }
}

// --- Defaults ---

const DEFAULT_SETTINGS: HomePageSettings = {
  hero: {
    title: 'Selamat Datang di MTs Al-Yakin',
    subtitle: 'Membentuk Generasi Cerdas, Berakhlak Mulia, dan Bertaqwa.',
    badge: '🏫 Madrasah Tsanawiyah Terpercaya',
    button1Text: 'Daftar PPDB 2024',
    button1Url: '/ppdb',
    button2Text: 'Lihat Profil',
    button2Url: '/profil',
    backgroundImage: '',
    photoTitle: '',
    akreditasiBadge: {
      show: true,
      title: "Terakreditasi A",
      subtitle: "BAN-S/M 2023"
    },
    heroStats: [
      { id: '1', value: "500+", label: "Alumni", icon: "🎓", color: "#1a472a" },
      { id: '2', value: "12+", label: "Penghargaan", icon: "🏆", color: "#1a472a" },
      { id: '3', value: "250+", label: "Siswa Aktif", icon: "👥", color: "#1a472a" },
      { id: '4', value: "18+", label: "Ekskul", icon: "📚", color: "#1a472a" }
    ]
  },
  stats: {
    items: [
      { label: 'Siswa Aktif', value: '500+', icon: '👥' },
      { label: 'Guru & Staf', value: '40+', icon: '👨‍🏫' },
      { label: 'Ruang Kelas', value: '18', icon: '🏫' },
      { label: 'Akreditasi', value: 'A', icon: '🏆' }
    ]
  },
  news: {
    showSection: true,
    title: 'Berita Terbaru',
    subtitle: 'Dapatkan informasi terkini seputar kegiatan dan pengumuman sekolah.',
    buttonText: 'Lihat Semua Berita',
    buttonUrl: '/berita'
  },
  highlights: {
    items: [
      { title: 'Kurikulum Modern', description: 'Memadukan nilai agama dan ilmu pengetahuan umum.', icon: '📚' },
      { title: 'Fasilitas Lengkap', description: 'Laboratorium, perpustakaan, dan sarana olahraga modern.', icon: '🏫' },
      { title: 'Pengajar Berpengalaman', description: 'Guru yang kompeten dan berdedikasi tinggi.', icon: '👨‍🏫' },
      { title: 'Eskul Variatif', description: 'Berbagai pilihan ekstrakurikuler untuk bakat siswa.', icon: '🏀' },
      { title: 'Tahfidz Qur\'an', description: 'Program hafalan Al-Qur\'an intensif.', icon: '📖' },
      { title: 'Lingkungan Islami', description: 'Budaya sekolah yang kental dengan nilai keislaman.', icon: '🌙' }
    ]
  },
  gallery: {
    showSection: true,
    title: 'Galeri Sekolah',
    subtitle: 'Momen berharga dan aktivitas seru siswa MTs Al-Yakin.',
    buttonText: 'Lihat Semua Galeri',
    url: '/galeri',
    backgroundImage: '',
    photoTitle: ''
  },
  testimonials: {
    items: [
      { name: 'Budi Santoso', role: 'Wali Murid', quote: 'Sekolah yang luar biasa dengan pendidikan karakter yang kuat.', rating: 5, photo: '' }
    ]
  },
  cta: {
    title: 'Siap Bergabung dengan Keluarga Besar MTs Al-Yakin?',
    subtitle: 'Daftarkan putra-putri Anda sekarang dan raih masa depan cerah.',
    button1Text: 'Daftar Sekarang',
    button1Url: '/ppdb',
    button2Text: 'Hubungi Kami',
    button2Url: '/kontak'
  },
  announcements: {
    items: [
      { id: '1', text: 'Pendaftaran Siswa Baru (PPDB) 2024 Telah Dibuka!', isActive: true, link: '/ppdb' }
    ]
  }
}

// --- Component ---

export default function HomeSettingsPage() {
  const [settings, setSettings] = useState<HomePageSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState('hero')
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // 1. Try Firestore first
      const fsData = await getSettings('homepage');
      let fetched = fsData;

      // 2. Fallback to API if Firestore is empty
      if (!fetched) {
        const response = await get('/settings/homepage');
        if (response && response.data) {
          fetched = response.data;
        } else if (response && !response.hasOwnProperty('success')) {
          fetched = response;
        }
      }

      if (fetched) {
        if (fetched.hero) {
          if (!fetched.hero.akreditasiBadge) {
            fetched.hero.akreditasiBadge = {
              show: true,
              title: "Terakreditasi A",
              subtitle: "BAN-S/M 2023"
            }
          }
          if (!fetched.hero.heroStats) {
            fetched.hero.heroStats = [
              { id: '1', value: "500+", label: "Alumni", icon: "🎓", color: "#1a472a" },
              { id: '2', value: "12+", label: "Penghargaan", icon: "🏆", color: "#1a472a" },
              { id: '3', value: "250+", label: "Siswa Aktif", icon: "👥", color: "#1a472a" },
              { id: '4', value: "18+", label: "Ekskul", icon: "📚", color: "#1a472a" }
            ]
          }
        }
        setSettings(fetched as any);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 1. Save to Firestore (always works in production)
      const firestoreOk = await saveSettings('homepage', settings);

      // 2. Try saving to backend (optional, non-blocking)
      try {
        const token = localStorage.getItem('admin_token');
        if (token) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          await fetch(`${apiUrl}/api/settings/homepage`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(settings)
          });
        }
      } catch (err) {
        console.warn('Backend save failed, Firestore save is okay:', err);
      }

      if (firestoreOk) {
        setIsDirty(false);
        setLastSaved(new Date());
        toast.success('Pengaturan berhasil disimpan!');
      } else {
        toast.error('Gagal menyimpan. Coba lagi.');
      }
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  }

  const updateSection = (section: keyof HomePageSettings, data: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
    setIsDirty(true)
  }

  const tabs = [
    { id: 'hero', label: 'Hero', icon: Layout },
    { id: 'stats', label: 'Statistik', icon: BarChart3 },
    { id: 'news', label: 'Berita', icon: Megaphone },
    { id: 'highlights', label: 'Keunggulan', icon: Zap },
    { id: 'gallery', label: 'Galeri', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimoni', icon: Star },
    { id: 'cta', label: 'CTA', icon: ArrowRight },
    { id: 'announcements', label: 'Pengumuman', icon: Bell },
  ]

  // --- Render Preview Section ---

  const renderPreview = () => {
    switch (activeTab) {
      case 'hero':
        const showBadge = settings.hero.akreditasiBadge?.show ?? true
        const badgeTitle = settings.hero.akreditasiBadge?.title || "Terakreditasi A"
        const badgeSubtitle = settings.hero.akreditasiBadge?.subtitle || "BAN-S/M 2023"
        const stats = settings.hero.heroStats || [
          { value: "500+", label: "Alumni", icon: "🎓", color: "#1a472a" },
          { value: "12+", label: "Penghargaan", icon: "🏆", color: "#1a472a" },
          { value: "250+", label: "Siswa Aktif", icon: "👥", color: "#1a472a" },
          { value: "18+", label: "Ekskul", icon: "📚", color: "#1a472a" },
        ]
        return (
          <div 
            className={`relative h-full w-full flex flex-col justify-between p-6 overflow-y-auto ${
              settings.hero.backgroundImage 
                ? '' 
                : 'bg-gradient-to-br from-green-900 via-green-800 to-emerald-950'
            }`}
            style={settings.hero.backgroundImage ? {
              backgroundImage: `url(${settings.hero.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : {}}
          >
            {/* Dark overlay only if there is backgroundImage */}
            {settings.hero.backgroundImage && (
              <div className="absolute inset-0 bg-black/60 z-0" />
            )}
            <div className="relative z-10 flex justify-between items-start gap-4">
              {/* Left text */}
              <div className="space-y-3 max-w-[50%]">
                <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[8px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-white/10">
                  {settings.hero.badge || 'BADGE TEXT'}
                </span>
                <h2 className="text-lg font-black text-white leading-tight tracking-tight">
                  {settings.hero.title || 'JUDUL HERO'}
                </h2>
                <p className="text-green-50 text-[9px] opacity-80 leading-relaxed line-clamp-3">
                  {settings.hero.subtitle || 'SUBJUDUL HERO'}
                </p>
                <div className="flex gap-2 pt-1">
                  <div className="bg-white text-green-700 text-[8px] font-black px-3 py-1.5 rounded-xl shadow-lg">
                    {settings.hero.button1Text || 'TOMBOL 1'}
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] font-black px-3 py-1.5 rounded-xl">
                    {settings.hero.button2Text || 'TOMBOL 2'}
                  </div>
                </div>

                {/* Akreditasi Badge */}
                {showBadge && (
                  <div className="bg-white rounded-xl p-2 flex items-center gap-2 border border-gray-100 max-w-[160px] shadow-lg animate-in fade-in">
                    <Shield className="text-green-600 w-4 h-4 shrink-0" />
                    <div>
                      <p className="font-black text-gray-900 text-[8px] leading-tight">{badgeTitle}</p>
                      <p className="text-[7px] font-bold text-gray-400 leading-none">{badgeSubtitle}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Stats Cards */}
              <div className="grid grid-cols-2 gap-2 max-w-[45%]">
                {stats.slice(0, 4).map((stat: any, i: number) => (
                  <div 
                    key={i} 
                    className="backdrop-blur rounded-2xl p-2 flex flex-col justify-between aspect-square"
                    style={{ backgroundColor: `${stat.color || '#1a472a'}cc` }}
                  >
                    <div className="text-lg">{stat.icon}</div>
                    <div>
                      <div className="text-xs font-black text-white leading-none">{stat.value}</div>
                      <div className="text-white/60 text-[7px] font-bold uppercase tracking-wider mt-0.5 leading-tight">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'stats':
        return (
          <div className="p-6 grid grid-cols-2 gap-4 bg-white h-full content-center">
            {settings.stats.items.map((item, i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-3xl bg-gray-50 text-center shadow-sm">
                <span className="text-2xl mb-1 block">{item.icon}</span>
                <div className="text-lg font-black text-green-600">{item.value}</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
        )
      case 'news':
        return (
          <div className="p-6 space-y-4 bg-white h-full overflow-y-auto">
            {!settings.news.showSection && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <EyeOff className="w-8 h-8" />
                  <span className="text-xs font-bold uppercase tracking-widest">Section Disembunyikan</span>
                </div>
              </div>
            )}
            <div className="space-y-1">
              <h3 className="text-sm font-black text-gray-900">{settings.news.title}</h3>
              <p className="text-[9px] text-gray-500 leading-relaxed">{settings.news.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0" />
                  <div className="space-y-2 flex-1 pt-1">
                    <div className="h-2 w-full bg-gray-200 rounded" />
                    <div className="h-2 w-2/3 bg-gray-100 rounded" />
                    <div className="flex justify-between items-center pt-1">
                       <div className="h-1.5 w-10 bg-green-100 rounded" />
                       <div className="h-1.5 w-10 bg-gray-100 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 text-center">
               <div className="inline-block px-4 py-2 bg-green-600 text-white text-[9px] font-bold rounded-xl">
                 {settings.news.buttonText}
               </div>
            </div>
          </div>
        )
      case 'highlights':
        return (
          <div className="p-6 space-y-6 bg-white h-full overflow-y-auto">
            <div className="text-center">
              <h3 className="text-sm font-black uppercase tracking-widest text-green-600">Keunggulan Kami</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {settings.highlights.items.map((item, i) => (
                <div key={i} className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <span className="text-xl">{item.icon}</span>
                  <h4 className="text-[10px] font-black text-gray-900 leading-tight">{item.title}</h4>
                  <p className="text-[8px] text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )
      case 'gallery':
        return (
          <div 
            className={`p-6 space-y-4 h-full overflow-y-auto relative flex flex-col justify-center ${
              settings.gallery.backgroundImage 
                ? 'text-white' 
                : 'bg-white'
            }`}
            style={settings.gallery.backgroundImage ? {
              backgroundImage: `url(${settings.gallery.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : {}}
          >
            {settings.gallery.backgroundImage && (
              <div className="absolute inset-0 bg-black/60 z-0" />
            )}
            <div className="relative z-10 space-y-4">
              {!settings.gallery.showSection && (
                 <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                   <div className="flex flex-col items-center gap-2 text-gray-400">
                     <EyeOff className="w-8 h-8" />
                     <span className="text-xs font-bold uppercase tracking-widest">Section Disembunyikan</span>
                   </div>
                 </div>
              )}
              <div className="text-center space-y-1">
                <h3 className={`text-sm font-black ${settings.gallery.backgroundImage ? 'text-white' : 'text-gray-900'}`}>{settings.gallery.title}</h3>
                <p className={`text-[9px] ${settings.gallery.backgroundImage ? 'text-gray-200' : 'text-gray-500'} leading-relaxed`}>{settings.gallery.subtitle}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                 {[1, 2, 3, 4, 5, 6].map(i => (
                   <div key={i} className={`aspect-square rounded-xl border ${settings.gallery.backgroundImage ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-200'}`} />
                 ))}
              </div>
              <div className="pt-2 text-center">
                 <div className="inline-block px-4 py-2 bg-green-600 text-white text-[9px] font-bold rounded-xl">
                   {settings.gallery.buttonText}
                 </div>
              </div>
            </div>
          </div>
        )
      case 'testimonials':
        return (
          <div className="p-6 bg-gray-50 h-full flex flex-col justify-center gap-4 overflow-y-auto">
            {settings.testimonials.items.map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                <Quote className="w-6 h-6 text-green-100" />
                <p className="text-[10px] text-gray-600 italic font-medium leading-relaxed">"{item.quote}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-green-100 border-2 border-green-50 shrink-0">
                    {item.photo ? (
                      <img src={item.photo} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-green-700 font-black text-xs">
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-900">{item.name}</h4>
                    <p className="text-[8px] text-gray-400 font-bold">{item.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      case 'cta':
        return (
          <div className="h-full bg-green-600 flex items-center justify-center p-8 text-center">
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white leading-tight tracking-tight">{settings.cta.title}</h3>
              <p className="text-green-50 text-[10px] opacity-80 leading-relaxed max-w-[280px] mx-auto">{settings.cta.subtitle}</p>
              <div className="flex flex-col gap-2 pt-4">
                <div className="bg-white text-green-700 text-[10px] font-black py-3 rounded-2xl shadow-xl">
                  {settings.cta.button1Text}
                </div>
                <div className="bg-green-700 text-white text-[10px] font-black py-3 rounded-2xl border border-green-500">
                  {settings.cta.button2Text}
                </div>
              </div>
            </div>
          </div>
        )
      case 'announcements':
        return (
          <div className="h-full bg-white flex flex-col pt-12">
            <div className="bg-green-600 p-3 overflow-hidden whitespace-nowrap shadow-lg">
              <div className="flex gap-6 animate-marquee text-white text-[11px] font-black italic uppercase tracking-wider">
                {settings.announcements.items.filter(a => a.isActive).length > 0 ? (
                  settings.announcements.items.filter(a => a.isActive).map((a, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full" />
                      {a.text}
                    </span>
                  ))
                ) : (
                  <span className="opacity-50 italic">TIDAK ADA PENGUMUMAN AKTIF</span>
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-2">
               <Bell className="w-12 h-12 text-gray-100" />
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Live Ticker Preview</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-2 bg-white">
            <Settings className="w-10 h-10 text-gray-200" />
            <h3 className="text-sm font-bold text-gray-400 italic">Preview sedang dimuat...</h3>
          </div>
        )
    }
  }

  // --- Render Form Content ---

  const renderForm = () => {
    switch (activeTab) {
      case 'hero':
        return (
          <div className="space-y-8">
            <SectionCard title="Konten Teks Hero" icon={Type} description="Atur judul, subjudul, dan lencana utama.">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Badge Text</label>
                  <input 
                    type="text" 
                    value={settings.hero.badge} 
                    onChange={(e) => updateSection('hero', { badge: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 transition-all font-bold"
                    placeholder="Contoh: Madrasah Terakreditasi A"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Judul Utama</label>
                  <textarea 
                    rows={2}
                    value={settings.hero.title} 
                    onChange={(e) => updateSection('hero', { title: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 transition-all font-bold text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Subjudul</label>
                  <textarea 
                    rows={3}
                    value={settings.hero.subtitle} 
                    onChange={(e) => updateSection('hero', { subtitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 transition-all font-medium"
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Navigasi & Media" icon={LinkIcon} description="Atur tombol navigasi dan background hero.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Teks Tombol 1</label>
                  <input 
                    type="text" 
                    value={settings.hero.button1Text} 
                    onChange={(e) => updateSection('hero', { button1Text: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-gray-500 tracking-wider">URL Tombol 1</label>
                  <input 
                    type="text" 
                    value={settings.hero.button1Url} 
                    onChange={(e) => updateSection('hero', { button1Url: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Teks Tombol 2</label>
                  <input 
                    type="text" 
                    value={settings.hero.button2Text} 
                    onChange={(e) => updateSection('hero', { button2Text: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-gray-500 tracking-wider">URL Tombol 2</label>
                  <input 
                    type="text" 
                    value={settings.hero.button2Url} 
                    onChange={(e) => updateSection('hero', { button2Url: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                  />
                </div>
              </div>
              <ImageUploadField 
                label="Foto Background Hero (Opsional)" 
                value={settings.hero.backgroundImage ?? null}
                onChange={(url) => updateSection('hero', { backgroundImage: url })}
                description="Jika ada foto, akan ditampilkan sebagai background. Jika tidak, akan menggunakan gradient hijau."
              />
              {settings.hero.backgroundImage && (
                <div className="mt-4 animate-in slide-in-from-top-2">
                  <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Judul Foto (Required)</label>
                  <input 
                    type="text" 
                    required
                    value={settings.hero.photoTitle} 
                    onChange={(e) => updateSection('hero', { photoTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-red-200 focus:ring-red-500 mt-1 font-bold"
                    placeholder="Contoh: Gedung MTs Al-Yakin"
                  />
                </div>
              )}
            </SectionCard>

            <SectionCard title="Badge Akreditasi Hero" icon={Shield} description="Atur badge akreditasi putih dengan ikon perisai.">
              <div className="space-y-6">
                <label className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <span className="font-black text-sm uppercase tracking-wider block text-gray-900 dark:text-white">Tampilkan Badge Akreditasi</span>
                      <span className="text-[10px] text-gray-400 font-medium italic">Sembunyikan/tampilkan badge akreditasi di section Hero.</span>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.hero.akreditasiBadge?.show ?? true} 
                    onChange={(e) => {
                      const badge = settings.hero.akreditasiBadge || { show: true, title: "Terakreditasi A", subtitle: "BAN-S/M 2023" }
                      updateSection('hero', { akreditasiBadge: { ...badge, show: e.target.checked } })
                    }}
                    className="w-6 h-6 rounded-lg text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 dark:text-gray-400 tracking-wider">Judul Akreditasi</label>
                    <input 
                      type="text" 
                      value={settings.hero.akreditasiBadge?.title || ''} 
                      onChange={(e) => {
                        const badge = settings.hero.akreditasiBadge || { show: true, title: "Terakreditasi A", subtitle: "BAN-S/M 2023" }
                        updateSection('hero', { akreditasiBadge: { ...badge, title: e.target.value } })
                      }}
                      placeholder="Terakreditasi A"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 dark:text-gray-400 tracking-wider">Sub-teks Akreditasi</label>
                    <input 
                      type="text" 
                      value={settings.hero.akreditasiBadge?.subtitle || ''} 
                      onChange={(e) => {
                        const badge = settings.hero.akreditasiBadge || { show: true, title: "Terakreditasi A", subtitle: "BAN-S/M 2023" }
                        updateSection('hero', { akreditasiBadge: { ...badge, subtitle: e.target.value } })
                      }}
                      placeholder="BAN-S/M 2023"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Hero Stats Cards (Stats Hero)" icon={BarChart3} description="Kotak kecil berangka yang tampil di sebelah kanan Hero (Maksimal 4).">
              <ListEditor<HeroStatCard>
                items={settings.hero.heroStats || []}
                onChange={(heroStats) => updateSection('hero', { heroStats })}
                maxItems={4}
                createNew={() => ({ id: String(Date.now()), value: '500+', label: 'Alumni', icon: '🎓', color: '#1a472a' })}
                renderItem={(item, index, onChange) => (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Emoji Icon</label>
                      <input 
                        type="text" 
                        value={item.icon} 
                        onChange={(e) => onChange({ ...item, icon: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-center text-xl font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Angka/Value</label>
                      <input 
                        type="text" 
                        value={item.value} 
                        onChange={(e) => onChange({ ...item, value: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 font-bold text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Label</label>
                      <input 
                        type="text" 
                        value={item.label} 
                        onChange={(e) => onChange({ ...item, label: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 font-bold text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Warna Background</label>
                      <select 
                        value={item.color || '#1a472a'} 
                        onChange={(e) => onChange({ ...item, color: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs font-bold cursor-pointer"
                      >
                        <option value="#1a472a">Dark Green (#1a472a)</option>
                        <option value="#0f2d1a">Darker Green (#0f2d1a)</option>
                        <option value="#1a3a4a">Dark Teal (#1a3a4a)</option>
                      </select>
                    </div>
                  </div>
                )}
              />
            </SectionCard>
          </div>
        )
      case 'stats':
        return (
          <SectionCard title="Statistik Sekolah" icon={BarChart3} description="Update 4 angka pencapaian utama sekolah.">
            <ListEditor
              items={settings.stats.items}
              onChange={(items) => updateSection('stats', { items })}
              maxItems={4}
              createNew={() => ({ label: '', value: '', icon: '📊' })}
              renderItem={(item, index, onChange) => (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Emoji Icon</label>
                    <input 
                      type="text" 
                      value={item.icon} 
                      onChange={(e) => onChange({ ...item, icon: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-center text-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Angka</label>
                    <input 
                      type="text" 
                      value={item.value} 
                      onChange={(e) => onChange({ ...item, value: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px) font-black uppercase text-gray-400">Label</label>
                    <input 
                      type="text" 
                      value={item.label} 
                      onChange={(e) => onChange({ ...item, label: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                    />
                  </div>
                </div>
              )}
            />
          </SectionCard>
        )
      case 'news':
        return (
          <div className="space-y-8">
            <SectionCard title="Header & Visibilitas" icon={Megaphone}>
              <div className="space-y-6">
                <label className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    {settings.news.showSection ? <Eye className="w-5 h-5 text-green-600" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                    <div>
                      <span className="font-black text-sm uppercase tracking-wider block">Tampilkan Section Berita</span>
                      <span className="text-[10px] text-gray-400 font-medium italic">Sembunyikan jika tidak ada berita terbaru.</span>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.news.showSection} 
                    onChange={(e) => updateSection('news', { showSection: e.target.checked })}
                    className="w-6 h-6 rounded-lg text-green-600 focus:ring-green-500"
                  />
                </label>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Judul Section</label>
                    <input 
                      type="text" 
                      value={settings.news.title} 
                      onChange={(e) => updateSection('news', { title: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Subjudul Section</label>
                    <textarea 
                      value={settings.news.subtitle} 
                      onChange={(e) => updateSection('news', { subtitle: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Navigasi Berita" icon={LinkIcon}>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Teks Tombol</label>
                    <input 
                      type="text" 
                      value={settings.news.buttonText} 
                      onChange={(e) => updateSection('news', { buttonText: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-wider">URL Tombol</label>
                    <input 
                      type="text" 
                      value={settings.news.buttonUrl} 
                      onChange={(e) => updateSection('news', { buttonUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                    />
                  </div>
               </div>
            </SectionCard>
          </div>
        )
      case 'highlights':
        return (
          <SectionCard title="List Keunggulan (Maks 6)" icon={Zap}>
            <ListEditor
              items={settings.highlights.items}
              onChange={(items) => updateSection('highlights', { items })}
              maxItems={6}
              createNew={() => ({ title: 'Keunggulan Baru', description: 'Deskripsi...', icon: '✨' })}
              renderItem={(item, index, onChange) => (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-20 space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Icon</label>
                      <input value={item.icon} onChange={(e) => onChange({ ...item, icon: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-center text-xl" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Judul</label>
                      <input value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Deskripsi Singkat</label>
                    <textarea value={item.description} onChange={(e) => onChange({ ...item, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200" rows={2} />
                  </div>
                </div>
              )}
            />
          </SectionCard>
        )
      case 'gallery':
        return (
          <SectionCard title="Pengaturan Galeri Preview" icon={ImageIcon}>
             <div className="space-y-6">
                <label className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    {settings.gallery.showSection ? <Eye className="w-5 h-5 text-green-600" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                    <span className="font-black text-sm uppercase tracking-wider block">Tampilkan Section Galeri</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.gallery.showSection} 
                    onChange={(e) => updateSection('gallery', { showSection: e.target.checked })}
                    className="w-6 h-6 rounded-lg text-green-600 focus:ring-green-500"
                  />
                </label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Judul Section</label>
                    <input type="text" value={settings.gallery.title} onChange={(e) => updateSection('gallery', { title: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Subjudul Section</label>
                    <textarea value={settings.gallery.subtitle} onChange={(e) => updateSection('gallery', { subtitle: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Teks Tombol</label>
                      <input type="text" value={settings.gallery.buttonText} onChange={(e) => updateSection('gallery', { buttonText: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-gray-500 tracking-wider">URL Galeri</label>
                      <input type="text" value={settings.gallery.url} onChange={(e) => updateSection('gallery', { url: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-150">
                    <ImageUploadField 
                      label="Foto Background Galeri Beranda (Opsional)" 
                      value={settings.gallery.backgroundImage ?? null}
                      onChange={(url) => updateSection('gallery', { backgroundImage: url })}
                      description="Jika diunggah, akan ditampilkan sebagai background section galeri di beranda. Jika kosong, menggunakan warna default."
                    />
                    {settings.gallery.backgroundImage && (
                      <div className="mt-4 animate-in slide-in-from-top-2">
                        <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Judul Foto (Required)</label>
                        <input 
                          type="text" 
                          required
                          value={settings.gallery.photoTitle || ''} 
                          onChange={(e) => updateSection('gallery', { photoTitle: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border border-red-200 focus:ring-red-500 mt-1 font-bold"
                          placeholder="Contoh: Kegiatan Belajar Mengajar MTs Al-Yakin"
                        />
                      </div>
                    )}
                  </div>
                </div>
             </div>
          </SectionCard>
        )
      case 'testimonials':
        return (
          <SectionCard title="Daftar Testimoni" icon={MessageSquare}>
            <ListEditor
              items={settings.testimonials.items}
              onChange={(items) => updateSection('testimonials', { items })}
              createNew={() => ({ name: 'Nama Orang', role: 'Wali Murid', quote: 'Layanan sangat memuaskan...', rating: 5, photo: '', photoTitle: '' })}
              renderItem={(item, index, onChange) => (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Nama Lengkap</label>
                        <input value={item.name} onChange={(e) => onChange({ ...item, name: e.target.value, photoTitle: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Jabatan/Status</label>
                        <input value={item.role} onChange={(e) => onChange({ ...item, role: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-gray-400">Quote Testimoni</label>
                     <textarea value={item.quote} onChange={(e) => onChange({ ...item, quote: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 italic" rows={3} />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Rating (1-5)</label>
                        <input type="number" min="1" max="5" value={item.rating} onChange={(e) => onChange({ ...item, rating: parseInt(e.target.value) })} className="w-20 px-3 py-2 rounded-xl border border-gray-200 text-center font-bold" />
                     </div>
                     <div className="flex-1 ml-6">
                        <ImageUploadField 
                          label="Foto (Opsional)" 
                          value={item.photo ?? null} 
                          onChange={(url) => onChange({ ...item, photo: url })}
                          aspectRatio="square"
                        />
                     </div>
                  </div>
                  {item.photo && (
                    <div className="space-y-1 animate-in slide-in-from-top-1">
                       <label className="text-[10px] font-black uppercase text-gray-400">Judul Foto (Auto-fill)</label>
                       <input value={item.photoTitle} onChange={(e) => onChange({ ...item, photoTitle: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold bg-gray-50" />
                    </div>
                  )}
                </div>
              )}
            />
          </SectionCard>
        )
      case 'cta':
        return (
          <SectionCard title="Banner Ajakan (CTA)" icon={ArrowRight}>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Judul Utama</label>
                   <input type="text" value={settings.cta.title} onChange={(e) => updateSection('cta', { title: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold text-lg" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Subjudul Deskripsi</label>
                   <textarea value={settings.cta.subtitle} onChange={(e) => updateSection('cta', { subtitle: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" rows={3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Teks Tombol 1</label>
                    <input type="text" value={settings.cta.button1Text} onChange={(e) => updateSection('cta', { button1Text: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-wider">URL Tombol 1</label>
                    <input type="text" value={settings.cta.button1Url} onChange={(e) => updateSection('cta', { button1Url: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Teks Tombol 2</label>
                    <input type="text" value={settings.cta.button2Text} onChange={(e) => updateSection('cta', { button2Text: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-wider">URL Tombol 2</label>
                    <input type="text" value={settings.cta.button2Url} onChange={(e) => updateSection('cta', { button2Url: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                  </div>
                </div>
             </div>
          </SectionCard>
        )
      case 'announcements':
        return (
          <SectionCard title="Kelola Pengumuman" icon={Bell}>
            <ListEditor<AnnouncementItem> items={settings.announcements.items}
              onChange={(items) => updateSection('announcements', { items })}
              createNew={() => ({ id: Math.random().toString(), text: 'Teks pengumuman...', isActive: true })}
              renderItem={(item, index, onChange) => (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase text-gray-400">Entry #{index + 1}</span>
                     <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span className={`text-[10px] font-black uppercase ${item.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          {item.isActive ? 'Aktif' : 'Non-aktif'}
                        </span>
                        <input type="checkbox" checked={item.isActive} onChange={(e) => onChange({ ...item, isActive: e.target.checked })} className="w-5 h-5 rounded-lg text-green-600 focus:ring-green-500" />
                     </label>
                  </div>
                  <textarea value={item.text} onChange={(e) => onChange({ ...item, text: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 font-medium" rows={2} />
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Link (Opsional)</label>
                    <div className="relative">
                       <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input value={item.link || ''} onChange={(e) => onChange({ ...item, link: e.target.value })} className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm" placeholder="https://..." />
                    </div>
                  </div>
                </div>
              )}
            />
          </SectionCard>
        )
      default:
        return null
    }
  }

  return (
    <EditorLayout
      title="Pengaturan Beranda"
      description="Kelola semua konten yang tampil di halaman utama website dengan visual preview."
      preview={renderPreview()}
      onSave={handleSave}
      isSaving={isSaving}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      <TabNav 
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-2">
        {renderForm()}
      </div>
    </EditorLayout>
  )
}
