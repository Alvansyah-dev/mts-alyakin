'use client'

import React from 'react'
import { Save, Eye, Globe, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface EditorLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
  preview: React.ReactNode
  onSave: () => void
  isSaving?: boolean
  isDirty?: boolean
  lastSaved?: Date | null
}

export default function EditorLayout({
  title,
  description,
  children,
  preview,
  onSave,
  isSaving = false,
  isDirty = false,
  lastSaved = null
}: EditorLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left: Editor Form (60%) */}
      <div className="w-full lg:w-[60%] space-y-6">
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {isDirty && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="hidden sm:flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Belum Simpan
                </motion.div>
              )}
              {!isDirty && lastSaved && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hidden sm:flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Tersimpan
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={onSave}
              disabled={isSaving}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95
                ${isSaving 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-green-600/20'}
              `}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>

        <div className="pb-12">
          {children}
        </div>
      </div>

      {/* Right: Live Preview (40%) */}
      <div className="w-full lg:w-[40%]">
        <div className="sticky top-28 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold uppercase text-xs tracking-widest">
              <Eye className="w-4 h-4 text-green-600" />
              Live Preview
            </div>
            <button className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors group">
              <Globe className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              Lihat di Website
            </button>
          </div>

          <div className="relative aspect-[9/16] lg:aspect-auto lg:h-[70vh] w-full bg-gray-100 dark:bg-gray-900 rounded-[2rem] border-[8px] border-gray-900 dark:border-gray-800 shadow-2xl overflow-hidden ring-4 ring-gray-100 dark:ring-gray-800">
            {/* Browser/Phone Notch Header */}
            <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 dark:bg-gray-800 flex justify-center items-center z-10">
              <div className="w-16 h-1 bg-gray-700 rounded-full" />
            </div>

            {/* Content Preview with Scaling */}
            <div className="h-full w-full overflow-y-auto pt-6 scrollbar-hide">
              <div className="min-h-full w-full origin-top transform scale-[1] transition-transform duration-500 p-0">
                {preview}
              </div>
            </div>

            {/* Overlay Gradient to show it's a preview */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 rounded-[1.5rem]" />
          </div>
          
          <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
            Tampilan di atas adalah simulasi visual realtime
          </p>
        </div>
      </div>
    </div>
  )
}
