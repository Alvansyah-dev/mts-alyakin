'use client'

import React, { useState, useEffect } from 'react'
import { 
  Megaphone, 
  Layout, 
  Star, 
  List, 
  Search,
  Type,
  ImageIcon,
  Eye,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowRight,
  Calendar,
  User,
  History,
  FileText,
  Clock,
  MoreVertical
} from 'lucide-react'
import { Star } from 'lucide-react';
import EditorLayout from '@/components/admin/EditorLayout'
import SectionCard from '@/components/admin/SectionCard'
import TabNav from '@/components/admin/TabNav'
import ListEditor from '@/components/admin/ListEditor'
import ImageUploadField from '@/components/admin/ImageUploadField'
import { get, put, post, del } from '@/lib/api'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

// --- Interfaces ---

interface NewsArticle {
  id: string
  title: string
  slug: string
  category: string
  author: string
  excerpt: string
  content: string
  thumbnail: string
  cloudinaryId?: string
  photoTitle?: string
  photoSubtitle?: string
  status: 'DRAFT' | 'PUBLISHED'
  publishedAt: string
  isFeatured?: boolean
}

interface CategoryItem {
  id: string
  name: string
  isActive: boolean
}

interface BeritaSettings {
  header: {
    title: string
    subtitle: string
    bannerPhoto: string
    photoTitle?: string
    photoSubtitle?: string
  }
}

// --- Defaults ---

const DEFAULT_SETTINGS: BeritaSettings = {
  header: {
    title: 'Berita & Artikel',
    subtitle: 'Dapatkan informasi terbaru seputar kegiatan dan prestasi MTs Al-Yakin.',
    bannerPhoto: '',
    photoTitle: '',
    photoSubtitle: ''
  }
}

export default function BeritaSettingsPage() {
  // States
  const [settings, setSettings] = useState<BeritaSettings>(DEFAULT_SETTINGS)
  const [news, setNews] = useState<NewsArticle[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: '1', name: 'Akademik', isActive: true },
    { id: '2', name: 'Kegiatan', isActive: true },
    { id: '3', name: 'Pengumuman', isActive: true },
    { id: '4', name: 'Prestasi', isActive: true },
    { id: '5', name: 'Umum', isActive: true },
  ])
  
  const [activeTab, setActiveTab] = useState('news')
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Editor State
  const [editingNews, setEditingNews] = useState<Partial<NewsArticle> | null>(null)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('admin_token')
      
      const [settingsRes, newsRes] = await Promise.all([
        fetch(`${apiUrl}/api/settings/news_settings`),
        fetch(`${apiUrl}/api/news?limit=50`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])
      
      const settingsData = await settingsRes.json()
      const newsData = await newsRes.json()
      
      if (settingsData && settingsData.success && settingsData.data) {
        setSettings(settingsData.data || DEFAULT_SETTINGS)
        if (settingsData.data.categories) {
          setCategories(settingsData.data.categories)
        }
      }
      if (newsData && newsData.success) {
        setNews(newsData.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch initial data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBerita = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      const res = await fetch(
        `${apiUrl}/api/news?limit=50`,
        {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        }
      )
      const data = await res.json()
      if (data.success) {
        setNews(data.data || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveSettings = async (customSettings?: any) => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('Sesi habis. Silakan login ulang.')
        window.location.href = '/admin/login'
        return
      }
      
      const payload = customSettings || settings
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/settings/news_settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      if (data.success) {
        setIsDirty(false)
        setLastSaved(new Date())
        toast.success('Pengaturan berita berhasil disimpan!')
      } else {
        toast.error('Gagal menyimpan: ' + data.message)
      }
    } catch (err: any) {
      toast.error('Error koneksi: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const saveBerita = async (formData: any, isDraft: boolean) => {
    if (!formData?.title || !formData?.content) {
      toast.error('Judul dan Konten wajib diisi!')
      return
    }

    const token = localStorage.getItem('admin_token')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL 
      || 'http://localhost:5000'
    
    console.log('Saving berita...')
    console.log('Token exists:', !!token)
    console.log('API URL:', apiUrl)
    console.log('Form data:', formData)
    
    if (!token) {
      alert('Token tidak ada! Silakan login ulang.')
      window.location.href = '/admin/login'
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug || '',
        content: formData.content || '',
        excerpt: formData.excerpt || '',
        thumbnail: formData.thumbnail || '',
        cloudinaryId: formData.cloudinaryId || '',
        category: formData.category || 'UMUM',
        status: isDraft ? 'DRAFT' : 'PUBLISHED',
      }
      
      const isEdit = !!formData.id
      const url = isEdit 
        ? `${apiUrl}/api/news/${formData.id}`
        : `${apiUrl}/api/news`
      const method = isEdit ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      console.log('Save response:', data)
      
      if (data.success) {
        alert(isDraft ? 'Draft disimpan!' : 'Berita dipublikasikan!')
        setEditingNews(null)
        fetchBerita() // refresh list
      } else {
        alert('Gagal: ' + (data.message || 'Unknown error'))
      }
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Hapus berita ini?')) return
    try {
      const token = localStorage.getItem('admin_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      const res = await fetch(`${apiUrl}/api/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Berita berhasil dihapus!')
        fetchBerita()
      } else {
        toast.error('Gagal: ' + data.message)
      }
    } catch (err: any) {
      toast.error('Error: ' + err.message)
    }
  }

  const toggleNewsStatus = async (item: NewsArticle) => {
    try {
      const token = localStorage.getItem('admin_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const newStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
      
      const res = await fetch(`${apiUrl}/api/news/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: newStatus,
          publishedAt: newStatus === 'PUBLISHED' 
            ? new Date().toISOString() : null
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Status diubah menjadi ${newStatus}`)
        fetchBerita()
      } else {
        toast.error('Gagal: ' + data.message)
      }
    } catch (err: any) {
      toast.error('Error: ' + err.message)
    }
  }

  const toggleFeatured = async (item: NewsArticle) => {
    try {
      const token = localStorage.getItem('admin_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/news/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFeatured: !item.isFeatured })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Featured ${item.isFeatured ? 'dihapus' : 'ditetapkan'}!`)
        fetchBerita()
      } else {
        toast.error('Gagal: ' + data.message)
      }
    } catch (err: any) {
      toast.error('Error: ' + err.message)
    }
  }

  const updateSettings = (data: any) => {
    setSettings(prev => ({ ...prev, header: { ...prev.header, ...data } }))
    setIsDirty(true)
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const tabs = [
    { id: 'news', label: 'Kelola Berita', icon: Megaphone },
    { id: 'header', label: 'Header', icon: Type },
    { id: 'categories', label: 'Kategori', icon: List },
  ]

  // --- Render Preview ---

  const renderPreview = () => {
    if (editingNews) {
      return (
        <div className="p-6 bg-white h-full overflow-y-auto space-y-6">
          <div className="text-center space-y-1 mb-8">
            <h3 className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live Editor Preview</h3>
            <div className="h-[1px] w-12 bg-green-200 mx-auto" />
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group">
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
               {editingNews.thumbnail ? (
                 <img src={editingNews.thumbnail} className="w-full h-full object-cover" alt="Preview" />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">No Thumbnail</span>
                 </div>
               )}
               <div className="absolute top-4 left-4">
                 <span className="bg-green-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                   {editingNews.category || 'Kategori'}
                 </span>
               </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                <Calendar className="w-3 h-3 text-green-500" />
                {formatDate(editingNews.publishedAt || new Date().toISOString())}
                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                <User className="w-3 h-3 text-green-500" />
                {editingNews.author || 'Admin'}
              </div>
              <h4 className="text-sm font-black text-gray-900 leading-tight line-clamp-2">
                {editingNews.title || 'Judul Berita Akan Muncul di Sini'}
              </h4>
              <p className="text-[9px] text-gray-500 leading-relaxed line-clamp-3">
                {editingNews.excerpt || 'Ringkasan berita akan tampil di sini untuk memberikan gambaran singkat kepada pembaca...'}
              </p>
              <div className="pt-2 flex items-center gap-2 text-green-600 font-black text-[9px] uppercase tracking-wider group-hover:gap-4 transition-all">
                Baca Selengkapnya
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
            <p className="text-[8px] text-gray-400 font-medium uppercase leading-relaxed">
              Tampilan di atas adalah representasi card berita <br /> pada halaman daftar berita.
            </p>
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case 'header':
        return (
          <div className="bg-white h-full overflow-y-auto">
            <div className={`relative h-40 flex items-center justify-center text-center p-8 overflow-hidden ${!settings.header.bannerPhoto ? 'bg-green-600' : 'bg-gray-900'}`}>
              {settings.header.bannerPhoto && (
                <div className="absolute inset-0 opacity-40">
                  <img src={settings.header.bannerPhoto} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative z-10 space-y-2">
                <h2 className="text-white font-black text-xl leading-tight tracking-tight uppercase">{settings.header.title}</h2>
                <p className="text-green-50 text-[9px] opacity-80 max-w-[280px] mx-auto leading-relaxed">{settings.header.subtitle}</p>
                {settings.header.bannerPhoto && (
                  <div className="mt-2 text-[7px] text-white/50 font-bold uppercase tracking-widest bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                    Photo: {settings.header.photoTitle}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex gap-2 justify-center border-b border-gray-100 pb-4">
                  {categories.filter(c => c.isActive).map((c, i) => (
                    <div key={i} className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border ${i === 0 ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-white border-gray-200 text-gray-400'}`}>
                      {c.name}
                    </div>
                  ))}
               </div>
               <div className="grid grid-cols-1 gap-4 opacity-40 grayscale">
                  {[1, 2].map(i => (
                    <div key={i} className="flex gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                       <div className="w-20 h-20 bg-gray-200 rounded-xl" />
                       <div className="flex-1 space-y-2 pt-1">
                          <div className="h-2 w-full bg-gray-200 rounded" />
                          <div className="h-2 w-2/3 bg-gray-200 rounded" />
                          <div className="h-1.5 w-1/2 bg-gray-100 rounded mt-4" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )
      case 'categories':
        return (
          <div className="p-8 bg-white h-full flex flex-col items-center justify-center space-y-6">
            <div className="grid grid-cols-1 gap-3 w-full max-w-[240px]">
              {categories.map((c, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${c.isActive ? 'bg-green-50 border-green-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${c.isActive ? 'text-green-700' : 'text-gray-400'}`}>
                    {c.name}
                  </span>
                  {c.isActive ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-gray-300" />}
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center leading-relaxed">
              Kategori yang aktif akan <br /> muncul pada filter halaman berita.
            </p>
          </div>
        )
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white space-y-3">
            <Megaphone className="w-12 h-12 text-gray-100" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">News Dashboard Preview</h3>
          </div>
        )
    }
  }

  // --- Render Forms ---

  const renderNewsTable = () => {
    const filteredNews = news.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter
      const matchCategory = categoryFilter === 'ALL' || item.category === categoryFilter
      return matchSearch && matchStatus && matchCategory
    })

    const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari judul berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 font-medium"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm font-bold"
            >
              <option value="ALL">Semua Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm font-bold"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <button 
              onClick={() => setEditingNews({ 
                title: '', category: 'Umum', author: 'Admin', excerpt: '', content: '', status: 'DRAFT', publishedAt: new Date().toISOString() 
              })}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-green-700 shadow-lg shadow-green-600/20 active:scale-95 transition-all whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Tulis Berita
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Berita</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Kategori</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Featured</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Info</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-10 bg-gray-100 rounded-xl" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-50 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-50 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-50 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-8 w-20 bg-gray-50 rounded" /></td>
                    </tr>
                  ))
                ) : paginatedNews.length > 0 ? (
                  paginatedNews.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shrink-0 shadow-sm">
                             {item.thumbnail ? <img src={item.thumbnail} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 m-5 text-gray-300" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black text-gray-900 dark:text-white text-sm line-clamp-1">{item.title}</h4>
                            <p className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-tighter italic">/{item.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <button 
                          onClick={() => toggleNewsStatus(item)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border ${
                            item.status === 'PUBLISHED' 
                              ? 'bg-green-50 text-green-700 border-green-100' 
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'PUBLISHED' ? 'bg-green-600' : 'bg-amber-600'}`} />
                          {item.status}
                        </button>
                      </td>
                      <td className="px-6 py-6">
                        <button
                          onClick={() => toggleFeatured(item)}
                          className="p-2 rounded-full hover:bg-yellow-100"
                          title={item.isFeatured ? 'Unset Featured' : 'Set as Featured'}
                        >
                          {item.isFeatured ? <Star className="w-4 h-4 text-yellow-500" /> : <Star className="w-4 h-4 text-gray-300" />}
                        </button>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.publishedAt)}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                            <Eye className="w-3 h-3" />
                            {item.views || 0} Views
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setEditingNews(item)}
                            className="p-2.5 rounded-xl bg-gray-50 hover:bg-green-50 text-gray-400 hover:text-green-600 transition-all border border-transparent hover:border-green-100"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteNews(item.id)}
                            className="p-2.5 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center space-y-3">
                       <FileText className="w-12 h-12 text-gray-100 mx-auto" />
                       <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">Tidak ada berita ditemukan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredNews.length > itemsPerPage && (
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                Showing {Math.min(filteredNews.length, itemsPerPage)} of {filteredNews.length} News
              </span>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  disabled={currentPage * itemsPerPage >= filteredNews.length}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderNewsEditor = () => {
    if (!editingNews) return null
    
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setEditingNews(null)}
            className="p-3 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:text-gray-900 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {editingNews.id ? 'Edit Berita' : 'Tulis Berita Baru'}
            </h2>
            <p className="text-sm text-gray-500 font-medium">Buat konten artikel yang menarik untuk website.</p>
          </div>
          <div className="ml-auto flex gap-3">
             <button 
               onClick={() => saveBerita(editingNews, true)}
               disabled={isSaving}
               className="bg-amber-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-amber-700 shadow-xl shadow-amber-600/20 active:scale-95 transition-all"
             >
               Simpan Draft
             </button>
             <button 
               onClick={() => saveBerita(editingNews, false)}
               disabled={isSaving}
               className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-green-700 shadow-xl shadow-green-600/20 active:scale-95 transition-all"
             >
               Publikasikan
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 pb-20">
            <SectionCard title="Konten Utama" icon={Type}>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Judul Berita</label>
                    <input 
                      type="text" 
                      value={editingNews.title} 
                      onChange={(e) => {
                        const title = e.target.value
                        setEditingNews({ ...editingNews, title, slug: generateSlug(title) })
                      }}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 font-bold text-xl focus:ring-2 focus:ring-green-500 transition-all"
                      placeholder="Masukkan judul yang menarik..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400">Slug URL</label>
                      <input 
                        type="text" 
                        value={editingNews.slug} 
                        onChange={(e) => setEditingNews({ ...editingNews, slug: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-400 italic bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400">Kategori</label>
                      <select 
                        value={editingNews.category} 
                        onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold bg-white"
                      >
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Konten Artikel</label>
                    <textarea 
                      rows={15}
                      value={editingNews.content} 
                      onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white font-medium text-lg leading-relaxed focus:ring-2 focus:ring-green-500 transition-all"
                      placeholder="Tulis isi berita selengkapnya di sini..."
                    />
                  </div>
               </div>
            </SectionCard>

            <SectionCard title="Ringkasan (Excerpt)" icon={FileText} description="Tampil pada daftar berita untuk memancing pembaca.">
               <div className="space-y-2">
                  <textarea 
                    rows={4}
                    maxLength={200}
                    value={editingNews.excerpt} 
                    onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm font-medium"
                    placeholder="Tulis ringkasan singkat (maks 200 karakter)..."
                  />
                  <div className="text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {editingNews.excerpt?.length || 0} / 200
                  </div>
               </div>
            </SectionCard>
          </div>

          <div className="space-y-8">
            <SectionCard title="Media Berita" icon={ImageIcon}>
               <ImageUploadField 
                 label="Thumbnail Utama" 
                 value={editingNews.thumbnail ?? null}
                 onChange={(url) => setEditingNews({ ...editingNews, thumbnail: url })}
                 description="Wajib untuk dipublikasikan. Ukuran ideal 1200x800px."
               />
               {editingNews.thumbnail && (
                 <div className="space-y-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400">Judul Foto (Caption)</label>
                       <input 
                         value={editingNews.photoTitle || ''} 
                         onChange={(e) => setEditingNews({ ...editingNews, photoTitle: e.target.value })}
                         className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold" 
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400">Alt Text (Subtitle)</label>
                       <input 
                         value={editingNews.photoSubtitle || ''} 
                         onChange={(e) => setEditingNews({ ...editingNews, photoSubtitle: e.target.value })}
                         className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs" 
                       />
                    </div>
                 </div>
               )}
            </SectionCard>

            <SectionCard title="Pengaturan Publikasi" icon={Clock}>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400">Penulis</label>
                    <div className="relative">
                       <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input 
                         value={editingNews.author} 
                         onChange={(e) => setEditingNews({ ...editingNews, author: e.target.value })}
                         className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold" 
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400">Tanggal Publish</label>
                    <div className="relative">
                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input 
                         type="date"
                         value={editingNews.publishedAt?.split('T')[0]} 
                         onChange={(e) => setEditingNews({ ...editingNews, publishedAt: e.target.value + 'T00:00:00.000Z' })}
                         className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold" 
                       />
                    </div>
                  </div>
                  <div className="space-y-3 pt-4">
                     <label className="text-xs font-black uppercase text-gray-400">Status Berita</label>
                     <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingNews({ ...editingNews, status: 'DRAFT' })}
                          className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${editingNews.status === 'DRAFT' ? 'bg-amber-600 border-amber-600 text-white shadow-lg' : 'bg-white text-gray-400 border-gray-200'}`}
                        >
                          Draft
                        </button>
                        <button 
                          onClick={() => setEditingNews({ ...editingNews, status: 'PUBLISHED' })}
                          className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${editingNews.status === 'PUBLISHED' ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'bg-white text-gray-400 border-gray-200'}`}
                        >
                          Publish
                        </button>
                     </div>
                  </div>
               </div>
            </SectionCard>
          </div>
        </div>
      </div>
    )
  }

  return (
    <EditorLayout
      title="Pengaturan Berita"
      description="Kelola artikel, pengumuman, dan kategori berita sekolah Anda."
      preview={renderPreview()}
      onSave={() => {
        if (activeTab === 'header') {
          handleSaveSettings();
        } else if (activeTab === 'categories') {
          handleSaveSettings({ ...settings, categories });
        }
      }}
      isSaving={isSaving}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      {!editingNews && (
        <TabNav 
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      )}
      
      <div className="space-y-8 animate-in fade-in duration-500">
        {editingNews ? renderNewsEditor() : (
          <>
            {activeTab === 'news' && renderNewsTable()}

            {activeTab === 'header' && (
              <div className="space-y-8">
                <SectionCard title="Banner Header" icon={Type} description="Atur teks dan gambar latar belakang untuk halaman utama berita.">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Judul Halaman</label>
                      <input 
                        type="text" 
                        value={settings.header.title} 
                        onChange={(e) => updateSettings({ title: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-gray-500 tracking-wider">Subjudul / Deskripsi</label>
                      <input 
                        type="text" 
                        value={settings.header.subtitle} 
                        onChange={(e) => updateSettings({ subtitle: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                      />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Media Banner" icon={ImageIcon}>
                  <ImageUploadField 
                    label="Foto Banner (Opsional)" 
                    value={settings.header.bannerPhoto ?? null}
                    onChange={(url) => updateSettings({ bannerPhoto: url })}
                  />
                  {settings.header.bannerPhoto && (
                    <div className="grid grid-cols-2 gap-6 mt-4 animate-in slide-in-from-top-2">
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-gray-400">Judul Foto</label>
                          <input value={settings.header.photoTitle} onChange={(e) => updateSettings({ photoTitle: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 font-bold" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-gray-400">Sub-judul Foto</label>
                          <input value={settings.header.photoSubtitle} onChange={(e) => updateSettings({ photoSubtitle: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
                       </div>
                    </div>
                  )}
                </SectionCard>
              </div>
            )}

            {activeTab === 'categories' && (
              <SectionCard title="Daftar Kategori" icon={List} description="Kategori berita yang aktif akan muncul di navigasi filter.">
                <ListEditor
                  items={categories}
                  onChange={(items) => {
                    setCategories(items);
                    setIsDirty(true);
                  }}
                  createNew={() => ({ id: Math.random().toString(), name: 'Kategori Baru', isActive: true })}
                  renderItem={(item, index, onChange) => (
                    <div className="flex items-center gap-6">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Nama Kategori</label>
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={(e) => onChange({ ...item, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-bold"
                        />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer pt-6">
                        <input 
                          type="checkbox" 
                          checked={item.isActive} 
                          onChange={(e) => onChange({ ...item, isActive: e.target.checked })}
                          className="w-5 h-5 rounded-lg text-green-600 focus:ring-green-500 border-gray-200"
                        />
                        <span className={`text-[10px] font-black uppercase ${item.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          {item.isActive ? 'Aktif' : 'Non-aktif'}
                        </span>
                      </label>
                    </div>
                  )}
                />
              </SectionCard>
            )}
          </>
        )}
      </div>
    </EditorLayout>
  )
}
