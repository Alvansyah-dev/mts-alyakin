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
  Send, AlertCircle, CheckCircle2, Info, Layout, MousePointer2
} from 'lucide-react'
import EditorLayout from '@/components/admin/EditorLayout'
import SectionCard from '@/components/admin/SectionCard'
import { get, put } from '@/lib/api'
import { toast } from 'sonner'
import { getSettings, saveSettings } from '@/lib/firestore'

// --- Interfaces ---

interface WhatsappSettings {
  isEnabled: boolean
  phoneNumber: string
  defaultMessage: string
  ppdbMessage: string
  consultationMessage: string
}

// --- Defaults ---

const DEFAULT_SETTINGS: WhatsappSettings = {
  isEnabled: true,
  phoneNumber: '6281234567890',
  defaultMessage: 'Halo Admin MTs Al-Yakin, saya ingin menanyakan informasi seputar sekolah.',
  ppdbMessage: 'Halo, saya ingin menanyakan informasi mengenai pendaftaran siswa baru (PPDB).',
  consultationMessage: 'Halo, saya ingin berkonsultasi mengenai masalah pendidikan/siswa.'
}

export default function WhatsappSettingsPage() {
  const [settings, setSettings] = useState<WhatsappSettings>(DEFAULT_SETTINGS)
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // 1. Try Firestore first
      const fsData = await getSettings('whatsapp');
      let fetched = fsData;

      // 2. Fallback to API if Firestore is empty
      if (!fetched) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const response = await fetch(`${apiUrl}/api/settings/whatsapp`)
        const data = await response.json()
        if (data && data.success) {
          fetched = data.data || DEFAULT_SETTINGS
        }
      }

      if (fetched) {
        setSettings(fetched as any)
      }
    } catch (err) {
      console.error('Failed to fetch:', err)
    }
  }

  const handleSave = async () => {
    // Validation
    if (!settings.phoneNumber.startsWith('62')) {
      toast.error('Nomor WhatsApp harus diawali dengan 62')
      return
    }
    if (settings.phoneNumber.length < 11) {
      toast.error('Nomor WhatsApp tidak valid (terlalu pendek)')
      return
    }

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
        doc(db, 'siteSettings', 'whatsapp'),
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

  const updateSettings = (data: Partial<WhatsappSettings>) => {
    setSettings(prev => ({ ...prev, ...data }))
    setIsDirty(true)
  }

  const testWhatsApp = (type: 'default' | 'ppdb' | 'consult') => {
    const msg = type === 'ppdb' ? settings.ppdbMessage : type === 'consult' ? settings.consultationMessage : settings.defaultMessage
    const url = `https://wa.me/${settings.phoneNumber}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  // --- Render Preview (Smartphone Simulation) ---

  const renderPreview = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-50">
       <div className="relative w-[260px] h-[520px] bg-gray-900 rounded-[3rem] border-[6px] border-gray-800 shadow-2xl overflow-hidden">
          {/* Speaker/Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-20 flex items-center justify-center">
             <div className="w-8 h-1 bg-gray-700 rounded-full" />
          </div>

          {/* Screen Content */}
          <div className="absolute inset-0 bg-white p-4 pt-12 space-y-4">
             {/* Mock App Header */}
             <div className="h-8 bg-green-600 rounded-xl flex items-center px-3 justify-between">
                <div className="flex gap-1">
                   <div className="w-1 h-1 bg-white/40 rounded-full" />
                   <div className="w-1 h-1 bg-white/40 rounded-full" />
                </div>
                <div className="w-8 h-1.5 bg-white/20 rounded-full" />
             </div>

             {/* Mock Website Content */}
             <div className="space-y-3">
                <div className="h-24 bg-gray-100 rounded-2xl flex items-center justify-center">
                   <Type className="w-6 h-6 text-gray-200" />
                </div>
                <div className="space-y-1.5">
                   <div className="h-2 w-3/4 bg-gray-100 rounded" />
                   <div className="h-2 w-full bg-gray-50 rounded" />
                   <div className="h-2 w-5/6 bg-gray-50 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div className="aspect-square bg-gray-50 rounded-xl" />
                   <div className="aspect-square bg-gray-50 rounded-xl" />
                </div>
             </div>

             {/* Floating Button Simulation */}
             {settings.isEnabled ? (
               <div className="absolute bottom-6 right-6 animate-bounce shadow-xl">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                     <MessageCircle className="w-7 h-7 fill-current" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white">1</div>
               </div>
             ) : (
               <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="bg-white/90 p-4 rounded-2xl border border-gray-100 shadow-xl text-center space-y-2">
                     <EyeOff className="w-6 h-6 text-gray-300 mx-auto" />
                     <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">WhatsApp Nonaktif</p>
                  </div>
               </div>
             )}
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-800 rounded-full" />
       </div>

       <div className="mt-8 flex flex-col gap-3 w-full max-w-[260px]">
          <button 
            onClick={() => testWhatsApp('default')}
            className="w-full bg-green-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-600/20 active:scale-95 transition-all"
          >
             <ExternalLink className="w-3.5 h-3.5" />
             Test Buka WhatsApp
          </button>
          <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest text-center">
            Simulasi tampilan pada <br /> perangkat mobile.
          </p>
       </div>
    </div>
  )

  return (
    <EditorLayout
      title="Integrasi WhatsApp"
      description="Kelola layanan chat bantuan dan pesan otomatis untuk mempermudah komunikasi dengan wali murid."
      preview={renderPreview()}
      onSave={handleSave}
      isSaving={isSaving}
      isDirty={isDirty}
    >
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
         <SectionCard title="Status & Nomor" icon={Phone}>
            <div className="flex items-center justify-between p-6 bg-green-50 rounded-3xl border border-green-100 shadow-inner mb-8">
               <div className="space-y-1">
                  <h4 className="font-black text-green-900 uppercase tracking-tight text-sm">Floating Button WhatsApp</h4>
                  <p className="text-xs text-green-700 font-medium">Tampilkan tombol chat mengapung di pojok kanan bawah website.</p>
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

            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Nomor WhatsApp (Admin)</label>
                  <div className="relative">
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-lg">+</div>
                     <input 
                       value={settings.phoneNumber}
                       onChange={(e) => updateSettings({ phoneNumber: e.target.value.replace(/[^0-9]/g, '') })}
                       className="w-full pl-8 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 font-black text-lg focus:ring-2 focus:ring-green-500 transition-all"
                       placeholder="6281234567890"
                     />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                     <AlertCircle className="w-3 h-3" /> Gunakan format 62 (contoh: 6281234567890) tanpa spasi.
                  </p>
               </div>
            </div>
         </SectionCard>

         <SectionCard title="Template Pesan Otomatis" icon={MessageCircle} description="Pesan awal yang akan muncul saat user mengklik tombol WhatsApp.">
            <div className="space-y-8">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <Layout className="w-3 h-3" /> Pesan Umum (Beranda)
                  </label>
                  <textarea 
                    value={settings.defaultMessage}
                    onChange={(e) => updateSettings({ defaultMessage: e.target.value })}
                    className="w-full px-5 py-4 rounded-3xl border border-gray-200 font-medium text-gray-700 leading-relaxed bg-gray-50/30"
                    rows={3}
                    placeholder="Halo Admin..."
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <ClipboardList className="w-3 h-3" /> Pesan Halaman PPDB
                  </label>
                  <textarea 
                    value={settings.ppdbMessage}
                    onChange={(e) => updateSettings({ ppdbMessage: e.target.value })}
                    className="w-full px-5 py-4 rounded-3xl border border-gray-200 font-medium text-gray-700 leading-relaxed bg-gray-50/30"
                    rows={3}
                    placeholder="Halo, tanya PPDB..."
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <MousePointer2 className="w-3 h-3" /> Pesan Halaman Konsultasi
                  </label>
                  <textarea 
                    value={settings.consultationMessage}
                    onChange={(e) => updateSettings({ consultationMessage: e.target.value })}
                    className="w-full px-5 py-4 rounded-3xl border border-gray-200 font-medium text-gray-700 leading-relaxed bg-gray-50/30"
                    rows={3}
                    placeholder="Halo, ingin konsultasi..."
                  />
               </div>
            </div>
         </SectionCard>

         <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-600/20">
               <Info className="w-7 h-7" />
            </div>
            <div className="space-y-2">
               <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">Tips Komunikasi</h4>
               <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  Pesan otomatis yang dipersonalisasi per halaman membantu Admin mengetahui konteks kebutuhan pengirim pesan dengan lebih cepat. Pastikan Admin yang memegang nomor di atas selalu aktif selama jam sekolah.
               </p>
            </div>
         </div>
      </div>
    </EditorLayout>
  )
}
