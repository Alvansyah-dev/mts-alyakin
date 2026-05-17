'use client'

import React, { useState } from 'react'
import { 
  KeyRound, 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react'
import SectionCard from '@/components/admin/SectionCard'
import { put } from '@/lib/api'
import { toast } from 'sonner'

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)

  const validate = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    match: newPassword === confirmPassword && newPassword !== ''
  }

  const getStrength = () => {
    let score = 0
    if (validate.length) score += 25
    if (validate.uppercase) score += 25
    if (validate.number) score += 25
    if (newPassword.length > 12) score += 25
    return score
  }

  const strength = getStrength()
  const isValid = validate.length && validate.uppercase && validate.number && validate.match

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setIsLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('Sesi habis. Silakan login ulang.')
        window.location.href = '/admin/login'
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          currentPassword: oldPassword, 
          newPassword 
        })
      })
      
      const data = await res.json()
      if (data.success) {
        toast.success('Password berhasil diperbarui!')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(data.message || 'Gagal mengganti password.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengganti password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md">
        <SectionCard 
          title="Keamanan Akun" 
          icon={ShieldCheck} 
          description="Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun admin."
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Password Lama</label>
              <div className="relative">
                <input 
                  type={showOld ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 font-medium"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <button 
                  type="button" 
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Password Baru</label>
              <div className="relative">
                <input 
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 font-medium"
                  placeholder="••••••••"
                  required
                />
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Strength Bar */}
              <div className="pt-2 space-y-2">
                 <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1">
                    <div 
                      className={`h-full transition-all duration-500 ${strength < 50 ? 'bg-red-500' : strength < 100 ? 'bg-yellow-400' : 'bg-green-500'}`} 
                      style={{ width: `${strength}%` }}
                    />
                 </div>
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kekuatan Sandi</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${strength < 50 ? 'text-red-500' : strength < 100 ? 'text-yellow-500' : 'text-green-600'}`}>
                       {strength < 50 ? 'Lemah' : strength < 100 ? 'Sedang' : 'Sangat Kuat'}
                    </p>
                 </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Konfirmasi Password</label>
              <div className="relative">
                <input 
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 rounded-2xl border bg-gray-50 focus:ring-2 focus:ring-green-500 font-medium transition-all ${confirmPassword && !validate.match ? 'border-red-200 ring-red-50' : 'border-gray-200'}`}
                  placeholder="••••••••"
                  required
                />
                <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <button 
                  type="button" 
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Validation Checklist */}
            <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-3">
               {[
                 { label: 'Minimal 8 Karakter', met: validate.length },
                 { label: 'Mengandung Huruf Besar (A-Z)', met: validate.uppercase },
                 { label: 'Mengandung Angka (0-9)', met: validate.number },
                 { label: 'Konfirmasi Sandi Cocok', met: validate.match },
               ].map((v, i) => (
                 <div key={i} className="flex items-center gap-3">
                    {v.met ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-gray-200" />}
                    <span className={`text-[10px] font-bold uppercase tracking-tight ${v.met ? 'text-green-700' : 'text-gray-400'}`}>{v.label}</span>
                 </div>
               ))}
            </div>

            <button 
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${isValid ? 'bg-green-600 text-white shadow-green-600/20 hover:bg-green-700' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'}`}
            >
               {isLoading ? 'Memproses...' : 'Perbarui Kata Sandi'}
               {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  )
}
