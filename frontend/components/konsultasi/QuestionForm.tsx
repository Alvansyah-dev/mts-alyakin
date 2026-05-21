'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, User, Mail, MessageSquare, Tag } from 'lucide-react'
import { post } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  category: z.string().min(1, 'Pilih kategori'),
  question: z.string().min(20, 'Pertanyaan minimal 20 karakter'),
  isPublic: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function QuestionForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isPublic: true }
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const { doc, setDoc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      const docId = Date.now().toString() + Math.random().toString(36).substring(7)
      await setDoc(doc(db as any, 'consultations', docId), {
        id: docId,
        ...data,
        isModerated: false,
        isHidden: false,
        replies: [],
        createdAt: new Date().toISOString()
      })
      setSubmitted(true)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 
        dark:border-green-800 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full 
          flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Pertanyaan Terkirim!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Terima kasih! Admin akan segera menjawab pertanyaan Anda.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 
            rounded-xl font-medium transition-colors"
        >
          Kirim Pertanyaan Lain
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm 
      border border-gray-100 dark:border-gray-700 p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Ajukan Pertanyaan
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Pertanyaan Anda akan dijawab oleh admin sekolah
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Nama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 
            dark:text-gray-300 mb-2">
            Nama Lengkap
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              {...register('name')}
              placeholder="Masukkan nama Anda"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 
                dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 
                text-gray-900 dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-green-500 
                focus:border-transparent transition-all"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 
            dark:text-gray-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              {...register('email')}
              type="email"
              placeholder="email@contoh.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 
                dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 
                text-gray-900 dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-green-500 
                focus:border-transparent transition-all"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700 
            dark:text-gray-300 mb-2">
            Kategori
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <select
              {...register('category')}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 
                dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-green-500 
                focus:border-transparent transition-all appearance-none"
            >
              <option value="">Pilih kategori...</option>
              <option value="Akademik">Akademik</option>
              <option value="PPDB">PPDB</option>
              <option value="Fasilitas">Fasilitas</option>
              <option value="Ekstrakurikuler">Ekstrakurikuler</option>
              <option value="Umum">Umum</option>
            </select>
          </div>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Pertanyaan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 
            dark:text-gray-300 mb-2">
            Pertanyaan
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              {...register('question')}
              rows={5}
              placeholder="Tuliskan pertanyaan Anda secara detail..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 
                dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 
                text-gray-900 dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-green-500 
                focus:border-transparent transition-all resize-none"
            />
          </div>
          {errors.question && (
            <p className="text-red-500 text-xs mt-1">{errors.question.message}</p>
          )}
        </div>

        {/* Tampilkan publik */}
        <div className="flex items-center gap-3">
          <input
            {...register('isPublic')}
            type="checkbox"
            id="isPublic"
            className="w-4 h-4 text-green-600 border-gray-300 rounded 
              focus:ring-green-500"
          />
          <label htmlFor="isPublic" className="text-sm text-gray-600 
            dark:text-gray-400">
            Tampilkan pertanyaan ini secara publik
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 
            text-white font-semibold py-3 px-6 rounded-xl transition-colors 
            flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white 
                rounded-full animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Kirim Pertanyaan
            </>
          )}
        </button>
      </form>
    </div>
  )
}
