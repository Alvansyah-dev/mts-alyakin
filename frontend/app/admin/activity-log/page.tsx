'use client'

import React, { useState, useEffect } from 'react'
import { 
  History, 
  Search, 
  Calendar, 
  Download, 
  Filter, 
  User, 
  Clock, 
  Activity,
  FileText,
  Trash2,
  Edit2,
  Plus,
  LogIn,
  LogOut,
  Upload as UploadIcon,
  Globe,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import SectionCard from '@/components/admin/SectionCard'
import { get } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

// --- Interfaces ---

interface ActivityLog {
  id: string
  adminName: string
  action: 'LOGIN' | 'LOGOUT' | 'ADD' | 'EDIT' | 'DELETE' | 'UPLOAD' | 'PUBLISH'
  target: string
  details: string
  createdAt: string
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/activity-log`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data && data.success) {
        setLogs(data.data || [])
      } else {
        throw new Error(data.message || 'Failed to fetch logs')
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err)
      // Mock data for demo if API fails
      setLogs([
        { id: '1', adminName: 'Admin Utama', action: 'LOGIN', target: 'Sistem', details: 'Login berhasil dari Chrome/Windows', createdAt: new Date().toISOString() },
        { id: '2', adminName: 'Admin Utama', action: 'EDIT', target: 'Home Settings', details: 'Mengubah judul Hero Section', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
        { id: '3', adminName: 'Admin Utama', action: 'ADD', target: 'Berita', details: 'Menambah berita: "Wisuda Angkatan 2024"', createdAt: new Date(Date.now() - 1000 * 3600).toISOString() },
        { id: '4', adminName: 'Editor', action: 'DELETE', target: 'Galeri', details: 'Menghapus foto ID: #123', createdAt: new Date(Date.now() - 1000 * 3600 * 5).toISOString() },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'LOGIN': return { bg: 'bg-blue-50 text-blue-600 border-blue-100', icon: LogIn }
      case 'LOGOUT': return { bg: 'bg-gray-50 text-gray-400 border-gray-100', icon: LogOut }
      case 'ADD': return { bg: 'bg-green-50 text-green-600 border-green-100', icon: Plus }
      case 'EDIT': return { bg: 'bg-amber-50 text-amber-600 border-amber-100', icon: Edit2 }
      case 'DELETE': return { bg: 'bg-red-50 text-red-600 border-red-100', icon: Trash2 }
      case 'UPLOAD': return { bg: 'bg-purple-50 text-purple-600 border-purple-100', icon: UploadIcon }
      case 'PUBLISH': return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: Globe }
      default: return { bg: 'bg-gray-50 text-gray-500 border-gray-100', icon: Activity }
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        log.details.toLowerCase().includes(searchQuery.toLowerCase())
    
    const date = new Date(log.createdAt)
    const matchStart = !startDate || date >= new Date(startDate)
    const matchEnd = !endDate || date <= new Date(endDate + 'T23:59:59')
    
    return matchSearch && matchStart && matchEnd
  })

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const exportCSV = () => {
    const headers = ['Waktu', 'Admin', 'Aksi', 'Target', 'Detail']
    const rows = filteredLogs.map(log => [
      formatDate(log.createdAt),
      log.adminName,
      log.action,
      log.target,
      log.details.replace(/,/g, ';')
    ])
    
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `activity_log_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Log berhasil di-export ke CSV')
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Log Aktivitas</h1>
            <p className="text-sm text-gray-500 font-medium italic">Riwayat perubahan dan aktivitas admin pada sistem CMS.</p>
         </div>
         <button 
           onClick={exportCSV}
           className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 shadow-xl shadow-gray-900/20 active:scale-95 transition-all flex items-center gap-2"
         >
            <Download className="w-4 h-4" />
            Export CSV
         </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
         <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-2">
               <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                  <Search className="w-3 h-3" /> Pencarian
               </label>
               <input 
                 placeholder="Cari admin, target, atau detail..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 font-medium focus:ring-2 focus:ring-green-500"
               />
            </div>
            <div className="flex gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                     <Calendar className="w-3 h-3" /> Dari Tanggal
                  </label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-xs"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                     <Calendar className="w-3 h-3" /> Sampai Tanggal
                  </label>
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-xs"
                  />
               </div>
               <div className="pt-6 flex gap-2">
                  <button 
                    onClick={fetchLogs}
                    className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-green-600 border border-transparent hover:border-green-100 transition-all"
                  >
                     <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  {(searchQuery || startDate || endDate) && (
                    <button 
                      onClick={() => { setSearchQuery(''); setStartDate(''); setEndDate(''); }}
                      className="px-4 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      Reset
                    </button>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                     <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Waktu / Admin</th>
                     <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Aksi</th>
                     <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Target</th>
                     <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Detail Perubahan</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                         <td colSpan={4} className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-full" /></td>
                      </tr>
                    ))
                  ) : paginatedLogs.length > 0 ? paginatedLogs.map((log) => {
                    const badge = getActionBadge(log.action)
                    return (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                         <td className="px-6 py-6">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                  <User className="w-5 h-5 text-gray-400" />
                               </div>
                               <div>
                                  <div className="font-black text-gray-900 text-sm uppercase tracking-tight leading-none">{log.adminName}</div>
                                  <div className="text-[10px] text-gray-400 font-bold mt-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(log.createdAt)}</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${badge.bg}`}>
                               <badge.icon className="w-3 h-3" />
                               {log.action}
                            </span>
                         </td>
                         <td className="px-6 py-6">
                            <div className="text-xs font-black text-gray-700 uppercase tracking-tight">{log.target}</div>
                         </td>
                         <td className="px-6 py-6">
                            <p className="text-xs text-gray-500 font-medium line-clamp-2 italic">"{log.details}"</p>
                         </td>
                      </tr>
                    )
                  }) : (
                    <tr>
                       <td colSpan={4} className="px-6 py-32 text-center space-y-4">
                          <History className="w-16 h-16 text-gray-100 mx-auto" />
                          <div className="space-y-1">
                             <h3 className="text-lg font-black text-gray-300 uppercase tracking-[0.2em]">Log Kosong</h3>
                             <p className="text-sm text-gray-400 font-medium italic">Belum ada riwayat aktivitas yang tercatat.</p>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Pagination */}
         {totalPages > 1 && (
            <div className="p-6 bg-gray-50 flex items-center justify-between border-t border-gray-100">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Halaman {currentPage} dari {totalPages}</p>
               <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 disabled:opacity-30 hover:bg-green-50 hover:text-green-600 transition-all shadow-sm"
                  >
                     <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 disabled:opacity-30 hover:bg-green-50 hover:text-green-600 transition-all shadow-sm"
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
