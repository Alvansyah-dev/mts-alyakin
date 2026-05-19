// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format Date to Indonesian locale */
export function formatDate(date: Date | string | null | undefined, options?: Intl.DateTimeFormatOptions) {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('id-ID', options ?? { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  } catch (e) {
    return '-';
  }
}

/** Format number with Indonesian locale */
export function formatNumber(num: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('id-ID', options ?? { maximumFractionDigits: 0 }).format(num);
}

/** Slugify string */
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-\-+/g, '-');
}

/** Truncate string */
export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/** Generate unique registration number (example implementation) */
export function generateNoPendaftaran() {
  const timestamp = Date.now().toString().slice(-6);
  return `PPDB-${timestamp}`;
}

/** Format Rupiah currency */
export function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
}

export function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const now = new Date()
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return '';
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (isNaN(diff)) return '';

    if (diff < 60) return 'Baru saja'
    if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`
    if (diff < 2592000) return `${Math.floor(diff / 86400)} hari yang lalu`
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} bulan yang lalu`
    return `${Math.floor(diff / 31536000)} tahun yang lalu`
  } catch (e) {
    return '';
  }
}
