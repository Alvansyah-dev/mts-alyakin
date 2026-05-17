// app/admin/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn, Lock, Mail, AlertCircle, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  remember: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      window.location.href = '/admin';
    }
  }, [user]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('adminEmail');
      if (savedEmail) {
        setValue('email', savedEmail);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await login(data.email, data.password);
      if (data.remember) {
        localStorage.setItem('adminEmail', data.email);
      } else {
        localStorage.removeItem('adminEmail');
      }
      window.location.href = '/admin';
    } catch (err: any) {
      setErrorMsg(err.message || 'Email atau password salah. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700/50">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-600/20 rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-white font-black text-3xl">A</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Portal Admin
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Masuk ke Dashboard MTs Al-Yakin
            </p>
          </div>

          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm border border-red-100 dark:border-red-900/30 flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Sekolah</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input 
                  {...register('email')}
                  type="email"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-4 focus:ring-green-600/10 focus:border-green-600 outline-none transition-all dark:text-white font-medium"
                  placeholder="admin@mtsalyakin.sch.id"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Kata Sandi</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input 
                  {...register('password')}
                  type="password"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-4 focus:ring-green-600/10 focus:border-green-600 outline-none transition-all dark:text-white font-medium"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    {...register('remember')}
                    type="checkbox" 
                    className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-md peer-checked:bg-green-600 peer-checked:border-green-600 transition-all flex items-center justify-center">
                    <LogIn className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Ingat Sesi Saya</span>
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-lg shadow-xl shadow-green-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3" 
              loading={isSubmitting}
            >
              Masuk Sekarang
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} MTs Al-Yakin. Panel Administrasi Aman.
          </p>
        </div>
      </div>
    </div>
  );
}
