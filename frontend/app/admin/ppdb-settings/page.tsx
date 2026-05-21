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
  CheckCircle2, Search, Filter, Edit2, MoreVertical, AlertCircle, Download, Printer
} from 'lucide-react'
import EditorLayout from '@/components/admin/EditorLayout'
import SectionCard from '@/components/admin/SectionCard'
import TabNav from '@/components/admin/TabNav'
import ListEditor from '@/components/admin/ListEditor'
import ImageUploadField from '@/components/admin/ImageUploadField'
import Modal from '@/components/ui/Modal'
import { get, put, post, del } from '@/lib/api'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

// --- Interfaces ---

interface PpdbStep {
  icon: string
  title: string
  description: string
}

interface PpdbFaq {
  question: string
  answer: string
}

interface PpdbSettings {
  isOpen: boolean
  academicYear: string
  startDate: string
  endDate: string
  quota: number
  registrationFee: number
  bannerPhoto?: string
  photoTitle?: string
  photoSubtitle?: string
  steps: PpdbStep[]
  requirements: string[]
  requiredDocuments: { name: string; note?: string }[]
  faq: PpdbFaq[]
}

interface Pendaftar {
  id: string
  registrationNumber: string
  fullName: string
  gender: string
  previousSchool: string
  phone: string
  email: string
  address: string
  parentName: string
  parentPhone: string
  status: 'PENDING' | 'VERIFIED' | 'ACCEPTED' | 'REJECTED' | 'REVISION'
  createdAt: string
  documents: { name: string; url: string }[]
  adminNotes?: string
}

// --- Defaults ---

const DEFAULT_SETTINGS: PpdbSettings = {
  isOpen: true,
  academicYear: '2024/2025',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  quota: 100,
  registrationFee: 0,
  bannerPhoto: '',
  photoTitle: '',
  photoSubtitle: '',
  steps: [
    { icon: '📝', title: 'Isi Formulir', description: 'Lengkapi data diri calon siswa secara online' },
    { icon: '📂', title: 'Upload Dokumen', description: 'Unggah berkas persyaratan yang dibutuhkan' },
    { icon: '✅', title: 'Verifikasi', description: 'Tim panitia memvalidasi data Anda' },
    { icon: '📢', title: 'Pengumuman', description: 'Hasil seleksi diumumkan melalui website' },
    { icon: '🎒', title: 'Daftar Ulang', description: 'Penyelesaian administrasi bagi yang diterima' }
  ],
  requirements: [
    'Lulus SD/MI atau sederajat',
    'Usia maksimal 15 tahun',
    'Bersedia menaati peraturan madrasah'
  ],
  requiredDocuments: [
    { name: 'FC Akta Kelahiran', note: '3 Lembar' },
    { name: 'FC Kartu Keluarga', note: '3 Lembar' },
    { name: 'Pas Foto 3x4', note: 'Latar Merah, 4 Lembar' }
  ],
  faq: [
    { question: 'Kapan pendaftaran ditutup?', answer: 'Pendaftaran akan ditutup jika kuota sudah terpenuhi atau sesuai jadwal yang ditentukan.' }
  ]
}

export default function PpdbSettingsPage() {
  const [settings, setSettings] = useState<PpdbSettings>(DEFAULT_SETTINGS)
  const [pendaftarList, setPendaftarList] = useState<Pendaftar[]>([])
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedPendaftar, setSelectedPendaftar] = useState<Pendaftar | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { getSettings, getCollectionData } = await import('@/lib/firestore')
      
      const settingsData = await getSettings('ppdb')
      const applicantsData = await getCollectionData('ppdb')
      
      if (settingsData) {
        setSettings(settingsData as any)
      }
      if (applicantsData) {
        setPendaftarList(applicantsData as Pendaftar[])
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
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
        doc(db as any, 'siteSettings', 'ppdb'),
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

  const handleUpdateStatus = async () => {
    if (!selectedPendaftar) return
    setIsSaving(true)
    try {
      const { updateDocument } = await import('@/lib/firestore')
      await updateDocument('ppdb', selectedPendaftar.id, {
        status: selectedPendaftar.status,
        adminNotes: selectedPendaftar.adminNotes
      })
      toast.success('Status pendaftar berhasil diperbarui')
      setSelectedPendaftar(null)
      fetchData()
    } catch (err) {
      toast.error('Gagal memperbarui status')
    } finally {
      setIsSaving(false)
    }
  }

  const updateSection = (data: Partial<PpdbSettings>) => {
    setSettings(prev => ({ ...prev, ...data }))
    setIsDirty(true)
  }

  const stats = {
    total: pendaftarList.length,
    pending: pendaftarList.filter(p => p.status === 'PENDING').length,
    verified: pendaftarList.filter(p => p.status === 'VERIFIED').length,
    accepted: pendaftarList.filter(p => p.status === 'ACCEPTED').length,
    rejected: pendaftarList.filter(p => p.status === 'REJECTED').length,
    revision: pendaftarList.filter(p => p.status === 'REVISION').length,
  }

  const tabs = [
    { id: 'general', label: 'Umum', icon: Settings },
    { id: 'workflow', label: 'Alur', icon: GitMerge },
    { id: 'requirements', label: 'Syarat', icon: ClipboardList },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'data', label: 'Pendaftar', icon: Users },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'VERIFIED': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'ACCEPTED': return 'bg-green-50 text-green-600 border-green-100'
      case 'REJECTED': return 'bg-red-50 text-red-600 border-red-100'
      case 'REVISION': return 'bg-purple-50 text-purple-600 border-purple-100'
      default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  // --- Render Previews ---

  const renderPreview = () => {
    if (activeTab === 'data') {
      return (
        <div className="h-full bg-gray-50 p-6 flex flex-col items-center justify-center text-center space-y-4">
           <Users className="w-12 h-12 text-gray-200" />
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-relaxed">
             Dashboard Pendaftar <br /> Preview Tidak Tersedia
           </h3>
        </div>
      )
    }

    return (
      <div className="bg-white h-full overflow-y-auto">
        {/* Banner Preview */}
        <div className={`relative h-48 flex flex-col items-center justify-center text-center p-8 overflow-hidden ${!settings.bannerPhoto ? 'bg-green-700' : 'bg-gray-900'}`}>
           {settings.bannerPhoto && (
             <div className="absolute inset-0 opacity-40">
               <img src={settings.bannerPhoto} className="w-full h-full object-cover" />
             </div>
           )}
           <div className="relative z-10 space-y-3">
             <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border shadow-lg ${settings.isOpen ? 'bg-white text-green-600 border-white' : 'bg-red-600 text-white border-red-600'}`}>
                {settings.isOpen ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                PPDB {settings.isOpen ? 'Dibuka' : 'Ditutup'}
             </div>
             <h2 className="text-white font-black text-xl leading-none tracking-tight uppercase">PENDAFTARAN SISWA BARU <br /> {settings.academicYear}</h2>
             <p className="text-green-50 text-[9px] opacity-80 max-w-[240px] mx-auto line-clamp-2">{settings.photoSubtitle || 'Selamat datang di portal pendaftaran online MTs Al-Yakin.'}</p>
           </div>
        </div>

        <div className="p-6 space-y-8">
           {/* Alur Preview */}
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Alur Pendaftaran</h4>
              <div className="flex justify-between items-start gap-1">
                 {settings.steps.slice(0, 5).map((step, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center text-center space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-lg border-2 border-white shadow-sm">{step.icon}</div>
                      <div className="text-[7px] font-black text-gray-900 uppercase leading-tight">{step.title}</div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Stats Preview */}
           <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                 <div className="text-xs font-black text-green-600">{settings.quota}</div>
                 <div className="text-[7px] text-gray-400 font-bold uppercase">Kuota</div>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                 <div className="text-xs font-black text-green-600">{settings.registrationFee === 0 ? 'GRATIS' : `Rp ${settings.registrationFee.toLocaleString()}`}</div>
                 <div className="text-[7px] text-gray-400 font-bold uppercase">Biaya</div>
              </div>
           </div>

           {/* FAQ Preview */}
           <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Tanya Jawab (FAQ)</h4>
              <div className="space-y-2">
                 {settings.faq.slice(0, 2).map((f, i) => (
                   <div key={i} className="p-3 rounded-xl border border-gray-100 flex justify-between items-center group">
                      <span className="text-[9px] font-bold text-gray-700">{f.question}</span>
                      <ChevronDown className="w-3 h-3 text-gray-300" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    )
  }

  // --- Render Tabs ---

  const renderGeneralTab = () => (
    <div className="space-y-8">
      <SectionCard title="Status Pendaftaran" icon={AlertCircle}>
         <div className="flex items-center gap-6">
            <button 
              onClick={() => updateSection({ isOpen: !settings.isOpen })}
              className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all group ${settings.isOpen ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200 opacity-50'}`}
            >
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${settings.isOpen ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-300'}`}>
                  <CheckCircle2 className="w-7 h-7" />
               </div>
               <div className="text-center">
                  <h4 className={`font-black uppercase tracking-widest text-xs ${settings.isOpen ? 'text-green-700' : 'text-gray-400'}`}>PPDB DIBUKA</h4>
                  <p className="text-[10px] font-medium text-gray-500 mt-1">Calon siswa dapat mengisi formulir.</p>
               </div>
            </button>
            <button 
              onClick={() => updateSection({ isOpen: !settings.isOpen })}
              className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all group ${!settings.isOpen ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-200 opacity-50'}`}
            >
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${!settings.isOpen ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-300'}`}>
                  <XCircle className="w-7 h-7" />
               </div>
               <div className="text-center">
                  <h4 className={`font-black uppercase tracking-widest text-xs ${!settings.isOpen ? 'text-red-700' : 'text-gray-400'}`}>PPDB DITUTUP</h4>
                  <p className="text-[10px] font-medium text-gray-500 mt-1">Formulir pendaftaran dinonaktifkan.</p>
               </div>
            </button>
         </div>
      </SectionCard>

      <SectionCard title="Informasi Jadwal & Kuota" icon={Calendar}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs font-black uppercase text-gray-400">Tahun Ajaran</label>
               <input 
                 value={settings.academicYear} 
                 onChange={(e) => updateSection({ academicYear: e.target.value })}
                 className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold"
                 placeholder="Contoh: 2024/2025"
               />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-black uppercase text-gray-400">Kuota Siswa (Orang)</label>
               <input 
                 type="number"
                 value={settings.quota} 
                 onChange={(e) => updateSection({ quota: parseInt(e.target.value) })}
                 className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold"
               />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-black uppercase text-gray-400">Tanggal Mulai</label>
               <input 
                 type="date"
                 value={settings.startDate} 
                 onChange={(e) => updateSection({ startDate: e.target.value })}
                 className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold"
               />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-black uppercase text-gray-400">Tanggal Selesai</label>
               <input 
                 type="date"
                 value={settings.endDate} 
                 onChange={(e) => updateSection({ endDate: e.target.value })}
                 className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold"
               />
            </div>
         </div>
         <div className="mt-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <label className="text-xs font-black uppercase text-gray-400 block mb-3">Biaya Pendaftaran (Rp)</label>
            <div className="flex items-center gap-4">
               <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">Rp</div>
                  <input 
                    type="number"
                    value={settings.registrationFee} 
                    onChange={(e) => updateSection({ registrationFee: parseInt(e.target.value) })}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 font-bold"
                  />
               </div>
               <div className="text-xs font-medium text-gray-500">Ketik 0 jika pendaftaran gratis.</div>
            </div>
         </div>
      </SectionCard>

      <SectionCard title="Banner Halaman PPDB" icon={ImageIcon}>
         <ImageUploadField 
           label="Foto Banner (Opsional)" 
           value={settings.bannerPhoto ?? null}
           onChange={(url) => updateSection({ bannerPhoto: url })}
         />
         {settings.bannerPhoto && (
            <div className="grid grid-cols-2 gap-4 mt-4 animate-in slide-in-from-top-2">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Judul Banner</label>
                  <input value={settings.photoTitle} onChange={(e) => updateSection({ photoTitle: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-xs font-bold" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Deskripsi/Sub-judul</label>
                  <input value={settings.photoSubtitle} onChange={(e) => updateSection({ photoSubtitle: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-xs" />
               </div>
            </div>
         )}
      </SectionCard>
    </div>
  )

  const renderWorkflowTab = () => (
    <SectionCard title="Alur Pendaftaran" icon={GitMerge} description="Langkah-langkah yang harus dilalui calon pendaftar.">
       <ListEditor
         items={settings.steps}
         onChange={(steps) => updateSection({ steps })}
         createNew={() => ({ icon: '📝', title: 'Langkah Baru', description: 'Detail...' })}
         renderItem={(item, index, onChange) => (
           <div className="space-y-4">
              <div className="flex gap-4">
                 <div className="w-16 space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 text-center">Icon</label>
                    <input value={item.icon} onChange={(e) => onChange({ ...item, icon: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-xl text-center" />
                 </div>
                 <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Nama Langkah</label>
                    <input value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border font-bold uppercase tracking-tight" />
                 </div>
              </div>
              <textarea 
                value={item.description} 
                onChange={(e) => onChange({ ...item, description: e.target.value })} 
                className="w-full px-3 py-2 rounded-xl border text-sm" 
                rows={2} 
                placeholder="Penjelasan langkah ini..."
              />
           </div>
         )}
       />
    </SectionCard>
  )

  const renderRequirementsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <SectionCard title="Persyaratan Umum" icon={CheckCircle}>
          <ListEditor
            items={settings.requirements}
            onChange={(requirements) => updateSection({ requirements })}
            createNew={() => "Butir persyaratan baru..."}
            renderItem={(item, index, onChange) => (
              <input 
                value={item} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm font-medium"
              />
            )}
          />
       </SectionCard>
       <SectionCard title="Dokumen Wajib" icon={ClipboardList}>
          <ListEditor
            items={settings.requiredDocuments}
            onChange={(requiredDocuments) => updateSection({ requiredDocuments })}
            createNew={() => ({ name: 'Nama Dokumen', note: 'Opsional' })}
            renderItem={(item, index, onChange) => (
              <div className="grid grid-cols-2 gap-3">
                 <input value={item.name} onChange={(e) => onChange({ ...item, name: e.target.value })} placeholder="Contoh: Ijazah" className="px-3 py-2 rounded-xl border text-sm font-bold" />
                 <input value={item.note} onChange={(e) => onChange({ ...item, note: e.target.value })} placeholder="Keterangan (Contoh: 3 lembar)" className="px-3 py-2 rounded-xl border text-sm" />
              </div>
            )}
          />
       </SectionCard>
    </div>
  )

  const renderFaqTab = () => (
    <SectionCard title="Tanya Jawab (FAQ)" icon={HelpCircle}>
       <ListEditor
         items={settings.faq}
         onChange={(faq) => updateSection({ faq })}
         createNew={() => ({ question: 'Pertanyaan?', answer: 'Jawaban...' })}
         renderItem={(item, index, onChange) => (
           <div className="space-y-3">
              <input value={item.question} onChange={(e) => onChange({ ...item, question: e.target.value })} placeholder="Tulis pertanyaan..." className="w-full px-4 py-2 rounded-xl border font-bold" />
              <textarea value={item.answer} onChange={(e) => onChange({ ...item, answer: e.target.value })} placeholder="Tulis jawaban lengkap..." className="w-full px-4 py-2 rounded-xl border" rows={3} />
           </div>
         )}
       />
    </SectionCard>
  )

  const renderDataTab = () => {
    const filteredPendaftar = pendaftarList.filter(p => {
      const matchSearch = p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter
      return matchSearch && matchStatus
    })

    return (
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {[
             { label: 'Total', count: stats.total, color: 'text-gray-900', bg: 'bg-gray-50' },
             { label: 'Menunggu', count: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
             { label: 'Verified', count: stats.verified, color: 'text-blue-600', bg: 'bg-blue-50' },
             { label: 'Diterima', count: stats.accepted, color: 'text-green-600', bg: 'bg-green-50' },
             { label: 'Ditolak', count: stats.rejected, color: 'text-red-600', bg: 'bg-red-50' },
             { label: 'Revisi', count: stats.revision, color: 'text-purple-600', bg: 'bg-purple-50' },
           ].map((s, i) => (
             <div key={i} className={`${s.bg} p-4 rounded-3xl border border-white shadow-sm text-center`}>
                <div className={`text-xl font-black ${s.color}`}>{s.count}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</div>
             </div>
           ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                placeholder="Cari nama atau No. Pendaftaran..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-green-500 font-medium"
              />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              {['ALL', 'PENDING', 'VERIFIED', 'ACCEPTED', 'REJECTED', 'REVISION'].map(s => (
                <button 
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${statusFilter === s ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-green-200'}`}
                >
                  {s === 'ALL' ? 'Semua' : s}
                </button>
              ))}
           </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                       <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">No. Daftar / Tanggal</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Nama Lengkap</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Asal Sekolah</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {filteredPendaftar.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-6 py-5">
                            <div className="font-black text-gray-900 text-xs">#{p.registrationNumber}</div>
                            <div className="text-[10px] text-gray-400 font-bold mt-0.5">{formatDate(p.createdAt)}</div>
                         </td>
                         <td className="px-6 py-5">
                            <div className="font-bold text-gray-900 text-sm uppercase">{p.fullName}</div>
                            <div className="text-[10px] text-gray-400 flex items-center gap-1"><Smartphone className="w-2.5 h-2.5" /> {p.phone}</div>
                         </td>
                         <td className="px-6 py-5">
                            <div className="text-xs font-bold text-gray-600">{p.previousSchool}</div>
                         </td>
                         <td className="px-6 py-5">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusBadge(p.status)}`}>
                               {p.status}
                            </span>
                         </td>
                         <td className="px-6 py-5">
                            <button 
                              onClick={() => setSelectedPendaftar(p)}
                              className="p-2.5 rounded-xl bg-gray-50 hover:bg-green-600 hover:text-white text-gray-400 transition-all border border-transparent hover:border-green-100 shadow-sm"
                            >
                               <Eye className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                    ))}
                    {filteredPendaftar.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center space-y-3">
                           <Users className="w-12 h-12 text-gray-100 mx-auto" />
                           <p className="text-sm font-bold text-gray-300 uppercase tracking-widest italic">Tidak ada pendaftar ditemukan</p>
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    )
  }

  return (
    <EditorLayout
      title="Pengaturan PPDB"
      description="Manajemen pendaftaran siswa baru, rincian biaya, alur, dan verifikasi data pendaftar."
      preview={renderPreview()}
      onSave={activeTab !== 'data' ? handleSaveSettings : () => {}}
      isSaving={isSaving}
      isDirty={activeTab !== 'data' && isDirty}
    >
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-8 animate-in fade-in duration-500">
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'workflow' && renderWorkflowTab()}
        {activeTab === 'requirements' && renderRequirementsTab()}
        {activeTab === 'faq' && renderFaqTab()}
        {activeTab === 'data' && renderDataTab()}
      </div>

      {/* Detail Modal */}
      {selectedPendaftar && (
        <Modal 
          isOpen={!!selectedPendaftar} 
          onClose={() => setSelectedPendaftar(null)}
          title={`Detail Pendaftaran: #${selectedPendaftar.registrationNumber}`}
          size="lg"
        >
           <div className="space-y-8">
              {/* Header Info */}
              <div className="flex items-center gap-6 p-6 bg-green-50 rounded-[2rem] border border-green-100 shadow-inner">
                 <div className="w-20 h-20 rounded-3xl bg-green-600 text-white flex items-center justify-center text-3xl font-black">
                    {selectedPendaftar.fullName.charAt(0)}
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{selectedPendaftar.fullName}</h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-green-700">
                       <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedPendaftar.email}</span>
                       <span className="w-1 h-1 bg-green-200 rounded-full" />
                       <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> {selectedPendaftar.phone}</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Left Column */}
                 <div className="space-y-6">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <User className="w-3 h-3" /> Data Calon Siswa
                       </h4>
                       <div className="space-y-3 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                          <div className="flex justify-between border-b border-gray-200/50 pb-2">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Jenis Kelamin</span>
                             <span className="text-sm font-black text-gray-800">{selectedPendaftar.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-200/50 pb-2">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Asal Sekolah</span>
                             <span className="text-sm font-black text-gray-800">{selectedPendaftar.previousSchool}</span>
                          </div>
                          <div className="space-y-1">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Alamat Lengkap</span>
                             <p className="text-sm font-medium text-gray-700 leading-relaxed">{selectedPendaftar.address}</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Users className="w-3 h-3" /> Data Orang Tua
                       </h4>
                       <div className="space-y-3 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                          <div className="flex justify-between border-b border-gray-200/50 pb-2">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Nama Wali</span>
                             <span className="text-sm font-black text-gray-800">{selectedPendaftar.parentName}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">HP Orang Tua</span>
                             <span className="text-sm font-black text-gray-800">{selectedPendaftar.parentPhone}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Right Column */}
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Download className="w-3 h-3" /> Dokumen Lampiran
                       </h4>
                       <div className="grid grid-cols-1 gap-2">
                          {selectedPendaftar.documents?.map((doc, i) => (
                            <a 
                              key={i} 
                              href={doc.url} 
                              target="_blank" 
                              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
                            >
                               <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-gray-300 group-hover:text-green-600" />
                                  <span className="text-xs font-bold text-gray-700">{doc.name}</span>
                               </div>
                               <Download className="w-4 h-4 text-gray-300 group-hover:text-green-600" />
                            </a>
                          ))}
                          {(!selectedPendaftar.documents || selectedPendaftar.documents.length === 0) && (
                            <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center text-[10px] font-bold text-gray-400 uppercase">
                               Belum ada dokumen yang diunggah
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="p-8 bg-white rounded-[2.5rem] border border-gray-200 shadow-xl shadow-gray-100/50 space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400">Ubah Status Pendaftaran</label>
                          <select 
                            value={selectedPendaftar.status}
                            onChange={(e) => setSelectedPendaftar({ ...selectedPendaftar, status: e.target.value as any })}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-black text-sm uppercase tracking-wider"
                          >
                             <option value="PENDING">MENUNGGU (PENDING)</option>
                             <option value="VERIFIED">TERVERIFIKASI (VERIFIED)</option>
                             <option value="ACCEPTED">DITERIMA (ACCEPTED)</option>
                             <option value="REJECTED">DITOLAK (REJECTED)</option>
                             <option value="REVISION">PERLU REVISI (REVISION)</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400">Catatan Admin</label>
                          <textarea 
                            value={selectedPendaftar.adminNotes}
                            onChange={(e) => setSelectedPendaftar({ ...selectedPendaftar, adminNotes: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-medium"
                            rows={4}
                            placeholder="Tulis alasan jika ditolak atau revisi..."
                          />
                       </div>
                       <div className="flex gap-3">
                          <button 
                            onClick={handleUpdateStatus}
                            disabled={isSaving}
                            className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 shadow-xl shadow-green-600/20 transition-all"
                          >
                             {isSaving ? 'Menyimpan...' : 'Simpan Status'}
                          </button>
                          <button className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all">
                             <Printer className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </Modal>
      )}
    </EditorLayout>
  )
}
