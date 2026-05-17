'use client';

// components/ppdb/StatusChecker.tsx

import { useState } from 'react';
import { Search, Loader2, FileText, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { get } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { PpdbRegistration } from '@/types';

export default function StatusChecker() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PpdbRegistration | null>(null);
  const [error, setError] = useState('');

  const checkStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Endpoint to check status by noPendaftaran or NISN
      const res = await get(`/api/ppdb/check/${encodeURIComponent(query.trim())}`);
      setResult(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Data pendaftaran tidak ditemukan. Pastikan Nomor Pendaftaran atau NISN benar.');
      } else {
        setError('Terjadi kesalahan saat mengecek status. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'MENUNGGU':
        return { color: 'warning', icon: Clock, text: 'Menunggu Verifikasi' };
      case 'DIVERIFIKASI':
        return { color: 'info', icon: FileText, text: 'Sedang Diproses' };
      case 'DITERIMA':
        return { color: 'success', icon: CheckCircle, text: 'Diterima' };
      case 'DITOLAK':
        return { color: 'danger', icon: XCircle, text: 'Tidak Diterima' };
      case 'REVISI':
        return { color: 'warning', icon: AlertTriangle, text: 'Perlu Revisi Dokumen' };
      default:
        return { color: 'default', icon: Clock, text: status };
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={checkStatus} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Masukkan Nomor Pendaftaran atau NISN..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-bg-card focus:outline-none focus:ring-2 focus:ring-accent/50 dark:text-white"
            disabled={loading}
          />
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-text-muted" />
        </div>
        <Button type="submit" loading={loading} disabled={!query.trim()}>
          Cek Status
        </Button>
      </form>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {result && (
        <Card className="p-6 md:p-8 animate-fadeIn border-t-4 border-t-accent">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-heading font-bold text-text-primary mb-1">Hasil Pencarian</h3>
            <p className="text-text-secondary">Data Pendaftaran Calon Peserta Didik Baru</p>
          </div>

          <div className="bg-bg-subtle rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-sm text-text-muted mb-1">Nomor Pendaftaran</p>
                <p className="font-semibold text-text-primary">{result.noPendaftaran}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">NISN</p>
                <p className="font-semibold text-text-primary">{result.nisn}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Nama Lengkap</p>
                <p className="font-semibold text-text-primary">{result.namaLengkap}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Tanggal Daftar</p>
                <p className="font-semibold text-text-primary">{formatDate(result.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-text-muted mb-3">Status Saat Ini:</p>
            {(() => {
              const display = getStatusDisplay(result.status);
              const Icon = display.icon;
              return (
                <div className="inline-flex flex-col items-center">
                  <Badge variant={display.color as any} className="text-lg px-4 py-2 mb-4 shadow-sm">
                    <Icon className="w-5 h-5 mr-2" />
                    {display.text}
                  </Badge>
                </div>
              );
            })()}

            {result.catatan && (
              <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 p-4 rounded-lg text-left">
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-500 mb-1 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Catatan Panitia:
                </p>
                <p className="text-yellow-700 dark:text-yellow-400 text-sm whitespace-pre-wrap">{result.catatan}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
