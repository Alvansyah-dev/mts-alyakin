'use client';

import { useState, useEffect } from 'react';

export const useWhatsAppSettings = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/settings/whatsapp`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          const d = res.data;
          setSettings({
            enabled: d.isEnabled !== undefined ? d.isEnabled : d.enabled,
            number: d.phoneNumber || d.number,
            defaultMessage: d.defaultMessage,
            ppdbMessage: d.ppdbMessage,
            konsultasiMessage: d.consultationMessage || d.konsultasiMessage || d.defaultMessage
          });
        } else {
          // Fallback defaults
          setSettings({
            enabled: true,
            number: '6281234567890',
            defaultMessage: 'Halo admin MTs Al-Yakin, saya ingin bertanya.',
            ppdbMessage: 'Halo admin MTs Al-Yakin, saya ingin bertanya tentang pendaftaran PPDB.',
            konsultasiMessage: 'Halo admin MTs Al-Yakin, saya ingin konsultasi.'
          });
        }
      })
      .catch(err => {
        console.error("Error fetching WhatsApp settings:", err);
        // Fallback defaults
        setSettings({
          enabled: true,
          number: '6281234567890',
          defaultMessage: 'Halo admin MTs Al-Yakin, saya ingin bertanya.',
          ppdbMessage: 'Halo admin MTs Al-Yakin, saya ingin bertanya tentang pendaftaran PPDB.',
          konsultasiMessage: 'Halo admin MTs Al-Yakin, saya ingin konsultasi.'
        });
      });
  }, []);

  return settings;
};
