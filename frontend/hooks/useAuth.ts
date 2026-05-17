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
    setLoading(true)
    try {
      // Request JWT dari backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      const backendRes = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const backendData = await backendRes.json()
      console.log('Backend login response:', backendData)
      
      if (backendData.success && backendData.data?.token) {
        localStorage.setItem('admin_token', backendData.data.token)
        localStorage.setItem('admin_user', 
          JSON.stringify(backendData.data.admin))
        setUser(backendData.data.admin)
        console.log('Token saved successfully!')
        return { success: true }
      } else if (backendData.token) {
        localStorage.setItem('admin_token', backendData.token)
        console.log('Token saved (alt format)!')
        return { success: true }
      } else {
        console.error('No token in response:', backendData)
        throw new Error(backendData.message || 'Backend tidak mengembalikan token')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
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
