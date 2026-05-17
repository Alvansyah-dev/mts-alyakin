import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Admin
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
      data: {
        email: 'admin@mtsalyakin.sch.id',
        password: hashedPassword,
        name: 'Administrator',
      },
    });
    console.log('Admin created.');
  }

  // 2. Create Sample News
  const newsCount = await prisma.news.count();
  if (newsCount === 0) {
    await prisma.news.createMany({
      data: [
        {
          title: 'Penerimaan Peserta Didik Baru Tahun 2024 Dibuka',
          slug: 'penerimaan-peserta-didik-baru-tahun-2024-dibuka',
          content: '<p>MTs Al-Yakin resmi membuka pendaftaran peserta didik baru...</p>',
          excerpt: 'Informasi lengkap mengenai jadwal dan persyaratan PPDB.',
          category: 'Pengumuman',
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
        {
          title: 'Juara 1 Lomba Tahfidz Tingkat Kabupaten',
          slug: 'juara-1-lomba-tahfidz-tingkat-kabupaten',
          content: '<p>Alhamdulillah, ananda Ahmad dari kelas 8 berhasil meraih...</p>',
          excerpt: 'Siswa MTs Al-Yakin kembali mengharumkan nama sekolah di tingkat kabupaten.',
          category: 'Prestasi',
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      ],
    });
    console.log('Sample news created.');
  }

  // 3. Create Sample Settings
  const settingsCount = await prisma.siteSettings.count();
  if (settingsCount === 0) {
    await prisma.siteSettings.createMany({
      data: [
        {
          key: 'popupBanner',
          value: {
            enabled: true,
            title: 'Informasi Pendaftaran Siswa Baru',
            content: 'Pendaftaran siswa baru tahun ajaran 2024/2025 telah dibuka!',
            buttonText: 'Daftar Sekarang',
            buttonUrl: '/ppdb',
            imageUrl: ''
          }
        },
        {
          key: 'whatsapp',
          value: {
            enabled: true,
            number: '6281234567890',
            defaultMessage: 'Halo admin MTs Al-Yakin, saya ingin bertanya.'
          }
        }
      ]
    });
    console.log('Sample settings created.');
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
