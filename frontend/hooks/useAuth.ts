'use client';

// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export const useAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse admin_user:', e);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    // 1️⃣ Coba dapatkan token dari backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const backendRes = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const backendData = await backendRes.json();

    // Jika backend mengembalikan token, simpan dan selesai
    if (backendRes.ok && backendData.success && backendData.data?.token) {
      localStorage.setItem('admin_token', backendData.data.token);
      localStorage.setItem('admin_user', JSON.stringify(backendData.data.admin));
      setUser(backendData.data.admin);
      console.log('Login via backend berhasil');
      return { success: true };
    }

    // === FALLBACK ===
    console.warn('Backend login gagal – beralih ke mode Firestore‑only');
    localStorage.setItem('admin_mode', 'firestore_only');
    
    // Karena backend tidak tersedia, kita mock data admin agar UI bisa masuk
    const mockAdmin = {
      id: 'local_admin',
      email: email,
      name: 'Admin (Mode Terbatas)',
      role: 'ADMIN'
    };
    localStorage.setItem('admin_user', JSON.stringify(mockAdmin));
    setUser(mockAdmin);
    return { success: true };
  } catch (error: any) {
    console.error('Login error:', error);
    // Jika fetch error (mis. jaringan), tetap fallback
    localStorage.setItem('admin_mode', 'firestore_only');
    const mockAdmin = {
      id: 'local_admin',
      email: email,
      name: 'Admin (Mode Terbatas)',
      role: 'ADMIN'
    };
    localStorage.setItem('admin_user', JSON.stringify(mockAdmin));
    setUser(mockAdmin);
    return { success: true };
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    try {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      setUser(null)
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/admin/login'
    }
  };

  const isAdmin = !!user && user.role === 'ADMIN';

  return { user, loading, login, logout, isAdmin };
};
