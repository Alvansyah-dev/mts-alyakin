'use client'

import { useState } from 'react'
import { Save, Globe, Smartphone, Shield, Search } from 'lucide-react'

export default function WebSettings() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Website Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Konfigurasi SEO, identitas situs, dan pengaturan sistem.</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-600/20 active:scale-95">
          <Save className="w-4 h-4" />
          Simpan Global
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              Identitas Situs
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nama Website</label>
                <input type="text" defaultValue="MTs Al-Yakin" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tagline</label>
                <input type="text" defaultValue="Unggul, Berakhlak, dan Berprestasi" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:text-white font-medium" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-green-600" />
              SEO & Metadata
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Meta Description</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:text-white font-medium h-24" defaultValue="Website resmi MTs Al-Yakin. Informasi pendaftaran siswa baru, berita sekolah, dan layanan konsultasi." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Keywords</label>
                <input type="text" defaultValue="mts al-yakin, sekolah islam, ppdb 2024" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:text-white font-medium" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Keamanan & API
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Maintenance Mode</label>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <span className="text-sm font-bold text-gray-500">Nonaktif</span>
                  <div className="w-10 h-5 bg-gray-300 rounded-full relative cursor-pointer"><div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
