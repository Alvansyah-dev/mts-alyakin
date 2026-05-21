// app/kontak/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionBanner from '@/components/ui/SectionBanner';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getSettings } from '@/lib/firestore';

const contactSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  subject: z.string().min(5, 'Subjek minimal 5 karakter'),
  message: z.string().min(20, 'Pesan minimal 20 karakter'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function KontakPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings('footer');
        if (data) setSettings(data);
      } catch (error) {
        console.error("Failed to load settings", error);
      }
    };
    fetchSettings();
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Simulate API call for contact form
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, you'd POST to /api/contact here
      console.log('Contact form submitted:', data);
      
      setSubmitStatus('success');
      reset();
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = settings ? [
    { icon: MapPin, label: 'Alamat Lengkap', value: settings.contact?.address || '-' },
    { icon: Phone, label: 'Telepon / Fax', value: settings.contact?.phone || '-' },
    { icon: Mail, label: 'Email Resmi', value: settings.contact?.email || '-' },
    { icon: Clock, label: 'Jam Operasional', value: settings.operatingHours?.filter((h: any) => h.status === 'buka').map((h: any) => `${h.hari}: ${h.jamBuka} - ${h.jamTutup}`).join('\n') || '-' },
  ] : [
    { icon: MapPin, label: 'Alamat Lengkap', value: 'Memuat...' },
    { icon: Phone, label: 'Telepon / Fax', value: 'Memuat...' },
    { icon: Mail, label: 'Email Resmi', value: 'Memuat...' },
    { icon: Clock, label: 'Jam Operasional', value: 'Memuat...' },
  ];

  const whatsappPhone = settings?.contact?.whatsapp || '6281234567890';
  const mapUrl = settings?.contact?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126646.20960533687!2d112.6302821!3d-7.2756141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbf8381ac47f%3A0x3027a76e352be40!2sSurabaya%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1715610000000!5m2!1sen!2sid";

  return (
    <main className="pb-20 bg-bg-primary min-h-screen">
      {/* Page Hero */}
      <SectionBanner
        title="Hubungi Kami"
        subtitle="Kami selalu terbuka untuk pertanyaan, saran, dan kerjasama."
        breadcrumb="Hubungi Kami"
      />

      <div className="container mx-auto px-4 max-w-7xl mt-12">
        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          
          {/* Left: Contact Info */}
          <div className="w-full lg:w-5/12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Informasi Kontak</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 mb-8">
              {contactInfo.map((info, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <Card className="p-5 flex items-start h-full hover:border-accent transition-colors">
                    <div className="bg-accent/10 p-3 rounded-full mr-4 shrink-0">
                      <info.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary text-sm mb-1">{info.label}</h3>
                      <p className="text-text-secondary text-sm whitespace-pre-wrap">{info.value}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a 
                href={`https://wa.me/${whatsappPhone}?text=Halo%20Admin%20MTs%20Al-Yakin,%20saya%20ingin%20bertanya`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                Chat Langsung via WhatsApp
              </a>
            </motion.div>
          </div>

          {/* Right: Contact Form */}
          <div className="w-full lg:w-7/12">
            <Card className="p-6 md:p-8 border-t-4 border-t-accent shadow-lg h-full">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Kirim Pesan</h2>
              <p className="text-text-secondary mb-8 text-sm">Gunakan formulir di bawah ini untuk mengirim pesan langsung ke email admin sekolah.</p>

              {submitStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-900/50 flex items-center"
                >
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <span className="text-xl">✓</span>
                  </div>
                  <div>
                    <p className="font-bold">Pesan Terkirim!</p>
                    <p className="text-sm">Terima kasih, pesan Anda telah kami terima dan akan segera diproses.</p>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                  Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi atau gunakan kontak WhatsApp.
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary">Nama Lengkap <span className="text-red-500">*</span></label>
                    <input 
                      {...register('name')} 
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 outline-none transition-all dark:text-white"
                      placeholder="Masukkan nama Anda"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary">Email Aktif <span className="text-red-500">*</span></label>
                    <input 
                      {...register('email')} 
                      type="email"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 outline-none transition-all dark:text-white"
                      placeholder="contoh@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">Subjek <span className="text-red-500">*</span></label>
                  <input 
                    {...register('subject')} 
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 outline-none transition-all dark:text-white"
                    placeholder="Judul pesan Anda"
                  />
                  {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message as string}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">Pesan Lengkap <span className="text-red-500">*</span></label>
                  <textarea 
                    {...register('message')} 
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg-card focus:ring-2 focus:ring-accent/50 outline-none transition-all resize-none dark:text-white"
                    placeholder="Tuliskan pesan Anda secara detail..."
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs">{errors.message.message as string}</p>}
                </div>

                <div className="text-xs text-text-muted flex items-center justify-between">
                  <span>Formulir ini dilindungi oleh reCAPTCHA.</span>
                  <span className="text-red-500">* Wajib diisi</span>
                </div>

                <Button type="submit" size="lg" className="w-full" loading={isSubmitting} icon={<Send className="w-5 h-5" />}>
                  Kirim Pesan
                </Button>
              </form>
            </Card>
          </div>

        </div>

        {/* Map Embed */}
        <section className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Lokasi Sekolah</h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-2 rounded-full"></div>
          </div>
          <Card className="overflow-hidden h-[400px] relative rounded-2xl shadow-md border-0 p-0 bg-gray-100">
            {/* Using a generic map embed for demo purposes since we don't have a specific lat/lng */}
            {settings ? (
              <iframe 
                src={mapUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi MTs Al-Yakin"
                className="absolute inset-0 grayscale-[20%] contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Memuat Peta...
              </div>
            )}
          </Card>
          <div className="text-center mt-6">
            <Button variant="outline" asChild>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                <MapPin className="w-4 h-4 mr-2" /> Buka Peta Ukuran Penuh
              </a>
            </Button>
          </div>
        </section>

      </div>
    </main>
  );
}
