'use client'

import React, { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Settings, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  EyeOff, 
  Trash2, 
  Send, 
  User, 
  Mail, 
  Tag,
  AlertCircle,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  X,
  Plus
} from 'lucide-react'
import EditorLayout from '@/components/admin/EditorLayout'
import SectionCard from '@/components/admin/SectionCard'
import TabNav from '@/components/admin/TabNav'
import ListEditor from '@/components/admin/ListEditor'
import { get, put, post, del } from '@/lib/api'
import { toast } from 'sonner'
import { formatDate, timeAgo } from '@/lib/utils'

// --- Interfaces ---

interface ConsultationReply {
  id: string
  reply: string
  adminId: string
  createdAt: string
}

interface Consultation {
  id: string
  name: string
  email: string
  category: string
  question: string
  isPublic: boolean
  isHidden: boolean
  isModerated: boolean
  createdAt: string
  replies: ConsultationReply[]
}

interface ConsultSettings {
  isFormEnabled: boolean
  welcomeMessage: string
  categories: string[]
}

// --- Defaults ---

const DEFAULT_SETTINGS: ConsultSettings = {
  isFormEnabled: true,
  welcomeMessage: 'Silakan ajukan pertanyaan atau konsultasi seputar MTs Al-Yakin. Kami akan menjawab sesegera mungkin.',
  categories: ['Akademik', 'PPDB', 'Fasilitas', 'Ekstrakurikuler', 'Umum']
}

export default function KonsultasiSettingsPage() {
  const [settings, setSettings] = useState<ConsultSettings>(DEFAULT_SETTINGS)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [activeTab, setActiveTab] = useState('questions')
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [replyText, setReplyText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('admin_token')
      
      const [settingsRes, consultRes] = await Promise.all([
        fetch(`${apiUrl}/api/settings/consultation_settings`),
        fetch(`${apiUrl}/api/consultation`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])
      
      const settingsData = await settingsRes.json()
      const consultData = await consultRes.json()
      
      if (settingsData && settingsData.success) {
        setSettings(settingsData.data || DEFAULT_SETTINGS)
      }
      if (consultData && consultData.success) {
        setConsultations(consultData.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
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
        doc(db as any, 'siteSettings', 'consultation'),
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

  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) return
    setIsSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/consultation/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reply: replyText })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Balasan berhasil dikirim')
        setReplyText('')
        setReplyingTo(null)
        fetchData()
      } else {
        toast.error('Gagal: ' + data.message)
      }
    } catch (err) {
      toast.error('Gagal mengirim balasan')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleVisibility = async (item: Consultation) => {
    try {
      const token = localStorage.getItem('admin_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/consultation/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isHidden: !item.isHidden })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(item.isHidden ? 'Pertanyaan ditampilkan' : 'Pertanyaan disembunyikan')
        fetchData()
      } else {
        toast.error('Gagal: ' + data.message)
      }
    } catch (err) {
      toast.error('Gagal mengubah visibilitas')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pertanyaan ini secara permanen?')) return
    try {
      const token = localStorage.getItem('admin_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/consultation/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Pertanyaan dihapus')
        fetchData()
      } else {
        toast.error('Gagal: ' + data.message)
      }
    } catch (err) {
      toast.error('Gagal menghapus')
    }
  }

  const stats = {
    total: consultations.length,
    unanswered: consultations.filter(c => c.replies.length === 0).length,
    answered: consultations.filter(c => c.replies.length > 0).length,
    hidden: consultations.filter(c => c.isHidden).length,
  }

  const tabs = [
    { id: 'questions', label: 'Pertanyaan Masuk', icon: MessageSquare },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ]

  const filteredQuestions = consultations.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        c.question.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || 
                        (statusFilter === 'UNANSWERED' && c.replies.length === 0) ||
                        (statusFilter === 'ANSWERED' && c.replies.length > 0) ||
                        (statusFilter === 'HIDDEN' && c.isHidden)
    return matchSearch && matchStatus
  })

  // --- Render Previews ---

  const renderPreview = () => (
    <div className="bg-white h-full overflow-y-auto">
       <div className="bg-green-700 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="relative z-10 space-y-2">
             <h2 className="text-xl font-black uppercase tracking-tight">KONSULTASI ONLINE</h2>
             <p className="text-[10px] text-green-50 opacity-80 max-w-[280px] mx-auto leading-relaxed">
               {settings.welcomeMessage}
             </p>
          </div>
       </div>

       <div className="p-6 space-y-4">
          <div className="flex gap-2 justify-center mb-6 overflow-x-auto pb-2">
             {settings.categories.map((cat, i) => (
               <span key={i} className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border whitespace-nowrap ${i === 0 ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}>
                 {cat}
               </span>
             ))}
          </div>

          <div className="space-y-4">
             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-lg bg-green-200 flex items-center justify-center text-[10px] font-black text-green-700">A</div>
                   <div className="text-[9px] font-bold text-gray-900">Anonym</div>
                   <span className="text-[7px] text-gray-400 font-medium">Baru saja</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded" />
                <div className="h-2 w-2/3 bg-gray-200 rounded" />
             </div>
             <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-3 shadow-sm">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600">S</div>
                   <div className="text-[9px] font-bold text-gray-900">Siswa</div>
                   <span className="bg-green-50 text-green-600 text-[6px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest">Terjawab</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded" />
                <div className="pl-4 border-l-2 border-green-100 space-y-2 mt-4">
                   <div className="h-1.5 w-full bg-green-50 rounded" />
                </div>
             </div>
          </div>
          <div className="mt-8 text-center">
             <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic leading-relaxed">
               Preview Tampilan <br /> Halaman Konsultasi Publik
             </p>
          </div>
       </div>
    </div>
  )

  return (
    <EditorLayout
      title="Manajemen Konsultasi"
      description="Kelola pertanyaan dari publik, berikan balasan, dan atur kebijakan moderasi."
      preview={renderPreview()}
      onSave={activeTab === 'settings' ? handleSaveSettings : () => {}}
      isSaving={isSaving}
      isDirty={activeTab === 'settings' && isDirty}
    >
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-8 animate-in fade-in duration-500">
        {activeTab === 'questions' && (
          <div className="space-y-8 pb-20">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 { label: 'Total', count: stats.total, color: 'text-gray-900', bg: 'bg-gray-50' },
                 { label: 'Belum Dijawab', count: stats.unanswered, color: 'text-amber-600', bg: 'bg-amber-50' },
                 { label: 'Sudah Dijawab', count: stats.answered, color: 'text-green-600', bg: 'bg-green-50' },
                 { label: 'Disembunyikan', count: stats.hidden, color: 'text-gray-400', bg: 'bg-gray-100' },
               ].map((s, i) => (
                 <div key={i} className={`${s.bg} p-4 rounded-3xl border border-white shadow-sm text-center`}>
                    <div className={`text-xl font-black ${s.color}`}>{s.count}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</div>
                 </div>
               ))}
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
               <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    placeholder="Cari pertanyaan atau nama..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-green-500 font-medium"
                  />
               </div>
               <div className="flex gap-2">
                  {[
                    { label: 'Semua', value: 'ALL' },
                    { label: 'Belum Dijawab', value: 'UNANSWERED' },
                    { label: 'Sudah Dijawab', value: 'ANSWERED' },
                    { label: 'Disembunyikan', value: 'HIDDEN' },
                  ].map(f => (
                    <button 
                      key={f.value}
                      onClick={() => setStatusFilter(f.value)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${statusFilter === f.value ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-green-200'}`}
                    >
                      {f.label}
                    </button>
                  ))}
               </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
               {isLoading ? (
                 <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-50 rounded-3xl animate-pulse border border-gray-100" />)}
                 </div>
               ) : filteredQuestions.length > 0 ? filteredQuestions.map((c) => (
                 <div key={c.id} className={`group bg-white rounded-[2.5rem] border transition-all p-8 space-y-6 ${c.replies.length > 0 ? 'border-green-100 shadow-lg shadow-green-600/5' : 'border-gray-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center font-black text-xl border-2 border-white shadow-sm">
                             {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <h4 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                {c.name}
                                {c.isHidden && <span className="bg-gray-100 text-gray-400 text-[8px] px-2 py-0.5 rounded-full"><EyeOff className="w-2.5 h-2.5" /></span>}
                             </h4>
                             <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</span>
                                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(c.createdAt)}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-gray-100">
                             {c.category}
                          </span>
                          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${c.replies.length > 0 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                             {c.replies.length > 0 ? 'Sudah Dijawab' : 'Belum Dijawab'}
                          </div>
                       </div>
                    </div>

                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50">
                       <p className="text-gray-700 leading-relaxed font-medium">"{c.question}"</p>
                    </div>

                    {c.replies.length > 0 && (
                      <div className="pl-8 border-l-4 border-green-500/20 space-y-4">
                         {c.replies.map((r, i) => (
                           <div key={i} className="p-5 bg-green-50/30 rounded-3xl border border-green-100 relative">
                              <div className="flex items-center gap-2 mb-2">
                                 <span className="bg-green-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Balasan Admin</span>
                                 <span className="text-[9px] text-gray-400 font-bold">{formatDate(r.createdAt)}</span>
                              </div>
                              <p className="text-gray-600 text-sm italic">"{r.reply}"</p>
                           </div>
                         ))}
                      </div>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-gray-100 border-dashed">
                       <div className="flex gap-2">
                          <button 
                            onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 shadow-lg shadow-green-600/20 active:scale-95 transition-all"
                          >
                             <Send className="w-3.5 h-3.5" />
                             {c.replies.length > 0 ? 'Tambah Balasan' : 'Balas Sekarang'}
                          </button>
                          <button 
                            onClick={() => toggleVisibility(c)}
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all"
                          >
                             {c.isHidden ? <EyeOff className="w-4 h-4 text-red-500" /> : <MoreVertical className="w-4 h-4" />}
                          </button>
                       </div>
                       <button 
                        onClick={() => handleDelete(c.id)}
                        className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-all"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>

                    {replyingTo === c.id && (
                      <div className="pt-6 border-t border-gray-100 border-dashed animate-in slide-in-from-top-4 duration-300">
                         <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tulis Balasan</label>
                            <textarea 
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={4}
                              className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white font-medium text-gray-700 focus:ring-2 focus:ring-green-500 transition-all"
                              placeholder="Ketik balasan profesional untuk pertanyaan ini..."
                            />
                            <div className="flex justify-end gap-3">
                               <button onClick={() => setReplyingTo(null)} className="px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all">Batal</button>
                               <button 
                                 onClick={() => handleSendReply(c.id)}
                                 disabled={isSaving}
                                 className="bg-green-600 text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 shadow-xl shadow-green-600/20 active:scale-95 transition-all"
                               >
                                 {isSaving ? 'Mengirim...' : 'Kirim Balasan'}
                               </button>
                            </div>
                         </div>
                      </div>
                    )}
                 </div>
               )) : (
                 <div className="bg-white py-20 rounded-[3rem] border border-gray-100 text-center space-y-4">
                    <MessageSquare className="w-16 h-16 text-gray-100 mx-auto" />
                    <p className="text-sm font-bold text-gray-300 uppercase tracking-widest italic">Belum ada pertanyaan masuk</p>
                 </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <SectionCard title="Moderasi & Keamanan" icon={Settings}>
               <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="space-y-1">
                     <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm">Form Konsultasi Publik</h4>
                     <p className="text-xs text-gray-500 font-medium">Jika dinonaktifkan, tombol ajukan pertanyaan akan disembunyikan.</p>
                  </div>
                  <button 
                    onClick={() => updateSection({ isFormEnabled: !settings.isFormEnabled })}
                    className={`relative w-14 h-8 rounded-full transition-all ${settings.isFormEnabled ? 'bg-green-600' : 'bg-gray-300'}`}
                  >
                     <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all ${settings.isFormEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
               </div>
               <div className="mt-8 space-y-3">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Pesan Sambutan (Welcome Message)</label>
                  <textarea 
                    value={settings.welcomeMessage} 
                    onChange={(e) => updateSection({ welcomeMessage: e.target.value })}
                    className="w-full px-5 py-4 rounded-3xl border border-gray-200 font-medium text-gray-700 leading-relaxed" 
                    rows={4}
                  />
               </div>
            </SectionCard>

            <SectionCard title="Kategori Konsultasi" icon={Tag}>
               <ListEditor<string> items={settings.categories}
                 onChange={(categories) => updateSection({ categories })}
                 createNew={() => 'Kategori Baru'}
                 renderItem={(item, index, update) => (
                   <input 
                     value={item} 
                     onChange={(e) => update(e.target.value)}
                     className="w-full px-4 py-2.5 rounded-xl border font-bold"
                   />
                 )}
               />
            </SectionCard>
          </div>
        )}
      </div>
    </EditorLayout>
  )

  function updateSection(data: Partial<ConsultSettings>) {
    setSettings(prev => ({ ...prev, ...data }))
    setIsDirty(true)
  }
}
