// app/admin/ppdb-settings/print/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { Printer, AlertCircle, ShieldCheck } from 'lucide-react';
import { get } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';

const fetcher = (url: string) => get(url).then(res => res.data);

export default function AdminBuktiPendaftaranPage() {
  const params = useParams();
  const id = params.id as string;
  const [mounted, setMounted] = useState(false);

  const { data, error, isLoading } = useSWR(`/api/ppdb/${id}`, fetcher);

  useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (!mounted) return null;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-black bg-white">Memuat data...</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white text-black">
        <div className="text-center bg-red-50 p-8 rounded-xl max-w-md w-full border border-red-200">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-red-600 mb-6">Data PPDB tidak ditemukan.</p>
          <Button asChild className="w-full justify-center">
            <a href="/admin/ppdb-settings">Kembali ke Admin PPDB</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:py-0 print:bg-white text-black font-sans">
      <div className="max-w-[210mm] mx-auto bg-white p-10 print:p-0 shadow-lg print:shadow-none min-h-[297mm] print:min-h-0 relative">
        
        {/* Print Button (Hidden in Print) */}
        <div className="absolute top-4 right-4 print:hidden flex space-x-2">
          <Button variant="outline" asChild>
            <a href="/admin/ppdb-settings">Kembali</a>
          </Button>
          <Button onClick={() => window.print()} icon={<Printer className="w-4 h-4" />}>
            Cetak Dokumen
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-green-700 pb-4 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-green-700 rounded flex items-center justify-center text-white font-bold text-3xl shrink-0">
              AY
            </div>
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wide text-green-800">Panitia PPDB</h1>
              <h2 className="text-xl font-bold">MTs Al-Yakin</h2>
              <p className="text-sm text-gray-600">Jl. Pendidikan No. 1, Surabaya, Jawa Timur 60225</p>
              <p className="text-sm text-gray-600">Telp: (031) 876-5432 | Email: info@mtsalyakin.sch.id</p>
            </div>
          </div>
          <div className="text-right border-l-2 border-gray-200 pl-4 py-2 hidden sm:block">
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Dokumen Admin</p>
            <p className="text-sm font-mono">{id.split('-')[0].toUpperCase()}</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold underline mb-2">BUKTI VERIFIKASI PENDAFTARAN</h3>
          <p className="text-sm text-gray-600">Tahun Ajaran 2024/2025</p>
        </div>

        {/* Status Box */}
        <div className="flex justify-between items-start mb-8 border-2 border-gray-200 p-4 rounded-lg bg-gray-50">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Nomor Pendaftaran</p>
            <p className="text-3xl font-mono font-bold tracking-widest text-green-700">{data.noPendaftaran}</p>
            <p className="text-sm mt-2 text-gray-600">Tanggal Daftar: {formatDate(data.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Status Sistem</p>
            <div className={`inline-block px-4 py-2 border-2 border-dashed font-bold text-lg uppercase bg-white ${
              data.status === 'DITERIMA' ? 'text-green-600 border-green-600' : 
              data.status === 'DITOLAK' ? 'text-red-600 border-red-600' : 'text-gray-700 border-gray-400'
            }`}>
              {data.status}
            </div>
          </div>
        </div>

        {/* Admin Verification Stamp Overlay (if accepted/verified) */}
        {(data.status === 'DITERIMA' || data.status === 'DIVERIFIKASI') && (
          <div className="absolute top-64 right-1/4 opacity-10 rotate-[-15deg] pointer-events-none">
            <div className="border-8 border-green-600 rounded-lg p-4 text-center">
              <ShieldCheck className="w-24 h-24 text-green-600 mx-auto" />
              <p className="text-2xl font-bold text-green-600 uppercase mt-2">DIVERIFIKASI ADMIN</p>
            </div>
          </div>
        )}

        {/* Data Tables */}
        <div className="space-y-6 relative z-10">
          <section>
            <h4 className="font-bold text-lg mb-3 bg-gray-200 p-2">A. DATA CALON SISWA</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 w-1/3 text-gray-600 font-medium">Nama Lengkap</td>
                  <td className="py-2 font-bold uppercase">: {data.namaLengkap}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-600 font-medium">NISN</td>
                  <td className="py-2">: {data.nisn}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-600 font-medium">Tempat, Tanggal Lahir</td>
                  <td className="py-2">: {data.tempatLahir}, {formatDate(data.tanggalLahir).split(' ')[0]}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-600 font-medium">Jenis Kelamin</td>
                  <td className="py-2">: {data.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-600 font-medium">Asal Sekolah</td>
                  <td className="py-2">: {data.asalSekolah}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h4 className="font-bold text-lg mb-3 bg-gray-200 p-2">B. DATA ORANG TUA / WALI</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 w-1/3 text-gray-600 font-medium">Nama Orang Tua (Ayah/Ibu)</td>
                  <td className="py-2">: {data.namaAyah} / {data.namaIbu}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-600 font-medium">No. Telepon / HP</td>
                  <td className="py-2">: {data.noHpOrtu}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h4 className="font-bold text-lg mb-3 bg-gray-200 p-2">C. KELENGKAPAN BERKAS (VERIFIKASI MANUAL)</h4>
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left w-12">No</th>
                  <th className="border border-gray-300 p-2 text-left">Nama Dokumen</th>
                  <th className="border border-gray-300 p-2 text-center w-24">Ada</th>
                  <th className="border border-gray-300 p-2 text-center w-24">Tidak</th>
                  <th className="border border-gray-300 p-2 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Pas Foto 3x4 (Warna)', sys: !!data.fotoUrl },
                  { name: 'Scan/FC Ijazah/SKL Legalisir', sys: !!data.ijazahUrl },
                  { name: 'Scan/FC Kartu Keluarga (KK)', sys: !!data.kkUrl },
                  { name: 'Scan/FC Akta Kelahiran', sys: !!data.aktaUrl },
                  { name: 'Sertifikat Prestasi (Jika Ada)', sys: false }
                ].map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-300 p-2 text-center">{idx + 1}</td>
                    <td className="border border-gray-300 p-2">{item.name} {item.sys ? <span className="text-[10px] text-green-600 ml-1">(Uploaded)</span> : ''}</td>
                    <td className="border border-gray-300 p-2 text-center"></td>
                    <td className="border border-gray-300 p-2 text-center"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {data.catatan && (
              <div className="mt-4 p-3 border border-yellow-400 bg-yellow-50 rounded text-sm">
                <span className="font-bold text-yellow-800">Catatan Admin:</span>
                <p className="mt-1 text-yellow-900">{data.catatan}</p>
              </div>
            )}
          </section>
        </div>

        {/* Signature */}
        <div className="mt-16 flex justify-between px-10 text-center text-sm">
          <div>
            <p className="mb-20">Calon Siswa / Orang Tua</p>
            <p className="font-bold border-b border-black w-48 mx-auto">(.............................................)</p>
          </div>
          <div>
            <p className="mb-20">Surabaya, ............................ 2024<br/>Panitia / Petugas Verifikasi</p>
            <p className="font-bold border-b border-black w-48 mx-auto">(.............................................)</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
          Dokumen ini digunakan untuk keperluan internal panitia PPDB MTs Al-Yakin. Dicetak pada {new Date().toLocaleString('id-ID')}
        </div>

      </div>
    </div>
  );
}
