'use client'

import React, { useState, useEffect } from 'react'
import {
  Settings, Image, ImageIcon, User, Users, BookOpen,
  Building, Trophy, GitBranch, GitMerge, ClipboardList,
  HelpCircle, CheckCircle, XCircle, Clock, Eye, EyeOff,
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
  Save, Globe, Phone, Mail, MapPin, Upload, FileText,
  Calendar, DollarSign, School, MessageCircle,
  Bell, BellOff, Link, Type, ExternalLink, Smartphone,
  Check, X, ArrowRight, ArrowLeft, Edit, RefreshCw,
  ToggleLeft, ToggleRight, Star, Shield, Activity,
  Info, Target, History, List, CheckCircle2, Briefcase, GraduationCap
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

interface MissionItem {
  text: string
}

interface TimelineItem {
  year: string
  title: string
  description: string
  photo?: string | null
  photoTitle?: string
  photoSubtitle?: string
}

interface FasilitasItem {
  name: string
  description: string
  icon: string
  photo?: string | null
  photoTitle?: string
  photoSubtitle?: string
}

interface PrestasiItem {
  year: string
  category: string
  title: string
  description?: string
  photo?: string | null
  photoTitle?: string
  photoSubtitle?: string
}

interface StrukturItem {
  role: string
  name: string
  level: number
  photo?: string | null
  photoTitle?: string
  photoSubtitle?: string
}

interface GuruItem {
  name: string
  subject: string
  education: string
  gelar?: string
  photo?: string | null
  photoTitle?: string
  photoSubtitle?: string
}

interface TestimoniItem {
  name: string
  role: string
  quote: string
  rating: number
  photo?: string | null
  photoTitle?: string
  photoSubtitle?: string
}

interface ProfilSettings {
  general: {
    schoolName: string
    tagline: string
    description: string
    establishedYear: string
    accreditation: string
    npsn: string
    bannerPhoto?: string | null
    photoTitle?: string
    photoSubtitle?: string
  }
  visionMission: {
    vision: string
    mission: MissionItem[]
    goals: MissionItem[]
  }
  history: {
    content: string
    timeline: TimelineItem[]
  }
  facilities: {
    items: FasilitasItem[]
  }
  achievements: {
    items: PrestasiItem[]
  }
  teachers: {
    items: GuruItem[]
  }
  organization: {
    items: StrukturItem[]
  }
}

// --- Defaults ---

const DEFAULT_PROFIL: ProfilSettings = {
  general: {
    schoolName: 'MTs Al-Yakin',
    tagline: 'Membentuk Generasi Qurani dan Berprestasi',
    description: 'Madrasah Tsanawiyah Al-Yakin adalah lembaga pendidikan menengah yang berdedikasi...',
    establishedYear: '1995',
    accreditation: 'A',
    npsn: '12345678',
    bannerPhoto: null,
    photoTitle: '',
    photoSubtitle: ''
  },
  visionMission: {
    vision: 'Terwujudnya lulusan yang cerdas, berakhlak mulia, dan unggul dalam prestasi.',
    mission: [{ text: 'Menyelenggarakan pendidikan agama yang berkualitas' }],
    goals: [{ text: 'Melahirkan lulusan yang hafal minimal 2 juz Al-Quran' }]
  },
  history: {
    content: 'MTs Al-Yakin didirikan pada tahun 1995 oleh Yayasan Pendidikan Islam...',
    timeline: [{ year: '1995', title: 'Pendirian Madrasah', description: 'Madrasah resmi berdiri.', photo: null, photoTitle: '', photoSubtitle: '' }]
  },
  facilities: {
    items: [{ name: 'Laboratorium Komputer', description: 'Dilengkapi 40 unit komputer modern', icon: '💻', photo: null, photoTitle: '', photoSubtitle: '' }]
  },
  achievements: {
    items: [{ year: '2023', category: 'Akademik', title: 'Juara 1 KSN Matematika', description: 'Tingkat Kabupaten', photo: null, photoTitle: '', photoSubtitle: '' }]
  },
  teachers: {
    items: [{ name: 'H. Ahmad Fauzi, S.Pd.I', gelar: 'Kepala Madrasah', subject: 'Fiqih', education: 'S2 Pendidikan Islam', photo: null, photoTitle: '', photoSubtitle: '' }]
  },
  organization: {
    items: [{ role: 'Kepala Madrasah', name: 'H. Ahmad Fauzi', level: 1, photo: null, photoTitle: '', photoSubtitle: '' }]
  }
}

// --- Component ---

export default function ProfilSettingsPage() {
  const [settings, setSettings] = useState<ProfilSettings>(DEFAULT_PROFIL)
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // 1. Try Firestore first
      const fsData = await getSettings('profile');
      let fetched = fsData;

      // 2. Fallback to API if Firestore is empty
      if (!fetched) {
        const response = await get('/settings/profile');
        if (response && response.data) {
          fetched = response.data;
        } else if (response && !response.hasOwnProperty('success')) {
          fetched = response;
        }
      }

      if (fetched) {
        setSettings(fetched as any);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Cek auth dulu
      const { getAuth } = await import('firebase/auth')
      const auth = getAuth()
      const user = auth.currentUser
      
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
        doc(db, 'siteSettings', 'profile'),
        {
          ...settings,
          updatedAt: new Date().toISOString(),
          updatedBy: user.email
        },
        { merge: true }
      )
      
      setIsDirty(false)
      if (typeof setLastSaved === 'function') setLastSaved(new Date())
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

  const updateSection = (section: keyof ProfilSettings, data: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
    setIsDirty(true)
  }

  const tabs = [
    { id: 'general', label: 'Umum', icon: Info },
    { id: 'visionMission', label: 'Visi Misi', icon: Target },
    { id: 'history', label: 'Sejarah', icon: History },
    { id: 'facilities', label: 'Fasilitas', icon: Building },
    { id: 'achievements', label: 'Prestasi', icon: Trophy },
    { id: 'organization', label: 'Struktur', icon: GitBranch },
    { id: 'teachers', label: 'Guru', icon: Users },
  ]

  // --- Render Preview Section ---

  const renderPreview = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="bg-white h-full overflow-y-auto">
            <div className={`relative h-32 flex items-center justify-center text-center p-6 overflow-hidden ${!settings.general.bannerPhoto ? 'bg-green-600' : 'bg-gray-900'}`}>
              {settings.general.bannerPhoto && (
                <div className="absolute inset-0 opacity-40">
                  <img src={settings.general.bannerPhoto} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative z-10">
                <h2 className="text-white font-black text-sm uppercase tracking-widest">{settings.general.schoolName}</h2>
                <p className="text-green-50 text-[8px] opacity-80 mt-1">{settings.general.tagline}</p>
                {settings.general.bannerPhoto && (
                  <div className="mt-2 text-[7px] text-white/60 font-bold uppercase tracking-tighter">
                    {settings.general.photoTitle}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                 <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <div className="text-[10px] font-black text-green-600">{settings.general.accreditation}</div>
                    <div className="text-[7px] text-gray-400 font-bold uppercase">Akreditasi</div>
                 </div>
                 <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <div className="text-[10px] font-black text-green-600">{settings.general.npsn}</div>
                    <div className="text-[7px] text-gray-400 font-bold uppercase">NPSN</div>
                 </div>
              </div>
              <p className="text-[9px] text-gray-500 leading-relaxed line-clamp-[8]">{settings.general.description}</p>
            </div>
          </div>
        )
      case 'visionMission':
        return (
          <div className="p-6 bg-white h-full overflow-y-auto space-y-6">
            <div className="bg-green-50 p-4 rounded-3xl border-2 border-green-100/50 text-center space-y-2">
               <h3 className="text-[10px] font-black text-green-700 uppercase tracking-widest">Visi</h3>
               <p className="text-sm font-bold text-gray-800 italic leading-tight">"{settings.visionMission.vision}"</p>
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <div className="h-[1px] flex-1 bg-gray-100" />
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Misi Sekolah</h3>
                 <div className="h-[1px] flex-1 bg-gray-100" />
               </div>
               <ul className="space-y-2">
                 {settings.visionMission.mission.map((m, i) => (
                   <li key={i} className="flex gap-3 items-start">
                     <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                     <span className="text-[10px] text-gray-600 font-medium leading-relaxed">{m.text}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        )
      case 'history':
        return (
          <div className="p-6 bg-white h-full overflow-y-auto space-y-6">
             <div className="space-y-2">
               <h3 className="text-xs font-black text-gray-900 border-l-4 border-green-600 pl-3 uppercase tracking-wider">Sejarah Singkat</h3>
               <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-4">{settings.history.content}</p>
             </div>
             <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-green-100">
                {settings.history.timeline.map((t, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[20px] top-1 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-sm z-10" />
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-1">
                       <span className="text-[9px] font-black text-green-600">{t.year}</span>
                       <h4 className="text-[10px] font-black text-gray-900 leading-tight">{t.title}</h4>
                       <p className="text-[8px] text-gray-500 leading-relaxed">{t.description}</p>
                       {t.photo && (
                         <div className="mt-2 rounded-xl overflow-hidden aspect-video border border-white">
                           <img src={t.photo} className="w-full h-full object-cover" />
                         </div>
                       )}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )
      case 'facilities':
        return (
          <div className="p-6 bg-gray-50 h-full overflow-y-auto">
             <div className="grid grid-cols-2 gap-3">
                {settings.facilities.items.map((f, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="aspect-square bg-green-50 flex items-center justify-center relative">
                       {f.photo ? (
                         <img src={f.photo} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-3xl">{f.icon || '🏫'}</span>
                       )}
                       {f.photo && <div className="absolute inset-0 bg-black/20" />}
                    </div>
                    <div className="p-2 space-y-0.5">
                       <h4 className="text-[9px] font-black text-gray-900 truncate uppercase">{f.name}</h4>
                       <p className="text-[7px] text-gray-400 line-clamp-1">{f.description}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )
      case 'achievements':
        return (
          <div className="p-6 bg-white h-full overflow-y-auto space-y-4">
             {settings.achievements.items.map((a, i) => (
               <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 group">
                  <div className="w-16 h-16 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                    {a.photo ? (
                      <img src={a.photo} className="w-full h-full object-cover" />
                    ) : (
                      <Trophy className="w-8 h-8 text-yellow-500" />
                    )}
                  </div>
                  <div className="space-y-1 pt-0.5">
                     <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase">{a.year}</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase">{a.category}</span>
                     </div>
                     <h4 className="text-[10px] font-black text-gray-900 leading-tight">{a.title}</h4>
                     <p className="text-[8px] text-gray-500 line-clamp-1">{a.description}</p>
                  </div>
               </div>
             ))}
          </div>
        )
      case 'organization':
        return (
          <div className="p-4 bg-gray-50 h-full overflow-y-auto flex flex-col items-center gap-6">
             {settings.organization.items.map((item, i) => (
               <div key={i} className="w-full max-w-[200px] bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center relative space-y-2">
                 <div className="w-12 h-12 rounded-full mx-auto overflow-hidden bg-green-100 flex items-center justify-center border-2 border-white shadow-md">
                    {item.photo ? (
                      <img src={item.photo} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-green-700 font-black text-xs">{item.name.charAt(0).toUpperCase()}</span>
                    )}
                 </div>
                 <div>
                    <h4 className="text-[9px] font-black text-gray-900 leading-none">{item.name}</h4>
                    <p className="text-[7px] text-green-600 font-bold uppercase mt-1">{item.role}</p>
                 </div>
               </div>
             ))}
          </div>
        )
      case 'teachers':
        return (
          <div className="p-6 bg-gray-50 h-full overflow-y-auto">
             <div className="grid grid-cols-2 gap-3">
                {settings.teachers.items.map((t, i) => (
                  <div key={i} className="bg-white p-3 rounded-2xl border border-gray-100 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full mx-auto bg-green-50 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                       {t.photo ? (
                         <img src={t.photo} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-green-600 font-black text-xs">{t.name.charAt(0).toUpperCase()}</span>
                       )}
                    </div>
                    <div>
                       <h4 className="text-[9px] font-black text-gray-900 leading-tight line-clamp-1">{t.name}</h4>
                       <p className="text-[7px] text-green-600 font-bold uppercase">{t.subject}</p>
                       <p className="text-[6px] text-gray-400 mt-1">{t.education}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )
      default:
        return null
    }
  }

  // --- Render Form Content ---

  const renderForm = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-8">
            <SectionCard title="Informasi Identitas" icon={Info} description="Data dasar sekolah yang muncul di berbagai halaman.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Nama Sekolah</label>
                  <input value={settings.general.schoolName} onChange={(e) => updateSection('general', { schoolName: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Tagline</label>
                  <input value={settings.general.tagline} onChange={(e) => updateSection('general', { tagline: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-gray-500 tracking-wider">NPSN</label>
                  <input value={settings.general.npsn} onChange={(e) => updateSection('general', { npsn: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Akreditasi</label>
                  <input value={settings.general.accreditation} onChange={(e) => updateSection('general', { accreditation: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Deskripsi Singkat</label>
                <textarea value={settings.general.description} onChange={(e) => updateSection('general', { description: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" rows={4} />
              </div>
            </SectionCard>

            <SectionCard title="Banner Foto Profil" icon={ImageIcon}>
               <ImageUploadField 
                 label="Foto Banner (Opsional)" 
                 value={settings.general.bannerPhoto ?? null}
                 onChange={(url) => updateSection('general', { bannerPhoto: url })}
                 description="Akan tampil sebagai background header halaman profil."
               />
               {settings.general.bannerPhoto && (
                 <div className="grid grid-cols-2 gap-4 mt-4 animate-in slide-in-from-top-2">
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase text-gray-400">Judul Foto</label>
                       <input value={settings.general.photoTitle} onChange={(e) => updateSection('general', { photoTitle: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase text-gray-400">Sub-judul Foto</label>
                       <input value={settings.general.photoSubtitle} onChange={(e) => updateSection('general', { photoSubtitle: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                    </div>
                 </div>
               )}
            </SectionCard>
          </div>
        )
      case 'visionMission':
        return (
          <div className="space-y-8">
            <SectionCard title="Visi Sekolah" icon={Target}>
               <textarea value={settings.visionMission.vision} onChange={(e) => updateSection('visionMission', { vision: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold text-center italic" rows={3} />
            </SectionCard>
            <SectionCard title="Misi & Tujuan" icon={List}>
               <div className="space-y-8">
                  <div>
                    <h4 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">Daftar Misi</h4>
                    <ListEditor
                      items={settings.visionMission.mission}
                      onChange={(mission) => updateSection('visionMission', { mission })}
                      createNew={() => ({ text: 'Misi baru...' })}
                      renderItem={(item, index, onChange) => (
                        <input value={item.text} onChange={(e) => onChange({ ...item, text: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                      )}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">Tujuan Madrasah</h4>
                    <ListEditor
                      items={settings.visionMission.goals}
                      onChange={(goals) => updateSection('visionMission', { goals })}
                      createNew={() => ({ text: 'Tujuan baru...' })}
                      renderItem={(item, index, onChange) => (
                        <input value={item.text} onChange={(e) => onChange({ ...item, text: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                      )}
                    />
                  </div>
               </div>
            </SectionCard>
          </div>
        )
      case 'history':
        return (
          <div className="space-y-8">
            <SectionCard title="Narasi Sejarah" icon={History}>
               <textarea value={settings.history.content} onChange={(e) => updateSection('history', { content: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200" rows={6} />
            </SectionCard>
            <SectionCard title="Timeline Peristiwa" icon={Clock}>
               <ListEditor
                 items={settings.history.timeline}
                 onChange={(timeline) => updateSection('history', { timeline })}
                 createNew={() => ({ year: '2024', title: 'Peristiwa Baru', description: 'Detail...', photo: null, photoTitle: '', photoSubtitle: '' })}
                 renderItem={(item, index, onChange) => {
                   const typedItem = item as TimelineItem
                   return (
                     <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400">Tahun</label>
                            <input value={typedItem.year} onChange={(e) => onChange({ ...typedItem, year: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold" />
                          </div>
                          <div className="col-span-3 space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400">Judul Peristiwa</label>
                            <input value={typedItem.title} onChange={(e) => onChange({ ...typedItem, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold" />
                          </div>
                        </div>
                        <textarea value={typedItem.description} onChange={(e) => onChange({ ...typedItem, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200" rows={2} />
                        <ImageUploadField label="Foto (Opsional)" value={typedItem.photo ?? null} onChange={(url) => onChange({ ...typedItem, photo: url })} aspectRatio="video" />
                        {typedItem.photo && (
                          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-1">
                            <input value={typedItem.photoTitle} onChange={(e) => onChange({ ...typedItem, photoTitle: e.target.value })} placeholder="Judul Foto" className="px-3 py-2 rounded-xl border text-xs" />
                            <input value={typedItem.photoSubtitle} onChange={(e) => onChange({ ...typedItem, photoSubtitle: e.target.value })} placeholder="Sub-judul Foto" className="px-3 py-2 rounded-xl border text-xs" />
                          </div>
                        )}
                     </div>
                   )
                 }}
               />
            </SectionCard>
          </div>
        )
      case 'facilities':
        return (
          <SectionCard title="Daftar Fasilitas" icon={Building}>
            <ListEditor
              items={settings.facilities.items}
              onChange={(items) => updateSection('facilities', { items })}
              createNew={() => ({ name: '', description: '', icon: '🏫', photo: null, photoTitle: '', photoSubtitle: '' })}
              renderItem={(item, index, onChange) => {
                const typedItem = item as FasilitasItem
                return (
                  <div className="space-y-4">
                     <div className="flex gap-4">
                        <div className="w-20 space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400 text-center">Icon</label>
                           <input value={typedItem.icon} onChange={(e) => onChange({ ...typedItem, icon: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xl text-center" />
                        </div>
                        <div className="flex-1 space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400">Nama Fasilitas</label>
                           <input value={typedItem.name} onChange={(e) => onChange({ ...typedItem, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold uppercase" />
                        </div>
                     </div>
                     <textarea value={typedItem.description} onChange={(e) => onChange({ ...typedItem, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200" rows={2} />
                     <ImageUploadField label="Foto Fasilitas (Opsional)" value={typedItem.photo ?? null} onChange={(url) => onChange({ ...typedItem, photo: url })} />
                     {typedItem.photo && (
                       <div className="animate-in slide-in-from-top-1">
                          <label className="text-[10px] font-black uppercase text-gray-400">Judul Foto (Required)</label>
                          <input value={typedItem.photoTitle} onChange={(e) => onChange({ ...typedItem, photoTitle: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold" />
                       </div>
                     )}
                  </div>
                )
              }}
            />
          </SectionCard>
        )
      case 'achievements':
        return (
          <SectionCard title="Daftar Prestasi" icon={Trophy}>
            <ListEditor
              items={settings.achievements.items}
              onChange={(items) => updateSection('achievements', { items })}
              createNew={() => ({ year: new Date().getFullYear().toString(), category: 'Akademik', title: '', description: '', photo: null, photoTitle: '', photoSubtitle: '' })}
              renderItem={(item, index, onChange) => {
                const typedItem = item as PrestasiItem
                return (
                  <div className="space-y-4">
                     <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400">Tahun</label>
                           <input value={typedItem.year} onChange={(e) => onChange({ ...typedItem, year: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400">Kategori</label>
                           <input value={typedItem.category} onChange={(e) => onChange({ ...typedItem, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                        </div>
                        <div className="col-span-2 space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400">Nama Prestasi</label>
                           <input value={typedItem.title} onChange={(e) => onChange({ ...typedItem, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold" />
                        </div>
                     </div>
                     <input value={typedItem.description} onChange={(e) => onChange({ ...typedItem, description: e.target.value })} placeholder="Deskripsi Singkat" className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                     <ImageUploadField label="Foto Dokumentasi (Opsional)" value={typedItem.photo ?? null} onChange={(url) => onChange({ ...typedItem, photo: url })} />
                     {typedItem.photo && (
                       <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-1">
                          <input value={typedItem.photoTitle} onChange={(e) => onChange({ ...typedItem, photoTitle: e.target.value })} placeholder="Judul Foto" className="px-3 py-2 rounded-xl border text-xs" />
                          <input value={typedItem.photoSubtitle} onChange={(e) => onChange({ ...typedItem, photoSubtitle: e.target.value })} placeholder="Sub-judul Foto" className="px-3 py-2 rounded-xl border text-xs" />
                       </div>
                     )}
                  </div>
                )
              }}
            />
          </SectionCard>
        )
      case 'organization':
        return (
          <SectionCard title="Struktur Organisasi" icon={GitBranch}>
            <ListEditor
              items={settings.organization.items}
              onChange={(items) => updateSection('organization', { items })}
              createNew={() => ({ role: '', name: '', level: 1, photo: null, photoTitle: '', photoSubtitle: '' })}
              renderItem={(item, index, onChange) => {
                const typedItem = item as StrukturItem
                return (
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400">Jabatan</label>
                           <input value={typedItem.role} onChange={(e) => onChange({ ...typedItem, role: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400">Nama Lengkap</label>
                           <input value={typedItem.name} onChange={(e) => onChange({ ...typedItem, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 items-end">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400">Level Hierarki (1=Top)</label>
                           <input type="number" value={typedItem.level} onChange={(e) => onChange({ ...typedItem, level: parseInt(e.target.value) })} className="w-20 px-3 py-2 rounded-xl border border-gray-200 text-center font-bold" />
                        </div>
                        <ImageUploadField label="Foto (Opsional)" value={typedItem.photo ?? null} onChange={(url) => onChange({ ...typedItem, photo: url })} aspectRatio="square" />
                     </div>
                  </div>
                )
              }}
            />
          </SectionCard>
        )
      case 'teachers':
        return (
          <SectionCard title="Data Tenaga Pendidik" icon={Users}>
            <ListEditor
              items={settings.teachers.items}
              onChange={(items) => updateSection('teachers', { items })}
              createNew={() => ({ name: '', subject: '', education: '', gelar: '', photo: null, photoTitle: '', photoSubtitle: '' })}
              renderItem={(item, index, onChange) => {
                const typedItem = item as GuruItem
                return (
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400">Nama & Gelar</label>
                           <input value={typedItem.name} onChange={(e) => onChange({ ...typedItem, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400">Mata Pelajaran</label>
                           <input value={typedItem.subject} onChange={(e) => onChange({ ...typedItem, subject: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-green-600 uppercase" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400">Jabatan/Tugas</label>
                           <input value={typedItem.gelar} onChange={(e) => onChange({ ...typedItem, gelar: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-gray-400">Pend. Terakhir</label>
                           <input value={typedItem.education} onChange={(e) => onChange({ ...typedItem, education: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                        </div>
                     </div>
                     <ImageUploadField label="Foto Guru (Opsional)" value={typedItem.photo ?? null} onChange={(url) => onChange({ ...typedItem, photo: url })} aspectRatio="square" />
                  </div>
                )
              }}
            />
          </SectionCard>
        )
      default:
        return null
    }
  }

  return (
    <EditorLayout
      title="Profil Sekolah"
      description="Kelola informasi identitas, visi misi, sejarah, hingga tenaga pendidik dengan visual preview."
      preview={renderPreview()}
      onSave={handleSave}
      isSaving={isSaving}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-2">
        {renderForm()}
      </div>
    </EditorLayout>
  )
}
