'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { 
  Users, BookOpen, Image, MessageSquare, 
  TrendingUp, Eye, Plus, ArrowRight,
  CheckCircle, Clock, XCircle, BarChart3
} from 'lucide-react'
import { get } from '@/lib/api'
import Link from 'next/link'

interface DashboardStats {
  totalPpdb: number
  totalNews: number
  totalGallery: number
  totalConsultation: number
  pendingPpdb: number
  unansweredConsultation: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalPpdb: 0,
    totalNews: 0,
    totalGallery: 0,
    totalConsultation: 0,
    pendingPpdb: 0,
    unansweredConsultation: 0
  })
  const [recentPpdb, setRecentPpdb] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('admin_token')
      if (!token) return // stop jika tidak ada token

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const [statsRes, ppdbRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${apiUrl}/api/ppdb`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(() => null)
        ])
        
        if (cancelled) return
        
        if (statsRes && statsRes.ok) {
          const statsData = await statsRes.json()
          if (statsData && statsData.success) {
            setStats(statsData.data || {
              totalPpdb: 0,
              totalNews: 0,
              totalGallery: 0,
              totalConsultation: 0,
              pendingPpdb: 0,
              unansweredConsultation: 0
            })
          }
        }
        
        if (ppdbRes && ppdbRes.ok) {
          const ppdbData = await ppdbRes.json()
          if (ppdbData && ppdbData.success) {
            setRecentPpdb((ppdbData.data || []).slice(0, 5))
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    fetchDashboardData()
    return () => {
      cancelled = true
    }
  }, [])

  const statCards = [
    { 
      label: 'Pendaftar PPDB', 
      value: stats.totalPpdb, 
      icon: Users, 
      color: 'bg-blue-500', 
      trend: stats.pendingPpdb > 0 ? `${stats.pendingPpdb} Menunggu` : 'Semua Terverifikasi',
      link: '/admin/ppdb-settings'
    },
    { 
      label: 'Berita Sekolah', 
      value: stats.totalNews, 
      icon: BookOpen, 
      color: 'bg-green-500', 
      trend: 'Update Terbaru',
      link: '/admin/berita-settings'
    },
    { 
      label: 'Galeri Foto', 
      value: stats.totalGallery, 
      icon: Image, 
      color: 'bg-purple-500', 
      trend: 'Visual Sekolah',
      link: '/admin/galeri-settings'
    },
    { 
      label: 'Konsultasi', 
      value: stats.totalConsultation, 
      icon: MessageSquare, 
      color: 'bg-orange-500', 
      trend: stats.unansweredConsultation > 0 ? `${stats.unansweredConsultation} Belum Dijawab` : 'Sudah Dijawab',
      link: '/admin/konsultasi-settings'
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Selamat Datang, {user?.name || 'Admin'}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Berikut adalah ringkasan operasional MTs Al-Yakin hari ini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/berita-settings"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-600/20 active:scale-95 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            Tulis Berita
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((item, idx) => (
          <Link 
            key={idx} 
            href={item.link}
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${item.color} p-3 rounded-2xl text-white shadow-lg`}>
                <item.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors" />
            </div>
            <div className="space-y-1">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">{item.label}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900 dark:text-white">
                  {loading ? '...' : item.value}
                </span>
                <span className="text-xs font-bold text-gray-400">Total</span>
              </div>
              <p className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1 mt-2">
                <CheckCircle className="w-3 h-3" />
                {item.trend}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent PPDB */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">Pendaftar PPDB Terbaru</h2>
            </div>
            <Link href="/admin/ppdb-settings" className="text-sm font-bold text-green-600 hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentPpdb.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Belum ada pendaftar PPDB</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Nama Lengkap</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Asal Sekolah</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {recentPpdb.map((siswa, idx) => (
                    <tr key={siswa.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400">
                            {siswa.fullName ? siswa.fullName.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{siswa.fullName || 'Tanpa Nama'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{siswa.previousSchool || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          siswa.status === 'ACCEPTED' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                          siswa.status === 'REJECTED' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                          siswa.status === 'VERIFIED' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                          siswa.status === 'REVISION' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                          'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {siswa.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href="/admin/ppdb-settings" className="text-gray-400 hover:text-green-600 transition-colors inline-block">
                          <Eye className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links / Insights */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Insight Cepat
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm text-yellow-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Belum Dijawab</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{stats.unansweredConsultation} Konsultasi</p>
                  </div>
                </div>
                <Link href="/admin/konsultasi-settings" className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm text-red-500">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">PPDB Menunggu</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{stats.pendingPpdb} Berkas</p>
                  </div>
                </div>
                <Link href="/admin/ppdb-settings" className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>

            <div className="mt-8">
              <div className="bg-green-600 rounded-2xl p-6 text-white relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <BarChart3 className="w-32 h-32" />
                </div>
                <h3 className="font-black text-lg mb-2 relative z-10">Optimalkan Konten</h3>
                <p className="text-green-100 text-sm mb-4 relative z-10">Pastikan informasi di beranda dan profil sekolah selalu diperbarui untuk calon wali murid.</p>
                <Link 
                  href="/admin/home-settings"
                  className="inline-block bg-white text-green-600 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 relative z-10"
                >
                  Edit Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
