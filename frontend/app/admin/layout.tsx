// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Memuat Panel Admin...</p>
        </div>
      </div>
    )
  }

  if (!user && pathname !== '/admin/login') {
    return null
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Generate title from pathname
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard Ringkasan';
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 1) {
      const name = pathParts[1].replace('-settings', '').replace('-', ' ');
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return 'Admin Panel';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 sm:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm font-black text-green-600 hover:text-green-700 transition-all bg-green-50 dark:bg-green-900/30 px-4 py-2.5 rounded-xl border border-green-100 dark:border-green-800/50"
            >
              <span className="hidden sm:inline mr-2 uppercase tracking-wider">Buka Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
