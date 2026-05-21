'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageUploadFieldProps {
  label: string
  value?: string | null
  onChange: (url: string, publicId?: string) => void
  description?: string
  aspectRatio?: 'video' | 'square' | 'portrait' | 'any'
}

export default function ImageUploadField({
  label,
  value = null,
  onChange,
  description,
  aspectRatio = 'video'
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Upload via internal API route
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'ImgBB upload failed')
      }
      onChange(data.url, data.publicId)
      setIsUploading(false)
      return
      
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah gambar ke Firebase Storage.')
    } finally {
      setIsUploading(false)
    }
  }

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    any: 'aspect-auto min-h-[200px]'
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
        {label}
      </label>
      
      <div 
        className={`
          relative group rounded-2xl border-2 border-dashed transition-all overflow-hidden
          ${value 
            ? 'border-green-600/50 bg-green-50/10' 
            : 'border-gray-200 dark:border-gray-700 hover:border-green-600/50 bg-gray-50 dark:bg-gray-900/50'}
          ${aspectClasses[aspectRatio]}
        `}
      >
        <AnimatePresence mode="wait">
          {value ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              <img 
                src={value} 
                alt="Upload preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                  className="p-3 bg-white text-gray-900 rounded-full hover:scale-110 transition-transform shadow-xl"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); onChange(''); }}
                  className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform shadow-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
              disabled={isUploading}
              className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-green-600 transition-colors"
            >
              {isUploading ? (
                <Loader2 className="w-10 h-10 animate-spin mb-2" />
              ) : (
                <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
              )}
              <span className="text-sm font-bold">
                {isUploading ? 'Mengunggah...' : 'Klik untuk Unggah'}
              </span>
            </button>
          )}
        </AnimatePresence>

        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>

      {description && (
        <p className="text-[11px] text-gray-400 font-medium ml-1">
          {description}
        </p>
      )}
    </div>
  )
}
