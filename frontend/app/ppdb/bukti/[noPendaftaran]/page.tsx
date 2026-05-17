// app/ppdb/bukti/[noPendaftaran]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { Printer, AlertCircle } from 'lucide-react';
import { get } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';

const fetcher = (url: string) => get(url).then(res => res.data);

export default function BuktiPendaftaranPage() {
  const params = useParams();
  const noPendaftaran = params.noPendaftaran as string;
  const [mounted, setMounted] = useState(false);

  const { data, error, isLoading } = useSWR(`/api/ppdb/check/${noPendaftaran}`, fetcher);

  useEffect(() => {
    setMounted(true);
    // Force light mode for printing
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
    return () => {
      // Revert to theme logic if needed, but since it's a dedicated page, it's fine
      const theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    };
  }, []);

  if (!mounted) return null;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat data...</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-red-50 p-8 rounded-xl max-w-md w-full border border-red-200">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-red-600 mb-6">Nomor pendaftaran {noPendaftaran} tidak valid atau tidak ditemukan dalam sistem kami.</p>
          <Button asChild className="w-full justify-center">
            <a href="/ppdb">Kembali ke Halaman PPDB</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:py-0 print:bg-white text-black font-sans">
      <div className="max-w-[210mm] mx-auto bg-white p-10 print:p-0 shadow-lg print:shadow-none min-h-[297mm] print:min-h-0 relative">
        
        {/* Print Button (Hidden in Print) */}
        <div className="absolute top-4 right-4 print:hidden">
          <Button onClick={() => window.print()} icon={<Printer className="w-4 h-4" />}>
            Cetak Bukti Pendaftaran
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
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold underline mb-2">BUKTI PENDAFTARAN</h3>
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
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Status Pendaftaran</p>
            <div className="inline-block px-4 py-2 border-2 border-dashed border-gray-400 font-bold text-lg uppercase bg-white">
              {data.status}
            </div>
          </div>
        </div>

        {/* Mock QR Code (Text representation as per prompt) */}
        <div className="absolute top-48 right-10 print:right-0 w-24 h-24 border-2 border-black flex items-center justify-center text-center p-2">
          <span className="text-[10px] font-mono leading-tight break-all font-bold">
            QR:{data.noPendaftaran}
          </span>
        </div>

        {/* Data Tables */}
        <div className="space-y-6">
          <section>
            <h4 className="font-bold text-lg mb-3 bg-gray-200 p-2">A. DATA CALON SISWA</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 w-1/3 text-gray-600 font-medium">Nama Lengkap</td>
                  <td className="py-2 font-bold">: {data.namaLengkap}</td>
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
                <tr className="border-b border-gray-100">
                  <td className="py-2 align-top text-gray-600 font-medium">Alamat Lengkap</td>
                  <td className="py-2">: {data.alamatLengkap}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h4 className="font-bold text-lg mb-3 bg-gray-200 p-2">B. DATA ORANG TUA / WALI</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 w-1/3 text-gray-600 font-medium">Nama Ayah</td>
                  <td className="py-2">: {data.namaAyah}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-600 font-medium">Pekerjaan Ayah</td>
                  <td className="py-2">: {data.pekerjaanAyah}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-600 font-medium">Nama Ibu</td>
                  <td className="py-2">: {data.namaIbu}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-600 font-medium">Pekerjaan Ibu</td>
                  <td className="py-2">: {data.pekerjaanIbu}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-600 font-medium">No. Telepon / HP</td>
                  <td className="py-2">: {data.noHpOrtu}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h4 className="font-bold text-lg mb-3 bg-gray-200 p-2">C. KELENGKAPAN BERKAS</h4>
            <div className="grid grid-cols-2 gap-4 text-sm px-2">
              <div className="flex items-center">
                <span className="w-5 h-5 border border-black inline-flex items-center justify-center mr-2 font-bold text-xs">{data.fotoUrl ? '✓' : ''}</span>
                Pas Foto 3x4
              </div>
              <div className="flex items-center">
                <span className="w-5 h-5 border border-black inline-flex items-center justify-center mr-2 font-bold text-xs">{data.ijazahUrl ? '✓' : ''}</span>
                Ijazah / SKL
              </div>
              <div className="flex items-center">
                <span className="w-5 h-5 border border-black inline-flex items-center justify-center mr-2 font-bold text-xs">{data.kkUrl ? '✓' : ''}</span>
                Kartu Keluarga
              </div>
              <div className="flex items-center">
                <span className="w-5 h-5 border border-black inline-flex items-center justify-center mr-2 font-bold text-xs">{data.aktaUrl ? '✓' : ''}</span>
                Akta Kelahiran
              </div>
            </div>
          </section>
        </div>

        {/* Notice */}
        <div className="mt-8 p-4 border border-gray-400 bg-gray-50 text-sm">
          <p className="font-bold mb-1 text-red-600">PERHATIAN PENTING:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Simpan bukti pendaftaran ini dengan baik.</li>
            <li>Tunjukkan bukti ini beserta dokumen asli saat melakukan proses verifikasi di sekolah.</li>
            <li>Pantau terus status pendaftaran Anda melalui website MTs Al-Yakin.</li>
          </ol>
        </div>

        {/* Signature */}
        <div className="mt-12 flex justify-between px-10 text-center text-sm">
          <div>
            <p className="mb-20">Calon Siswa / Orang Tua</p>
            <p className="font-bold border-b border-black w-48 mx-auto">(.............................................)</p>
          </div>
          <div>
            <p className="mb-20">Surabaya, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>Panitia PPDB</p>
            <p className="font-bold border-b border-black w-48 mx-auto">(.............................................)</p>
            <p className="text-xs text-gray-500 mt-1">Stempel Sekolah</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
          Dicetak dari sistem PPDB Online MTs Al-Yakin pada {new Date().toLocaleString('id-ID')}
        </div>

      </div>
    </div>
  );
}
