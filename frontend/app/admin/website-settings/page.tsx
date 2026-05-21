'use client'

import React, { useState, useEffect } from 'react'
import { 
  Globe, 
  Search, 
  Palette, 
  Type, 
  Layout, 
  CheckCircle2, 
  Settings, 
  BarChart3, 
  Link as LinkIcon, 
  ImageIcon, 
  MousePointer2,
  AlertCircle,
  Eye,
  Info
} from 'lucide-react'
import EditorLayout from '@/components/admin/EditorLayout'
import SectionCard from '@/components/admin/SectionCard'
import TabNav from '@/components/admin/TabNav'
import ImageUploadField from '@/components/admin/ImageUploadField'
import { get, put } from '@/lib/api'
import { toast } from 'sonner'
import { getSettings, saveSettings } from '@/lib/firestore'

// --- Interfaces ---

interface WebsiteSettings {
  identity: {
    siteName: string
    tagline: string
    logoUrl?: string
    faviconUrl?: string
  }
  seo: {
    metaDescription: string
    keywords: string
    googleAnalyticsId: string
    productionUrl: string
  }
  appearance: {
    primaryColor: string
    headingFont: string
    bodyFont: string
  }
}

// --- Defaults ---

const DEFAULT_SETTINGS: WebsiteSettings = {
  identity: {
    siteName: 'MTs Al-Yakin',
    tagline: 'Mencetak Generasi Unggul dan Berakhlak Mulia',
    logoUrl: '',
    faviconUrl: ''
  },
  seo: {
    metaDescription: 'Website resmi MTs Al-Yakin. Informasi pendaftaran siswa baru (PPDB), berita sekolah, galeri kegiatan, dan layanan konsultasi online.',
    keywords: 'mts al-yakin, sekolah malang, madrasah tsanawiyah, ppdb 2024',
    googleAnalyticsId: 'G-XXXXXXXXXX',
    productionUrl: 'https://mtsalyakin.sch.id'
  },
  appearance: {
    primaryColor: '#059669', // Emerald 600
    headingFont: 'Inter',
    bodyFont: 'Inter'
  }
}

export default function WebsiteSettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState('identity')
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const fsData = await getSettings('general');
      if (fsData) {
        setSettings(fsData as any)
      }
    } catch (err) {
      console.error('Failed to fetch website settings:', err)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Cek auth dulu
      const { auth } = await import('@/lib/firebase')
      const user = auth?.currentUser
      
      if (!user) {
        toast.error('Sesi habis. Silakan login ulang.')
        setTimeout(() => {
          window.location.href = '/admin/login'
        }, 1500)
        return
      }
      
      // Simpan ke Firestore
      const { doc, setDoc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      
      await setDoc(
        doc(db as any, 'siteSettings', 'general'),
        {
          ...settings,
          updatedAt: new Date().toISOString(),
          updatedBy: user.email
        },
        { merge: true }
      )
      
      setIsDirty(false)
      toast.success('✅ Pengaturan berhasil disimpan!')
      
    } catch (error: any) {
      console.error('Save error:', error)
      
      if (error.code === 'permission-denied') {
        toast.error('❌ Akses ditolak. Coba login ulang.')
      } else {
        toast.error('❌ Gagal menyimpan: ' + 
          (error.message || 'Unknown error'))
      }
    } finally {
      setIsSaving(false)
    }
  }

  const updateSection = (section: keyof WebsiteSettings, data: any) => {
    setSettings(prev => ({ ...prev, [section]: { ...prev[section], ...data } }))
    setIsDirty(true)
  }

  const tabs = [
    { id: 'identity', label: 'Identitas', icon: Globe },
    { id: 'seo', label: 'SEO & Analytics', icon: Search },
    { id: 'appearance', label: 'Tampilan', icon: Palette },
  ]

  // --- Render Preview ---

  const renderPreview = () => {
    switch (activeTab) {
      case 'seo':
        return (
          <div className="h-full bg-white p-8 flex flex-col justify-center space-y-4">
             <div className="text-center mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-green-600">Google Search Preview</h3>
             </div>
             <div className="max-w-[400px] space-y-1">
                <div className="text-[10px] text-[#202124] flex items-center gap-1">
                   {settings.seo.productionUrl} <span className="text-[8px] text-[#70757a]">› ...</span>
                </div>
                <h4 className="text-sm text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight">
                   {settings.identity.siteName} - {settings.identity.tagline}
                </h4>
                <p className="text-[10px] text-[#4d5156] leading-relaxed line-clamp-2">
                   {settings.seo.metaDescription || 'No description provided.'}
                </p>
             </div>
             <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase text-gray-400">Tracking ID</p>
                      <p className="text-xs font-black text-gray-900">{settings.seo.googleAnalyticsId || 'Not set'}</p>
                   </div>
                </div>
             </div>
          </div>
        )
      case 'appearance':
        return (
          <div className="h-full bg-gray-50 p-8 flex flex-col justify-center items-center">
             <div className="w-full max-w-[280px] space-y-6">
                <div className="space-y-2">
                   <div style={{ backgroundColor: settings.appearance.primaryColor }} className="h-10 w-full rounded-2xl shadow-lg flex items-center justify-center text-white font-black text-[10px] uppercase tracking-widest">
                      Primary Button
                   </div>
                   <div style={{ borderColor: settings.appearance.primaryColor, color: settings.appearance.primaryColor }} className="h-10 w-full rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest flex items-center justify-center">
                      Secondary Button
                   </div>
                </div>
                <div className="space-y-3 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                   <h1 style={{ fontFamily: settings.appearance.headingFont }} className="text-xl font-black text-gray-900 leading-none">Heading Text</h1>
                   <p style={{ fontFamily: settings.appearance.bodyFont }} className="text-xs text-gray-500 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                   </p>
                </div>
             </div>
          </div>
        )
      default:
        return (
          <div className="h-full bg-white p-8 flex flex-col items-center justify-center text-center space-y-6">
             {settings.identity.logoUrl ? (
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl ring-4 ring-green-50">
                   <img src={settings.identity.logoUrl} className="w-full h-full object-contain p-2" />
                </div>
             ) : (
                <div className="w-24 h-24 bg-green-700 rounded-[2rem] flex items-center justify-center text-white font-black text-2xl shadow-xl">
                   {settings.identity.siteName.charAt(0)}
                </div>
             )}
             <div className="space-y-1">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">{settings.identity.siteName}</h2>
                <p className="text-xs font-bold text-green-600 uppercase tracking-[0.2em]">{settings.identity.tagline}</p>
             </div>
             {settings.identity.faviconUrl && (
                <div className="pt-8 flex flex-col items-center gap-2">
                   <p className="text-[10px] font-black uppercase text-gray-400">Favicon Preview</p>
                   <img src={settings.identity.faviconUrl} className="w-8 h-8 rounded-lg border border-gray-100 shadow-sm" />
                </div>
             )}
          </div>
        )
    }
  }

  return (
    <EditorLayout
      title="Pengaturan Website"
      description="Kelola identitas dasar, SEO, dan preferensi tampilan global website sekolah Anda."
      preview={renderPreview()}
      onSave={handleSave}
      isSaving={isSaving}
      isDirty={isDirty}
    >
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        {activeTab === 'identity' && (
          <div className="space-y-8">
            <SectionCard title="Identitas Dasar" icon={Globe}>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-gray-400">Nama Website / Sekolah</label>
                     <input 
                       value={settings.identity.siteName} 
                       onChange={(e) => updateSection('identity', { siteName: e.target.value })}
                       className="w-full px-5 py-4 rounded-3xl border border-gray-200 bg-gray-50 font-black text-lg focus:ring-2 focus:ring-green-500 transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-gray-400">Slogan / Tagline</label>
                     <input 
                       value={settings.identity.tagline} 
                       onChange={(e) => updateSection('identity', { tagline: e.target.value })}
                       className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold"
                     />
                  </div>
               </div>
            </SectionCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <SectionCard title="Logo Website" icon={ImageIcon}>
                  <ImageUploadField 
                    label="Upload Logo (PNG/SVG)" 
                    value={settings.identity.logoUrl}
                    onChange={(url) => updateSection('identity', { logoUrl: url })}
                  />
               </SectionCard>
               <SectionCard title="Browser Favicon" icon={Layout}>
                  <ImageUploadField 
                    label="Upload Favicon (32x32)" 
                    value={settings.identity.faviconUrl}
                    onChange={(url) => updateSection('identity', { faviconUrl: url })}
                  />
               </SectionCard>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-8">
            <SectionCard title="Search Engine Optimization (SEO)" icon={Search}>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between">
                        <label className="text-xs font-black uppercase text-gray-400">Meta Description</label>
                        <span className={`text-[10px] font-bold ${settings.seo.metaDescription.length > 160 ? 'text-red-500' : 'text-green-500'}`}>
                           {settings.seo.metaDescription.length} / 160
                        </span>
                     </div>
                     <textarea 
                       value={settings.seo.metaDescription} 
                       onChange={(e) => updateSection('seo', { metaDescription: e.target.value })}
                       className="w-full px-5 py-4 rounded-3xl border border-gray-200 bg-gray-50 font-medium leading-relaxed"
                       rows={4}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-gray-400">Keywords (Pisahkan dengan koma)</label>
                     <input 
                       value={settings.seo.keywords} 
                       onChange={(e) => updateSection('seo', { keywords: e.target.value })}
                       className="w-full px-4 py-3 rounded-2xl border"
                       placeholder="sekolah, madrasah, malang..."
                     />
                  </div>
               </div>
            </SectionCard>

            <SectionCard title="Integrasi & Analytics" icon={BarChart3}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-gray-400">Google Analytics ID</label>
                     <input 
                       value={settings.seo.googleAnalyticsId} 
                       onChange={(e) => updateSection('seo', { googleAnalyticsId: e.target.value })}
                       className="w-full px-4 py-3 rounded-2xl border font-bold"
                       placeholder="GA-XXXXXXXXXX"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-gray-400">Production URL</label>
                     <input 
                       value={settings.seo.productionUrl} 
                       onChange={(e) => updateSection('seo', { productionUrl: e.target.value })}
                       className="w-full px-4 py-3 rounded-2xl border text-gray-500"
                       placeholder="https://..."
                     />
                  </div>
               </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-8">
            <SectionCard title="Tema Warna & Tipografi" icon={Palette}>
               <div className="space-y-8">
                  <div className="space-y-4">
                     <label className="text-xs font-black uppercase text-gray-400 block">Warna Utama (Primary Color)</label>
                     <div className="flex flex-wrap gap-4">
                        {[
                          { name: 'Emerald', color: '#059669' },
                          { name: 'Blue', color: '#2563eb' },
                          { name: 'Indigo', color: '#4f46e5' },
                          { name: 'Orange', color: '#ea580c' },
                          { name: 'Red', color: '#dc2626' },
                        ].map((c) => (
                          <button 
                            key={c.name}
                            onClick={() => updateSection('appearance', { primaryColor: c.color })}
                            className={`w-12 h-12 rounded-2xl transition-all shadow-sm flex items-center justify-center ${settings.appearance.primaryColor === c.color ? 'ring-4 ring-white ring-offset-2 scale-110 shadow-lg' : 'hover:scale-105'}`}
                            style={{ backgroundColor: c.color }}
                          >
                             {settings.appearance.primaryColor === c.color && <CheckCircle2 className="w-6 h-6 text-white" />}
                          </button>
                        ))}
                        <input 
                          type="color" 
                          value={settings.appearance.primaryColor}
                          onChange={(e) => updateSection('appearance', { primaryColor: e.target.value })}
                          className="w-12 h-12 rounded-2xl border-none p-0 bg-transparent cursor-pointer"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100 border-dashed">
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400">Heading Font</label>
                        <select 
                          value={settings.appearance.headingFont}
                          onChange={(e) => updateSection('appearance', { headingFont: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border font-bold"
                        >
                           <option value="Inter">Inter (Modern)</option>
                           <option value="Outfit">Outfit (Premium)</option>
                           <option value="Montserrat">Montserrat (Classic)</option>
                           <option value="Playfair Display">Playfair (Elegant)</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400">Body Font</label>
                        <select 
                          value={settings.appearance.bodyFont}
                          onChange={(e) => updateSection('appearance', { bodyFont: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border"
                        >
                           <option value="Inter">Inter (Readable)</option>
                           <option value="Roboto">Roboto (Clean)</option>
                           <option value="Poppins">Poppins (Soft)</option>
                        </select>
                     </div>
                  </div>
               </div>
            </SectionCard>

            <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex gap-6 items-start">
               <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                  <Info className="w-7 h-7" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Optimasi Kecepatan</h4>
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                     Pengaturan SEO dan identitas website berpengaruh pada bagaimana Google mengindeks sekolah Anda. Pastikan tagline dan deskripsi mengandung kata kunci yang relevan agar mudah ditemukan oleh calon wali murid.
                  </p>
               </div>
            </div>
         </div>
        )}
      </div>
    </EditorLayout>
  )
}
