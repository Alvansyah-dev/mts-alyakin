'use client';

// components/ppdb/RegistrationForm.tsx

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Upload, FileText, CheckCircle, Printer } from 'lucide-react';
import { post } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ImageUpload } from '@/components/ui/ImageUpload';

// Zod schemas for each step
const step1Schema = z.object({
  namaLengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  nisn: z.string().min(10, 'NISN harus 10 digit').max(10, 'NISN harus 10 digit'),
  tempatLahir: z.string().min(3, 'Tempat lahir wajib diisi'),
  tanggalLahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenisKelamin: z.enum(['L', 'P'], { required_error: 'Pilih jenis kelamin' }),
  agama: z.string().min(1, 'Pilih agama'),
  asalSekolah: z.string().min(3, 'Asal sekolah wajib diisi'),
});

const step2Schema = z.object({
  namaAyah: z.string().min(3, 'Nama ayah wajib diisi'),
  pekerjaanAyah: z.string().min(2, 'Pekerjaan ayah wajib diisi'),
  namaIbu: z.string().min(3, 'Nama ibu wajib diisi'),
  pekerjaanIbu: z.string().min(2, 'Pekerjaan ibu wajib diisi'),
  noHpOrtu: z.string().min(10, 'Nomor HP minimal 10 digit'),
  alamat: z.string().min(10, 'Alamat lengkap wajib diisi'),
});

const step3Schema = z.object({
  // Using z.any() for files in Zod client side validation simplicity, 
  // actual validation is handled by ImageUpload component
  fotoUrl: z.any().refine((val) => val !== null && val !== undefined && val !== '', 'Pas foto wajib diunggah'),
  ijazahUrl: z.any().refine((val) => val !== null && val !== undefined && val !== '', 'Ijazah/SKL wajib diunggah'),
  kkUrl: z.any().refine((val) => val !== null && val !== undefined && val !== '', 'Kartu Keluarga wajib diunggah'),
  aktaUrl: z.any().refine((val) => val !== null && val !== undefined && val !== '', 'Akta Kelahiran wajib diunggah'),
});

const formSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type FormData = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, title: 'Data Siswa' },
  { id: 2, title: 'Data Orang Tua' },
  { id: 3, title: 'Upload Dokumen' },
  { id: 4, title: 'Review & Submit' }
];

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ noPendaftaran: string, nama: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<FormData>({
    resolver: zodResolver(
      currentStep === 1 ? step1Schema :
      currentStep === 2 ? step2Schema :
      currentStep === 3 ? step3Schema :
      formSchema
    ),
    mode: 'onTouched',
  });

  const { register, handleSubmit, formState: { errors }, trigger, watch, getValues } = methods;

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: document.getElementById('form-container')?.offsetTop! - 100, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: document.getElementById('form-container')?.offsetTop! - 100, behavior: 'smooth' });
  };

  const onSubmit = async (data: FormData) => {
    if (currentStep !== 4) return;
    
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!imgbbKey) throw new Error('Konfigurasi ImgBB belum diatur');

      const uploadToImgbb = async (file: File) => {
        const fd = new FormData();
        fd.append('image', file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: 'POST',
          body: fd,
        });
        const json = await res.json();
        if (!json.success) throw new Error('Gagal mengunggah gambar');
        return json.data.url;
      };

      const [fotoUrl, ijazahUrl, kkUrl, aktaUrl] = await Promise.all([
        data.fotoUrl instanceof File ? uploadToImgbb(data.fotoUrl) : data.fotoUrl,
        data.ijazahUrl instanceof File ? uploadToImgbb(data.ijazahUrl) : data.ijazahUrl,
        data.kkUrl instanceof File ? uploadToImgbb(data.kkUrl) : data.kkUrl,
        data.aktaUrl instanceof File ? uploadToImgbb(data.aktaUrl) : data.aktaUrl,
      ]);

      const { doc, setDoc, getDocs, collection } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      // Generate Pendaftaran Number
      const counterSnap = await getDocs(collection(db as any, 'ppdb'));
      const count = counterSnap.size + 1;
      const noPendaftaran = `PPDB${new Date().getFullYear()}${count.toString().padStart(4, '0')}`;

      const docId = Date.now().toString();
      await setDoc(doc(db as any, 'ppdb', docId), {
        id: docId,
        registrationNumber: noPendaftaran,
        ...data,
        documents: [
          { name: 'Pas Foto', url: fotoUrl },
          { name: 'Ijazah', url: ijazahUrl },
          { name: 'Kartu Keluarga', url: kkUrl },
          { name: 'Akta Kelahiran', url: aktaUrl },
        ],
        status: 'PENDING',
        createdAt: new Date().toISOString()
      });
      
      setSuccessData({
        noPendaftaran: noPendaftaran,
        nama: data.namaLengkap
      });
      setCurrentStep(5); // Success step
      
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 5 && successData) {
    return (
      <Card className="max-w-2xl mx-auto p-8 text-center animate-fadeIn border-t-4 border-t-accent">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-text-primary mb-2">Pendaftaran Berhasil!</h2>
        <p className="text-text-secondary mb-8">Terima kasih telah mendaftar di MTs Al-Yakin.</p>
        
        <div className="bg-bg-subtle rounded-xl p-6 mb-8 text-left max-w-md mx-auto border border-border">
          <p className="text-sm text-text-muted mb-1">Nomor Pendaftaran</p>
          <p className="font-mono text-2xl font-bold text-accent tracking-wider mb-4">{successData.noPendaftaran}</p>
          
          <p className="text-sm text-text-muted mb-1">Nama Calon Siswa</p>
          <p className="font-semibold text-text-primary text-lg">{successData.nama}</p>
        </div>

        <p className="text-sm text-text-muted mb-8 max-w-md mx-auto">
          Silakan simpan nomor pendaftaran ini untuk mengecek status pendaftaran Anda. Anda juga dapat mencetak bukti pendaftaran.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => window.print()} icon={<Printer className="w-4 h-4" />}>
            Cetak Bukti
          </Button>
          <Button variant="secondary" asChild>
            <a href="/ppdb">Kembali ke PPDB</a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div id="form-container" className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      {/* Progress Steps */}
      <div className="mb-12 px-4">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 dark:bg-gray-800 z-0 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-600 z-0 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(22,163,74,0.5)]"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>
          
          {STEPS.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 shadow-xl ${
                  currentStep > step.id 
                    ? 'bg-green-600 text-white scale-110' 
                    : currentStep === step.id 
                      ? 'bg-green-600 text-white ring-8 ring-green-600/20 scale-125' 
                      : 'bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-400'
                }`}
              >
                {currentStep > step.id ? <Check className="w-6 h-6" /> : step.id}
              </div>
              <span className={`mt-5 text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block ${
                currentStep >= step.id ? 'text-green-600' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card className="p-10 md:p-16 rounded-[2.5rem] shadow-2xl border-gray-100 dark:border-gray-800">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <AnimatePresence mode="wait">
              {/* STEP 1: Data Siswa */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-heading font-bold text-text-primary mb-6 pb-2 border-b border-border">Data Calon Siswa</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Nama Lengkap <span className="text-red-500">*</span></label>
                      <input {...register('namaLengkap')} className="w-full px-4 py-2 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all dark:text-white" />
                      {errors.namaLengkap && <p className="text-red-500 text-xs mt-1">{errors.namaLengkap.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">NISN <span className="text-red-500">*</span></label>
                      <input {...register('nisn')} type="number" className="w-full px-4 py-2 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all dark:text-white" />
                      {errors.nisn && <p className="text-red-500 text-xs mt-1">{errors.nisn.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Tempat Lahir <span className="text-red-500">*</span></label>
                      <input {...register('tempatLahir')} className="w-full px-4 py-2 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all dark:text-white" />
                      {errors.tempatLahir && <p className="text-red-500 text-xs mt-1">{errors.tempatLahir.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Tanggal Lahir <span className="text-red-500">*</span></label>
                      <input {...register('tanggalLahir')} type="date" className="w-full px-4 py-2 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all dark:text-white" />
                      {errors.tanggalLahir && <p className="text-red-500 text-xs mt-1">{errors.tanggalLahir.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Jenis Kelamin <span className="text-red-500">*</span></label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input {...register('jenisKelamin')} type="radio" value="L" className="text-accent focus:ring-accent h-4 w-4" />
                          <span className="text-text-secondary">Laki-laki</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input {...register('jenisKelamin')} type="radio" value="P" className="text-accent focus:ring-accent h-4 w-4" />
                          <span className="text-text-secondary">Perempuan</span>
                        </label>
                      </div>
                      {errors.jenisKelamin && <p className="text-red-500 text-xs mt-1">{errors.jenisKelamin.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Agama <span className="text-red-500">*</span></label>
                      <select {...register('agama')} className="w-full px-4 py-2 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all dark:text-white">
                        <option value="">Pilih Agama...</option>
                        <option value="Islam">Islam</option>
                      </select>
                      {errors.agama && <p className="text-red-500 text-xs mt-1">{errors.agama.message as string}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-text-primary">Asal Sekolah (SD/MI) <span className="text-red-500">*</span></label>
                      <input {...register('asalSekolah')} className="w-full px-4 py-2 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all dark:text-white" />
                      {errors.asalSekolah && <p className="text-red-500 text-xs mt-1">{errors.asalSekolah.message as string}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Data Orang Tua */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-heading font-bold text-text-primary mb-6 pb-2 border-b border-border">Data Orang Tua / Wali</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Nama Ayah <span className="text-red-500">*</span></label>
                      <input {...register('namaAyah')} className="w-full px-4 py-2 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all dark:text-white" />
                      {errors.namaAyah && <p className="text-red-500 text-xs mt-1">{errors.namaAyah.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Pekerjaan Ayah <span className="text-red-500">*</span></label>
                      <input {...register('pekerjaanAyah')} className="w-full px-4 py-2 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all dark:text-white" />
                      {errors.pekerjaanAyah && <p className="text-red-500 text-xs mt-1">{errors.pekerjaanAyah.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Nama Ibu <span className="text-red-500">*</span></label>
                      <input {...register('namaIbu')} className="w-full px-4 py-2 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all dark:text-white" />
                      {errors.namaIbu && <p className="text-red-500 text-xs mt-1">{errors.namaIbu.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Pekerjaan Ibu <span className="text-red-500">*</span></label>
                      <input {...register('pekerjaanIbu')} className="w-full px-4 py-2 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all dark:text-white" />
                      {errors.pekerjaanIbu && <p className="text-red-500 text-xs mt-1">{errors.pekerjaanIbu.message as string}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-text-primary">No HP / WhatsApp (Aktif) <span className="text-red-500">*</span></label>
                      <input {...register('noHpOrtu')} type="tel" className="w-full px-4 py-2 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all dark:text-white" />
                      {errors.noHpOrtu && <p className="text-red-500 text-xs mt-1">{errors.noHpOrtu.message as string}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-text-primary">Alamat Lengkap <span className="text-red-500">*</span></label>
                      <textarea {...register('alamat')} rows={3} className="w-full px-4 py-2 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all dark:text-white"></textarea>
                      {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat.message as string}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Upload Dokumen */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-heading font-bold text-text-primary mb-6 pb-2 border-b border-border">Upload Dokumen</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 border border-blue-100 dark:border-blue-900/30">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Perhatian:</strong> Pastikan dokumen yang diunggah jelas dan dapat dibaca. Format yang didukung: JPG, PNG. Ukuran maksimal 2MB per file.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Pas Foto Siswa (3x4) <span className="text-red-500">*</span></label>
                      <ImageUpload name="fotoUrl" maxSizeMB={2} />
                      {errors.fotoUrl && <p className="text-red-500 text-xs mt-1">{errors.fotoUrl.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Scan Ijazah / SKL Lulus <span className="text-red-500">*</span></label>
                      <ImageUpload name="ijazahUrl" maxSizeMB={2} />
                      {errors.ijazahUrl && <p className="text-red-500 text-xs mt-1">{errors.ijazahUrl.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Scan Kartu Keluarga <span className="text-red-500">*</span></label>
                      <ImageUpload name="kkUrl" maxSizeMB={2} />
                      {errors.kkUrl && <p className="text-red-500 text-xs mt-1">{errors.kkUrl.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Scan Akta Kelahiran <span className="text-red-500">*</span></label>
                      <ImageUpload name="aktaUrl" maxSizeMB={2} />
                      {errors.aktaUrl && <p className="text-red-500 text-xs mt-1">{errors.aktaUrl.message as string}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Review & Submit */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <h3 className="text-2xl font-heading font-bold text-text-primary mb-6 pb-2 border-b border-border">Review Data Pendaftaran</h3>
                  
                  <div className="bg-bg-subtle rounded-xl p-6 space-y-6">
                    <div>
                      <h4 className="font-bold text-lg mb-3 flex items-center"><span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs mr-2">1</span> Data Siswa</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><span className="text-text-muted block">Nama</span> <span className="font-medium">{watch('namaLengkap')}</span></div>
                        <div><span className="text-text-muted block">NISN</span> <span className="font-medium">{watch('nisn')}</span></div>
                        <div><span className="text-text-muted block">TTL</span> <span className="font-medium">{watch('tempatLahir')}, {watch('tanggalLahir')}</span></div>
                        <div><span className="text-text-muted block">Asal Sekolah</span> <span className="font-medium">{watch('asalSekolah')}</span></div>
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-6">
                      <h4 className="font-bold text-lg mb-3 flex items-center"><span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs mr-2">2</span> Data Orang Tua</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-text-muted block">Nama Ayah</span> <span className="font-medium">{watch('namaAyah')}</span></div>
                        <div><span className="text-text-muted block">Nama Ibu</span> <span className="font-medium">{watch('namaIbu')}</span></div>
                        <div><span className="text-text-muted block">No HP</span> <span className="font-medium">{watch('noHpOrtu')}</span></div>
                        <div><span className="text-text-muted block">Alamat</span> <span className="font-medium">{watch('alamat')}</span></div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h4 className="font-bold text-lg mb-3 flex items-center"><span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs mr-2">3</span> Dokumen</h4>
                      <div className="flex gap-4">
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400"><CheckCircle className="w-4 h-4 mr-1"/> Pas Foto</div>
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400"><CheckCircle className="w-4 h-4 mr-1"/> Ijazah</div>
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400"><CheckCircle className="w-4 h-4 mr-1"/> KK</div>
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400"><CheckCircle className="w-4 h-4 mr-1"/> Akta</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input type="checkbox" required className="mt-1 text-accent focus:ring-accent h-4 w-4 rounded border-gray-300" />
                      <span className="text-sm text-yellow-800 dark:text-yellow-500">
                        Saya menyatakan bahwa seluruh data dan dokumen yang saya isikan/unggah adalah benar. Apabila di kemudian hari ditemukan ketidakbenaran, saya bersedia menerima sanksi yang berlaku.
                      </span>
                    </label>
                  </div>

                  {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm text-center">
                      {errorMsg}
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-10 pt-6 border-t border-border flex justify-between">
              {currentStep > 1 ? (
                <Button type="button" variant="ghost" onClick={handlePrev} icon={<ChevronLeft className="w-4 h-4" />}>
                  Kembali
                </Button>
              ) : (
                <div></div> // Spacer
              )}

              {currentStep < 4 ? (
                <Button type="button" onClick={handleNext}>
                  Selanjutnya <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" loading={isSubmitting}>
                  Kirim Pendaftaran <Upload className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
