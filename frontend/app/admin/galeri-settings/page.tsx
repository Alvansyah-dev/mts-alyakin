'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  ImageIcon,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Grid,
  Layout,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Filter,
  FileImage,
  RefreshCw,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FolderOpen
} from 'lucide-react'
import EditorLayout from '@/components/admin/EditorLayout'
import SectionCard from '@/components/admin/SectionCard'
import TabNav from '@/components/admin/TabNav'
import ListEditor from '@/components/admin/ListEditor'
import ImageUploadField from '@/components/admin/ImageUploadField'
import Modal from '@/components/ui/Modal'
import { get, post, put, del } from '@/lib/api'
import { toast } from 'sonner'

// --- Interfaces ---

interface GalleryItem {
  id: string
  title: string
  description?: string
  imageUrl: string
  cloudinaryId?: string
  category: string
  isPublic: boolean
  createdAt: string
}

interface GalleryCategory {
  id: string
  name: string
  count: number
}

interface UploadQueueItem {
  file: File
  preview: string
  title: string
  description: string
  category: string
  isPublic: boolean
  status: 'IDLE' | 'UPLOADING' | 'SUCCESS' | 'ERROR'
  progress: number
  error?: string
}

export default function GallerySettingsPage() {
  // States
  const [items, setItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<GalleryCategory[]>([
    { id: '1', name: 'Kegiatan Sekolah', count: 0 },
    { id: '2', name: 'Fasilitas', count: 0 },
    { id: '3', name: 'Prestasi', count: 0 },
    { id: '4', name: 'Ekskul', count: 0 },
    { id: '5', name: 'Belajar Mengajar', count: 0 },
    { id: '6', name: 'Umum', count: 0 },
  ])

  const [activeTab, setActiveTab] = useState('manage')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Upload Queue
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [visibilityFilter, setVisibilityFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Edit Modal
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await get('/gallery')
      const galleryItems = res?.data || res
      if (Array.isArray(galleryItems)) {
        setItems(galleryItems)

        // Dynamically calculate category counts
        setCategories(prev => prev.map(cat => ({
          ...cat,
          count: galleryItems.filter(item => item.category === cat.name).length
        })))
      }
    } catch (err) {
      console.error('Failed to fetch gallery:', err)
      toast.error('Gagal memuat galeri')
    } finally {
      setIsLoading(false)
    }
  }


  // --- Upload Logic ---

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => {
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFiles = (files: FileList) => {
     const newItems: UploadQueueItem[] = Array.from(files).map(file => ({
       file,
       preview: URL.createObjectURL(file),
       title: file.name.split('.')[0],
       description: '',
       category: 'Umum',
       isPublic: true,
       status: 'IDLE',
       progress: 0
     }))
     setUploadQueue(prev => [...prev, ...newItems])
   }

  const removeQueueItem = (index: number) => {
    setUploadQueue(prev => {
      const next = [...prev]
      URL.revokeObjectURL(next[index].preview)
      next.splice(index, 1)
      return next
    })
  }

  const updateQueueItem = (index: number, data: Partial<UploadQueueItem>) => {
    setUploadQueue(prev => {
      const next = [...prev]
      next[index] = { ...next[index], ...data }
      return next
    })
  }

  const uploadAll = async () => {
    const idleItems = uploadQueue.filter(item => item.status === 'IDLE')
    if (idleItems.length === 0) return

    for (let i = 0; i < uploadQueue.length; i++) {
      if (uploadQueue[i].status !== 'IDLE') continue
      if (!uploadQueue[i].title) {
        toast.error(`Judul foto ke-${i + 1} wajib diisi!`)
        continue
      }

      updateQueueItem(i, { status: 'UPLOADING', progress: 10 })

      try {
        const formData = new FormData()
        formData.append('file', uploadQueue[i].file)
        formData.append('folder', 'gallery')

        const token = localStorage.getItem('admin_token')
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

        const response = await fetch(
          `${apiUrl}/api/upload/image`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          }
        )

        const uploadRes = await response.json()
        if (!uploadRes.success) throw new Error(uploadRes.message || 'Upload ke Cloudinary gagal')

        const imageUrl = uploadRes.data.url
        const cloudinaryId = uploadRes.data.publicId

        const galleryResponse = await fetch(
          `${apiUrl}/api/gallery`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: uploadQueue[i].title,
              description: uploadQueue[i].description || '',
              category: uploadQueue[i].category || 'Umum',
              isPublic: uploadQueue[i].isPublic !== false,
              imageUrl,
              cloudinaryId
            })
          }
        )

        const galleryData = await galleryResponse.json()
        if (!galleryData.success) throw new Error(galleryData.message || 'Simpan ke database gagal')

        updateQueueItem(i, { status: 'SUCCESS', progress: 100 })
      } catch (err: any) {
        console.error('Upload error in item:', err)
        updateQueueItem(i, { status: 'ERROR', progress: 0, error: err.message || 'Gagal upload' })
      }
    }

    toast.success('Proses upload selesai')
    fetchData()
  }

  // --- Manage Logic ---

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus foto ini secara permanen?')) return
    try {
      const token = localStorage.getItem('admin_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Foto dihapus')
        fetchData()
      } else {
        toast.error('Gagal: ' + data.message)
      }
    } catch (err) {
      toast.error('Gagal menghapus')
    }
  }

  const handleUpdate = async () => {
    if (!editingItem) return
    setIsSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/gallery/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingItem)
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Data foto diperbarui')
        setEditingItem(null)
        fetchData()
      } else {
        toast.error('Gagal: ' + data.message)
      }
    } catch (err) {
      toast.error('Gagal memperbarui')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredItems = items.filter(item => {
    const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter
    const matchVis = visibilityFilter === 'ALL' || (visibilityFilter === 'PUBLIC' ? item.isPublic : !item.isPublic)
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchVis && matchSearch
  })

  const tabs = [
    { id: 'manage', label: 'Kelola Foto', icon: Grid },
    { id: 'upload', label: 'Upload Baru', icon: Upload },
    { id: 'categories', label: 'Kategori', icon: FolderOpen },
  ]

  // --- Render Previews ---

  const renderPreview = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div className="p-8 bg-white h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center text-green-600 animate-bounce">
              <Upload className="w-10 h-10" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-green-600">Upload Simulator</h3>
            <p className="text-[9px] text-gray-400 font-bold uppercase max-w-[200px] leading-relaxed">
              Foto yang Anda seret ke area form akan tampil di sini sebagai antrean.
            </p>
            {uploadQueue.length > 0 && (
              <div className="grid grid-cols-2 gap-2 w-full mt-4">
                {uploadQueue.slice(0, 4).map((q, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-100 relative">
                    <img src={q.preview} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-green-600/20 backdrop-blur-[1px]" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      default:
        return (
          <div className="p-6 bg-gray-50 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">MTs Al-Yakin Gallery</h3>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {filteredItems.length > 0 ? filteredItems.slice(0, 12).map((item, i) => (
                <div key={i} className="aspect-square rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden relative group">
                  <img src={item.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[6px] text-white font-bold truncate uppercase">{item.title}</p>
                  </div>
                </div>
              )) : (
                [1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square rounded-xl bg-gray-100 border border-gray-200" />
                ))
              )}
            </div>
            <div className="mt-8 text-center">
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest italic leading-relaxed">
                Preview grid 3 kolom <br /> Responsive Desktop
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <EditorLayout
      title="Manajemen Galeri"
      description="Upload dan kelola dokumentasi foto kegiatan sekolah."
      preview={renderPreview()}
      onSave={() => { }} // CRUD actions are direct
      isSaving={isSaving}
    >
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-8 animate-in fade-in duration-500">
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <SectionCard title="Area Drag & Drop" icon={Upload}>
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
                className={`
                   relative border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all cursor-pointer group
                   ${isDragging ? 'bg-green-50 border-green-500 scale-[0.99]' : 'bg-gray-50 border-gray-200 hover:border-green-400 hover:bg-green-50/30'}
                 `}
              >
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${isDragging ? 'bg-green-600 text-white' : 'bg-white text-gray-400 shadow-xl group-hover:text-green-600 group-hover:scale-110'}`}>
                    <FileImage className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-gray-900 tracking-tight">Klik atau Seret Foto ke Sini</h4>
                    <p className="text-sm text-gray-500 font-medium">Mendukung format JPG, PNG, dan WebP. Maks 5MB per file.</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            {uploadQueue.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                    Antrean Upload
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">{uploadQueue.length} Foto</span>
                  </h3>
                  <button
                    onClick={uploadAll}
                    className="bg-green-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-green-700 shadow-xl shadow-green-600/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${uploadQueue.some(i => i.status === 'UPLOADING') ? 'animate-spin' : ''}`} />
                    Upload Semua Foto
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploadQueue.map((item, idx) => (
                    <div key={idx} className={`p-4 bg-white rounded-3xl border transition-all shadow-sm flex gap-4 ${item.status === 'SUCCESS' ? 'border-green-200 bg-green-50/10' : item.status === 'ERROR' ? 'border-red-200' : 'border-gray-100'}`}>
                      <div className="w-32 aspect-square rounded-2xl bg-gray-100 overflow-hidden shrink-0 relative">
                        <img src={item.preview} className="w-full h-full object-cover" />
                        {item.status === 'UPLOADING' && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-white font-black text-lg">{item.progress}%</div>
                          </div>
                        )}
                        {item.status === 'SUCCESS' && (
                          <div className="absolute inset-0 bg-green-600/40 backdrop-blur-[2px] flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3 pt-1">
                        <div className="flex justify-between items-start">
                          <input
                            placeholder="Judul Foto (Required)"
                            value={item.title}
                            onChange={(e) => updateQueueItem(idx, { title: e.target.value })}
                            className="text-sm font-black text-gray-900 bg-transparent border-none p-0 focus:ring-0 w-full placeholder:text-red-300"
                          />
                          <button onClick={() => removeQueueItem(idx)} className="text-gray-300 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                         <input
                          placeholder="Keterangan singkat..."
                          value={item.description}
                          onChange={(e) => updateQueueItem(idx, { description: e.target.value })}
                          className="text-[10px] font-medium text-gray-500 bg-transparent border-none p-0 focus:ring-0 w-full"
                        />
                        <div className="flex gap-2">
                          <select
                            value={item.category}
                            onChange={(e) => updateQueueItem(idx, { category: e.target.value })}
                            className="text-[10px] font-black uppercase tracking-wider bg-gray-50 px-2 py-1.5 rounded-lg border-none focus:ring-0"
                          >
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                          </select>
                          <button
                            onClick={() => updateQueueItem(idx, { isPublic: !item.isPublic })}
                            className={`px-2 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${item.isPublic ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                          >
                            {item.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {item.isPublic ? 'Publik' : 'Privat'}
                          </button>
                        </div>
                        {item.status === 'ERROR' && <p className="text-[8px] text-red-500 font-bold uppercase">{item.error}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari foto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-bold"
                >
                  <option value="ALL">Semua Kategori</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <select
                  value={visibilityFilter}
                  onChange={(e) => setVisibilityFilter(e.target.value)}
                  className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-bold"
                >
                  <option value="ALL">Status</option>
                  <option value="PUBLIC">Publik</option>
                  <option value="PRIVATE">Privat</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm animate-pulse space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-[2rem]" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-50 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {filteredItems.map((item) => (
                  <div key={item.id} className="group bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                    <div className="aspect-square rounded-[2rem] overflow-hidden mb-4 relative">
                      <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                      <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 rounded-xl bg-white/90 backdrop-blur-md text-green-600 shadow-lg hover:bg-green-600 hover:text-white transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-xl bg-white/90 backdrop-blur-md text-red-600 shadow-lg hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider text-gray-600 shadow-sm">
                          {item.category}
                        </span>
                        <span className={`bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 ${item.isPublic ? 'text-green-600' : 'text-gray-400'}`}>
                          {item.isPublic ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                          {item.isPublic ? 'Publik' : 'Privat'}
                        </span>
                      </div>
                    </div>
                    <div className="px-2">
                      <h4 className="font-black text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors uppercase tracking-tight">{item.title}</h4>
                      <p className="text-xs text-gray-400 font-medium line-clamp-1 mt-1">{item.description || 'Tidak ada keterangan'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white py-20 rounded-[3rem] border border-gray-100 text-center space-y-4">
                <ImageIcon className="w-16 h-16 text-gray-100 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-gray-300 uppercase tracking-[0.2em]">Galeri Kosong</h3>
                  <p className="text-sm text-gray-400 font-medium italic">Silakan upload dokumentasi baru Anda.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <SectionCard title="Daftar Kategori Galeri" icon={FolderOpen} description="Kelola pengelompokan dokumentasi foto Anda.">
            <ListEditor<GalleryCategory>
              items={categories}
              onChange={(next) => setCategories(next)}
              createNew={() => ({ id: Math.random().toString(), name: 'Kategori Baru', count: 0 })}
              renderItem={(item, index, update) => (
                <div className="flex items-center gap-6">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Nama Kategori</label>
                    <input
                      value={item.name}
                      onChange={(e) => update({ ...item, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-bold"
                    />
                  </div>
                  <div className="text-right pt-6">
                    <span className="bg-gray-100 text-gray-500 px-4 py-2.5 rounded-xl text-xs font-black">
                      {item.count} Foto
                    </span>
                  </div>
                </div>
              )}
            />
          </SectionCard>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <Modal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title="Edit Informasi Foto"
        >
          <div className="space-y-6">
            <div className="aspect-video rounded-2xl overflow-hidden border border-gray-100">
              <img src={editingItem.imageUrl} className="w-full h-full object-cover" alt="Editing" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400">Judul Foto</label>
                <input
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400">Keterangan/Sub-judul</label>
                <textarea
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400">Kategori</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white font-bold"
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400">Visibilitas</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem({ ...editingItem, isPublic: true })}
                      className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider border transition-all ${editingItem.isPublic ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                    >
                      Publik
                    </button>
                    <button
                      onClick={() => setEditingItem({ ...editingItem, isPublic: false })}
                      className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider border transition-all ${!editingItem.isPublic ? 'bg-gray-800 border-gray-800 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                    >
                      Privat
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-4 rounded-2xl bg-gray-50 text-gray-400 font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="flex-1 py-4 rounded-2xl bg-green-600 text-white font-black uppercase tracking-widest text-xs hover:bg-green-700 shadow-xl shadow-green-600/20 active:scale-95 transition-all"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </EditorLayout>
  )
}
