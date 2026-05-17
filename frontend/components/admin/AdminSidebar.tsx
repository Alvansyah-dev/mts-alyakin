'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Settings, 
  Image, 
  BookOpen, 
  MessageSquare, 
  Users, 
  Phone, 
  Bell, 
  Globe, 
  Menu, 
  ChevronLeft,
  LogOut,
  Lock,
  Home,
  Layers,
  FileText,
  History
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

const menuGroups = [
  {
    title: 'Utama',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Konten Website',
    items: [
      { name: 'Beranda', href: '/admin/home-settings', icon: Home },
      { name: 'Profil Sekolah', href: '/admin/profil-settings', icon: Layers },
      { name: 'Berita', href: '/admin/berita-settings', icon: BookOpen },
      { name: 'Galeri', href: '/admin/galeri-settings', icon: Image },
    ]
  },
  {
    title: 'Layanan',
    items: [
      { name: 'PPDB Online', href: '/admin/ppdb-settings', icon: Users },
      { name: 'Konsultasi', href: '/admin/konsultasi-settings', icon: MessageSquare },
    ]
  },
  {
    title: 'Integrasi & Fitur',
    items: [
      { name: 'WhatsApp', href: '/admin/whatsapp-settings', icon: Phone },
      { name: 'Popup Banner', href: '/admin/popup-settings', icon: Bell },
    ]
  },
  {
    title: 'Sistem',
    items: [
      { name: 'Website Settings', href: '/admin/website-settings', icon: Globe },
      { name: 'Footer Website', href: '/admin/footer-settings', icon: FileText },
      { name: 'Ganti Password', href: '/admin/change-password', icon: Lock },
      { name: 'Log Aktivitas', href: '/admin/activity-log', icon: History },
    ]
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div 
      className={`relative bg-gray-900 border-r border-gray-800 transition-all duration-500 flex flex-col h-screen sticky top-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 overflow-hidden">
        <div className="min-w-[40px] w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-green-600/20">
          A
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="whitespace-nowrap"
            >
              <h1 className="text-white font-black tracking-tight leading-none">CMS PANEL</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">MTs Al-Yakin</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 border-2 border-gray-900"
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-8 py-6">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            {!isCollapsed && (
              <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] px-2 mb-4">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                      isActive 
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 min-w-[20px] ${isActive ? 'text-white' : 'group-hover:text-green-500'}`} />
                    {!isCollapsed && (
                      <span className="text-sm font-bold whitespace-nowrap">{item.name}</span>
                    )}
                    {isCollapsed && (
                      <div className="absolute left-14 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-800 whitespace-nowrap z-[100]">
                        {item.name}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all group"
        >
          <LogOut className="w-5 h-5 min-w-[20px]" />
          {!isCollapsed && <span className="text-sm font-bold">Logout</span>}
        </button>
      </div>
    </div>
  )
}
