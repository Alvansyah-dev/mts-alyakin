'use client'

import React, { useState, useEffect } from 'react'
import { 
  Layout, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  Link as LinkIcon, 
  Clock, 
  Settings, 
  CheckCircle2, 
  Info,
  Type,
  ExternalLink,
  MessageCircle,
  Shield,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronRight,
  HelpCircle,
  Globe
} from 'lucide-react'
import EditorLayout from '@/components/admin/EditorLayout'
import SectionCard from '@/components/admin/SectionCard'
import TabNav from '@/components/admin/TabNav'
import ListEditor from '@/components/admin/ListEditor'
import ImageUploadField from '@/components/admin/ImageUploadField'
import { get, put } from '@/lib/api'
import { toast } from 'sonner'

// --- Interfaces ---

interface FooterLink {
  name: string
  url: string
}

interface OperatingHour {
  day: string
  time: string
  status: 'BUKA' | 'LIBUR'
}

interface FooterSettings {
  school: {
    logoUrl?: string
    title: string
    subtitle: string
    description: string
  }
  contact: {
    address: string
    phone: string
    email: string
    whatsapp: string
    instagram: string
    facebook: string
    youtube: string
    twitter: string
  }
  quickLinks: FooterLink[]
  operatingHours: OperatingHour[]
  other: {
    copyright: string
    credit: string
    showSocialIcons: boolean
    showOperatingHours: boolean
  }
}

// --- Defaults ---

const DEFAULT_FOOTER: FooterSettings = {
  school: {
    logoUrl: '',
    title: 'MTs Al-Yakin',
    subtitle: 'Madrasah Tsanawiyah',
    description: 'MTs Al-Yakin adalah lembaga pendidikan Islam yang berkomitmen mencetak generasi unggul, berakhlak mulia, dan kompeten dalam IPTEK serta IMTAK.'
  },
  contact: {
    address: 'Jl. Raya Pendidikan No. 123, Kabupaten Malang, Jawa Timur',
    phone: '(0341) 123456',
    email: 'info@mtsalyakin.sch.id',
    whatsapp: '6281234567890',
    instagram: 'mtsalyakin',
    facebook: 'mtsalyakinofficial',
    youtube: 'mtsalyakintv',
    twitter: 'mtsalyakin'
  },
  quickLinks: [
    { name: 'Beranda', url: '/' },
    { name: 'Profil', url: '/profil' },
    { name: 'Berita', url: '/berita' },
    { name: 'Galeri', url: '/galeri' },
    { name: 'PPDB', url: '/ppdb' },
    { name: 'Konsultasi', url: '/konsultasi' },
    { name: 'Kontak', url: '/kontak' }
  ],
  operatingHours: [
    { day: 'Senin - Jumat', time: '07.00 - 16.00', status: 'BUKA' },
    { day: 'Sabtu', time: '07.00 - 12.00', status: 'BUKA' },
    { day: 'Minggu', time: '-', status: 'LIBUR' }
  ],
  other: {
    copyright: '© 2024 MTs Al-Yakin. Hak cipta dilindungi.',
    credit: 'Dibuat dengan ❤️ oleh Tim IT MTs Al-Yakin',
    showSocialIcons: true,
    showOperatingHours: true
  }
}

export default function FooterSettingsPage() {
  const [settings, setSettings] = useState<FooterSettings>(DEFAULT_FOOTER)
  const [activeTab, setActiveTab] = useState('school')
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/settings/footer`)
      const data = await response.json()
      if (data && data.success) {
        setSettings(data.data || DEFAULT_FOOTER)
      }
    } catch (err) {
      console.error('Failed to fetch footer settings:', err)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('Sesi habis. Silakan login ulang.')
        window.location.href = '/admin/login'
        return
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/settings/footer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })
      
      const data = await res.json()
      if (data.success) {
        setIsDirty(false)
        toast.success('Pengaturan footer berhasil disimpan!')
      } else {
        toast.error('Gagal menyimpan: ' + data.message)
      }
    } catch (err) {
      toast.error('Gagal menyimpan pengaturan.')
    } finally {
      setIsSaving(false)
    }
  }

  const updateSection = (section: keyof FooterSettings, data: any) => {
    setSettings(prev => ({ ...prev, [section]: { ...prev[section], ...data } }))
    setIsDirty(true)
  }

  const tabs = [
    { id: 'school', label: 'Info Sekolah', icon: Info },
    { id: 'contact', label: 'Kontak & Sosmed', icon: MapPin },
    { id: 'links', label: 'Quick Links', icon: LinkIcon },
    { id: 'hours', label: 'Jam Operasional', icon: Clock },
    { id: 'others', label: 'Pengaturan Lain', icon: Settings },
  ]

  // --- Render Preview (Mini Footer) ---

  const renderFullFooterPreview = () => (
    <div className="bg-[#052c14] text-white p-12 rounded-[3rem] border border-green-800 shadow-2xl scale-[0.85] origin-top mt-8">
       <div className="grid grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                {settings.school.logoUrl ? (
                   <img src={settings.school.logoUrl} className="w-10 h-10 object-contain" />
                ) : (
                   <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center font-black text-xs">MAY</div>
                )}
                <div>
                   <h4 className="text-sm font-black uppercase tracking-tight leading-tight">{settings.school.title}</h4>
                   <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">{settings.school.subtitle}</p>
                </div>
             </div>
             <p className="text-[10px] text-green-100/60 leading-relaxed">{settings.school.description}</p>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">Navigasi</h4>
             <div className="grid grid-cols-1 gap-2">
                {settings.quickLinks.slice(0, 5).map((l, i) => (
                  <div key={i} className="text-[10px] text-green-100/80 hover:text-white transition-colors cursor-pointer flex items-center gap-2 group">
                     <div className="w-1 h-1 bg-green-600 rounded-full group-hover:scale-150 transition-transform" />
                     {l.name}
                  </div>
                ))}
             </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">Kontak Kami</h4>
             <div className="space-y-3">
                <div className="flex gap-3 items-start">
                   <MapPin className="w-3.5 h-3.5 text-green-500 shrink-0" />
                   <span className="text-[9px] text-green-100/80 leading-relaxed">{settings.contact.address}</span>
                </div>
                <div className="flex gap-3 items-center">
                   <Phone className="w-3.5 h-3.5 text-green-500" />
                   <span className="text-[9px] text-green-100/80">{settings.contact.phone}</span>
                </div>
                <div className="flex gap-3 items-center">
                   <Mail className="w-3.5 h-3.5 text-green-500" />
                   <span className="text-[9px] text-green-100/80">{settings.contact.email}</span>
                </div>
             </div>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
             {settings.other.showOperatingHours && (
               <>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">Jam Operasional</h4>
                 <div className="space-y-2">
                    {settings.operatingHours.map((h, i) => (
                      <div key={i} className="flex justify-between text-[9px]">
                         <span className="text-green-100/60">{h.day}</span>
                         <span className={`font-bold ${h.status === 'BUKA' ? 'text-white' : 'text-red-400'}`}>{h.time}</span>
                      </div>
                    ))}
                 </div>
               </>
             )}
          </div>
       </div>

       <div className="mt-12 pt-8 border-t border-green-900 flex justify-between items-center">
          <div className="space-y-1">
             <p className="text-[9px] text-green-100/40 font-medium">{settings.other.copyright}</p>
             <p className="text-[9px] text-green-400 font-bold uppercase tracking-widest">{settings.other.credit}</p>
          </div>
          {settings.other.showSocialIcons && (
            <div className="flex gap-3">
               {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                 <div key={i} className="p-2 rounded-lg bg-green-900/50 hover:bg-green-600 transition-all cursor-pointer">
                    <Icon className="w-3.5 h-3.5" />
                 </div>
               ))}
            </div>
          )}
       </div>
    </div>
  )

  const renderPreview = () => (
    <div className="h-full bg-gray-50 flex flex-col items-center justify-center p-8 overflow-hidden">
       <div className="text-center space-y-2 mb-8">
          <h3 className="text-xs font-black uppercase tracking-widest text-green-600">Mini Footer Preview</h3>
          <p className="text-[10px] text-gray-400 font-medium italic">Tampilan footer akan muncul di bagian bawah form editor.</p>
       </div>
       <div className="w-full h-40 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-200">
          <Globe className="w-12 h-12" />
       </div>
    </div>
  )

  return (
    <EditorLayout
      title="Pengaturan Footer"
      description="Kelola informasi sekolah, kontak, link navigasi, dan jam operasional yang tampil di bagian bawah website."
      preview={renderPreview()}
      onSave={handleSave}
      isSaving={isSaving}
      isDirty={isDirty}
    >
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-8 animate-in fade-in duration-500">
        {activeTab === 'school' && (
          <div className="space-y-8">
            <SectionCard title="Identitas Footer" icon={Info}>
               <ImageUploadField 
                 label="Logo Footer (Opsional)" 
                 value={settings.school.logoUrl}
                 onChange={(url) => updateSection('school', { logoUrl: url })}
               />
               <div className="grid grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-gray-400">Judul Footer</label>
                     <input 
                       value={settings.school.title} 
                       onChange={(e) => updateSection('school', { title: e.target.value })}
                       className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-gray-400">Sub-judul / Tagline</label>
                     <input 
                       value={settings.school.subtitle} 
                       onChange={(e) => updateSection('school', { subtitle: e.target.value })}
                       className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-bold"
                     />
                  </div>
               </div>
               <div className="space-y-2 mt-6">
                  <label className="text-xs font-black uppercase text-gray-400">Deskripsi Singkat Sekolah</label>
                  <textarea 
                    value={settings.school.description} 
                    onChange={(e) => updateSection('school', { description: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                    rows={4}
                  />
               </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-8">
            <SectionCard title="Informasi Kontak" icon={MapPin}>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-gray-400">Alamat Lengkap</label>
                     <textarea 
                       value={settings.contact.address} 
                       onChange={(e) => updateSection('contact', { address: e.target.value })}
                       className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                       rows={2}
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400">Telepon</label>
                        <input value={settings.contact.phone} onChange={(e) => updateSection('contact', { phone: e.target.value })} className="w-full px-4 py-3 rounded-2xl border" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400">Email</label>
                        <input value={settings.contact.email} onChange={(e) => updateSection('contact', { email: e.target.value })} className="w-full px-4 py-3 rounded-2xl border" />
                     </div>
                  </div>
               </div>
            </SectionCard>

            <SectionCard title="Tautan Media Sosial" icon={Globe}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'mtsalyakin' },
                    { id: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'mtsalyakin.official' },
                    { id: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'mtsalyakintv' },
                    { id: 'twitter', label: 'Twitter / X', icon: Twitter, placeholder: 'mtsalyakin' },
                  ].map((s) => (
                    <div key={s.id} className="space-y-2">
                       <label className="text-xs font-black uppercase text-gray-400 flex items-center gap-2">
                          <s.icon className="w-3.5 h-3.5" /> {s.label}
                       </label>
                       <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">@</div>
                          <input 
                            value={(settings.contact as any)[s.id]} 
                            onChange={(e) => updateSection('contact', { [s.id]: e.target.value })}
                            placeholder={s.placeholder}
                            className="w-full pl-8 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50"
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'links' && (
          <SectionCard title="Quick Links (Navigasi)" icon={LinkIcon} description="Daftar tautan cepat yang akan muncul di kolom navigasi footer.">
             <ListEditor
               items={settings.quickLinks}
               onChange={(quickLinks) => updateSection('quickLinks', quickLinks)}
               createNew={() => ({ name: 'Nama Link', url: '#' })}
               renderItem={(item, index, onChange) => (
                 <div className="grid grid-cols-2 gap-4">
                    <input value={item.name} onChange={(e) => onChange({ ...item, name: e.target.value })} placeholder="Label Link" className="px-4 py-2.5 rounded-xl border font-bold" />
                    <input value={item.url} onChange={(e) => onChange({ ...item, url: e.target.value })} placeholder="URL (ex: /profil)" className="px-4 py-2.5 rounded-xl border text-gray-500" />
                 </div>
               )}
             />
          </SectionCard>
        )}

        {activeTab === 'hours' && (
          <SectionCard title="Jam Operasional" icon={Clock}>
             <ListEditor
               items={settings.operatingHours}
               onChange={(operatingHours) => updateSection('operatingHours', operatingHours)}
               createNew={() => ({ day: 'Senin', time: '08:00 - 16:00', status: 'BUKA' })}
               renderItem={(item, index, onChange) => (
                 <div className="flex gap-4 items-center">
                    <div className="flex-1 space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400">Hari</label>
                       <input value={item.day} onChange={(e) => onChange({ ...item, day: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border font-bold" />
                    </div>
                    <div className="flex-1 space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400">Jam Operasional</label>
                       <input value={item.time} onChange={(e) => onChange({ ...item, time: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border font-bold" />
                    </div>
                    <div className="w-32 space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400 text-center">Status</label>
                       <select 
                         value={item.status} 
                         onChange={(e) => onChange({ ...item, status: e.target.value as any })}
                         className="w-full px-4 py-2.5 rounded-xl border font-black uppercase text-[10px] tracking-widest bg-gray-50"
                       >
                          <option value="BUKA">BUKA</option>
                          <option value="LIBUR">LIBUR</option>
                       </select>
                    </div>
                 </div>
               )}
             />
          </SectionCard>
        )}

        {activeTab === 'others' && (
          <SectionCard title="Pengaturan Lanjutan" icon={Settings}>
             <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400">Teks Copyright</label>
                      <input 
                        value={settings.other.copyright} 
                        onChange={(e) => updateSection('other', { copyright: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400">Teks Kredit / Maker</label>
                      <input 
                        value={settings.other.credit} 
                        onChange={(e) => updateSection('other', { credit: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                      />
                   </div>
                </div>

                <div className="flex gap-6">
                   <div className="flex-1 flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="space-y-1">
                         <h4 className="text-sm font-black uppercase tracking-tight">Icon Sosmed</h4>
                         <p className="text-[10px] text-gray-400 font-bold uppercase">Tampilkan di baris bawah</p>
                      </div>
                      <button 
                        onClick={() => updateSection('other', { showSocialIcons: !settings.other.showSocialIcons })}
                        className={`w-14 h-8 rounded-full relative transition-all ${settings.other.showSocialIcons ? 'bg-green-600' : 'bg-gray-300'}`}
                      >
                         <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all ${settings.other.showSocialIcons ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                   </div>
                   <div className="flex-1 flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="space-y-1">
                         <h4 className="text-sm font-black uppercase tracking-tight">Jam Operasional</h4>
                         <p className="text-[10px] text-gray-400 font-bold uppercase">Tampilkan di kolom ke-4</p>
                      </div>
                      <button 
                        onClick={() => updateSection('other', { showOperatingHours: !settings.other.showOperatingHours })}
                        className={`w-14 h-8 rounded-full relative transition-all ${settings.other.showOperatingHours ? 'bg-green-600' : 'bg-gray-300'}`}
                      >
                         <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all ${settings.other.showOperatingHours ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                   </div>
                </div>
             </div>
          </SectionCard>
        )}

        {/* Real-time Footer Preview */}
        <div className="pt-12 border-t border-gray-100">
           <div className="text-center mb-8">
              <h3 className="text-lg font-black uppercase tracking-[0.2em] text-gray-400">Full Footer Preview</h3>
           </div>
           {renderFullFooterPreview()}
        </div>
      </div>
    </EditorLayout>
  )
}
