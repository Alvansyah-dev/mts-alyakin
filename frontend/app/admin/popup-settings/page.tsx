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
  Link as LinkIcon, Layout, MousePointer2, AlertCircle, CheckCircle2
} from 'lucide-react'
import EditorLayout from '@/components/admin/EditorLayout'
import SectionCard from '@/components/admin/SectionCard'
import ImageUploadField from '@/components/admin/ImageUploadField'
import { get, put } from '@/lib/api'
import { toast } from 'sonner'
import { getSettings, saveSettings } from '@/lib/firestore'
// --- Interfaces ---

interface PopupSettings {
  isEnabled: boolean
  title: string
  content: string
  imageUrl?: string
  imageTitle?: string
  imageSubtitle?: string
  ctaText: string
  ctaUrl: string
  position: 'CENTER' | 'BOTTOM_RIGHT'
}

// --- Defaults ---

const DEFAULT_POPUP: PopupSettings = {
  isEnabled: true,
  title: 'Pengumuman PPDB 2024',
  content: 'Pendaftaran Peserta Didik Baru gelombang pertama telah dibuka! Segera daftarkan putra-putri Anda sebelum kuota penuh.',
  imageUrl: '',
  imageTitle: '',
  imageSubtitle: '',
  ctaText: 'Daftar Sekarang',
  ctaUrl: '/ppdb',
  position: 'CENTER'
}

export default function PopupSettingsPage() {
  const [settings, setSettings] = useState<PopupSettings>(DEFAULT_POPUP)
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const fsData = await getSettings('popup');
      if (fsData) {
        setSettings(fsData as any)
      }
    } catch (err) {
      console.error('Failed to fetch popup settings:', err)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Cek auth dari localStorage
      const adminUserStr = typeof window !== 'undefined' ? localStorage.getItem('admin_user') : null;
      if (!adminUserStr) {
        toast.error('Sesi habis. Silakan login ulang.')
        setTimeout(() => {
          window.location.href = '/admin/login'
        }, 1500)
        return
      }
      const adminUser = JSON.parse(adminUserStr)
      
      // Simpan ke Firestore
      const { doc, setDoc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      
      await setDoc(
        doc(db as any, 'siteSettings', 'popup'),
        {
          ...settings,
          updatedAt: new Date().toISOString(),
          updatedBy: adminUser.email
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

  const updateSettings = (data: Partial<PopupSettings>) => {
    setSettings(prev => ({ ...prev, ...data }))
    setIsDirty(true)
  }

  // --- Render Preview (Browser Simulation) ---

  const renderPreview = () => (
    <div className="h-full bg-gray-200 p-8 flex flex-col items-center justify-center relative overflow-hidden">
       {/* Browser Mockup */}
       <div className="w-full max-w-[400px] aspect-[4/3] bg-white rounded-3xl shadow-2xl border-4 border-gray-100 overflow-hidden relative">
          {/* Browser Header */}
          <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-1.5">
             <div className="w-2 h-2 rounded-full bg-red-400" />
             <div className="w-2 h-2 rounded-full bg-yellow-400" />
             <div className="w-2 h-2 rounded-full bg-green-400" />
             <div className="ml-4 h-4 w-32 bg-gray-200 rounded-full" />
          </div>

          {/* Website Mockup Background */}
          <div className="p-4 space-y-4 opacity-10">
             <div className="h-4 w-1/2 bg-gray-200 rounded-full" />
             <div className="h-32 w-full bg-green-100 rounded-2xl" />
             <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-gray-100 rounded-xl" />
                <div className="h-20 bg-gray-100 rounded-xl" />
             </div>
          </div>

          {/* Popup Simulation Overlay */}
          {settings.isEnabled ? (
             <div className={`absolute inset-0 flex p-6 transition-all duration-500 ${settings.position === 'CENTER' ? 'items-center justify-center bg-black/20 backdrop-blur-[2px]' : 'items-end justify-end'}`}>
                <div className={`bg-white rounded-[2rem] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-300 ${settings.position === 'CENTER' ? 'w-full max-w-[280px]' : 'w-full max-w-[220px] m-2'}`}>
                   {settings.imageUrl && (
                      <div className="h-32 bg-gray-100 relative">
                         <img src={settings.imageUrl} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                         <div className="absolute bottom-3 left-4">
                            <p className="text-[10px] font-black text-white uppercase tracking-tight">{settings.imageTitle || 'Headline'}</p>
                            <p className="text-[7px] text-white/70 font-medium">{settings.imageSubtitle}</p>
                         </div>
                      </div>
                   )}
                   <div className="p-5 space-y-3 relative">
                      <button className="absolute top-3 right-3 text-gray-300 hover:text-gray-600 transition-colors">
                         <X className="w-4 h-4" />
                      </button>
                      <div className="space-y-1 pt-1">
                         <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-tight line-clamp-1">{settings.title}</h4>
                         <p className="text-[8px] text-gray-500 font-medium leading-relaxed line-clamp-3">{settings.content}</p>
                      </div>
                      <div className="pt-2">
                         <div className="w-full bg-green-600 text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-center shadow-lg shadow-green-600/20">
                            {settings.ctaText}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          ) : (
             <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                <div className="space-y-2 opacity-30">
                   <EyeOff className="w-12 h-12 text-gray-300 mx-auto" />
                   <p className="text-xs font-black uppercase text-gray-400 tracking-[0.2em]">Popup Tidak Aktif</p>
                </div>
             </div>
          )}
       </div>

       <div className="mt-8 text-center space-y-1">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            Simulasi Tampilan <br /> Pada Browser Desktop
          </p>
       </div>
    </div>
  )

  return (
    <EditorLayout
      title="Manajemen Popup"
      description="Buat pengumuman penting yang akan langsung muncul saat pengunjung membuka website."
      preview={renderPreview()}
      onSave={handleSave}
      isSaving={isSaving}
      isDirty={isDirty}
    >
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
         <SectionCard title="Status & Kontrol" icon={Bell}>
            <div className="flex items-center justify-between p-6 bg-green-50 rounded-3xl border border-green-100 shadow-inner mb-8">
               <div className="space-y-1">
                  <h4 className="font-black text-green-900 uppercase tracking-tight text-sm">Aktifkan Popup</h4>
                  <p className="text-xs text-green-700 font-medium">Tampilkan pengumuman otomatis kepada setiap pengunjung.</p>
               </div>
               <button 
                 onClick={() => updateSettings({ isEnabled: !settings.isEnabled })}
                 className={`relative w-16 h-9 rounded-full transition-all shadow-md ${settings.isEnabled ? 'bg-green-600' : 'bg-gray-300'}`}
               >
                  <div className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full transition-all shadow-sm flex items-center justify-center ${settings.isEnabled ? 'translate-x-7' : 'translate-x-0'}`}>
                     {settings.isEnabled ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-gray-300" />}
                  </div>
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <Type className="w-3 h-3" /> Judul Utama
                  </label>
                  <input 
                    value={settings.title}
                    onChange={(e) => updateSettings({ title: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 font-black text-sm uppercase tracking-tight focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="Contoh: Pengumuman Penting"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <Layout className="w-3 h-3" /> Posisi Popup
                  </label>
                  <div className="flex gap-2">
                     <button 
                       onClick={() => updateSettings({ position: 'CENTER' })}
                       className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider border transition-all ${settings.position === 'CENTER' ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-green-100'}`}
                     >
                       Tengah Layar
                     </button>
                     <button 
                       onClick={() => updateSettings({ position: 'BOTTOM_RIGHT' })}
                       className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider border transition-all ${settings.position === 'BOTTOM_RIGHT' ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-green-100'}`}
                     >
                       Kanan Bawah
                     </button>
                  </div>
               </div>
            </div>

            <div className="space-y-2 mt-6">
               <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Isi Konten / Pesan</label>
               <textarea 
                 value={settings.content}
                 onChange={(e) => updateSettings({ content: e.target.value })}
                 className="w-full px-5 py-4 rounded-3xl border border-gray-200 font-medium text-gray-700 leading-relaxed bg-gray-50/30"
                 rows={4}
                 placeholder="Tulis pesan pengumuman lengkap..."
               />
            </div>
         </SectionCard>

         <SectionCard title="Visual & Aksi" icon={ImageIcon}>
            <div className="space-y-8">
               <ImageUploadField 
                 label="Foto Popup (Opsional)" 
                 value={settings.imageUrl ?? null}
                 onChange={(url) => updateSettings({ imageUrl: url })}
               />
               
               {settings.imageUrl && (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400">Headline Foto</label>
                        <input value={settings.imageTitle} onChange={(e) => updateSettings({ imageTitle: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-xs font-bold" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400">Sub-headline</label>
                        <input value={settings.imageSubtitle} onChange={(e) => updateSettings({ imageSubtitle: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-xs" />
                     </div>
                  </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 border-dashed">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                       <MousePointer2 className="w-3 h-3" /> Teks Tombol CTA
                     </label>
                     <input 
                       value={settings.ctaText}
                       onChange={(e) => updateSettings({ ctaText: e.target.value })}
                       className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 font-bold"
                       placeholder="Contoh: Baca Selengkapnya"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                       <LinkIcon className="w-3 h-3" /> URL Tujuan / Link
                     </label>
                     <input 
                       value={settings.ctaUrl}
                       onChange={(e) => updateSettings({ ctaUrl: e.target.value })}
                       className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-500"
                       placeholder="Contoh: /berita/artikel-1"
                     />
                  </div>
               </div>
            </div>
         </SectionCard>

         <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-600/20">
               <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
               <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">Perhatian Moderasi</h4>
               <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  Popup akan muncul secara otomatis kepada pengunjung. Pastikan konten yang ditampilkan relevan dan tidak mengganggu kenyamanan navigasi pengguna. Gunakan posisi "Kanan Bawah" untuk pengumuman yang bersifat sekunder.
               </p>
            </div>
         </div>
      </div>
    </EditorLayout>
  )
}
