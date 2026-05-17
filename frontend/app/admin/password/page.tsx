'use client'

import { useState } from 'react'
import { Save, Lock, ShieldCheck, Key } from 'lucide-react'

export default function PasswordPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Ganti Password</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Perbarui kata sandi akun administrator Anda secara berkala.</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-600/20 active:scale-95">
          <Save className="w-4 h-4" />
          Update Password
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm max-w-md">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-gray-400" />
              Password Lama
            </label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />
          <div>
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Password Baru
            </label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2">Konfirmasi Password Baru</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none transition-all dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
