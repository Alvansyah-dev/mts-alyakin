# MTs Al-Yakin School Management System

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38B2AC)
![Express](https://img.shields.io/badge/Express.js-Backend-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1)
![Firebase](https://img.shields.io/badge/Firebase-Auth_&_DB-FFCA28)

Sistem informasi sekolah terpadu (Website & CMS Dashboard) untuk MTs Al-Yakin yang dirancang khusus untuk memfasilitasi kebutuhan publikasi digital, manajemen informasi, dan Pendaftaran Peserta Didik Baru (PPDB) online.

---

## 🌟 Fitur Utama

**Website Publik:**
- Beranda (Home)
- Profil Sekolah (Visi, Misi, Sejarah, Ekstrakurikuler)
- Berita & Pengumuman
- Galeri Kegiatan
- PPDB Online (Pendaftaran & Cek Status)
- Konsultasi Interaktif
- Kontak

**Admin CMS Dashboard:**
- Manajemen Berita (CRUD)
- Manajemen Galeri (CRUD)
- Verifikasi PPDB
- Moderasi Konsultasi
- Pengaturan Website (Logo, SEO, Kontak)
- Pengaturan WhatsApp Float
- Log Aktivitas & Keamanan

---

## 📋 Prerequisites

Pastikan Anda telah menginstal/menyiapkan kebutuhan berikut sebelum memulai:

- **Node.js** v20 atau lebih baru
- **MySQL** 8.0 atau lebih baru
- Akun **Firebase** (Gratis)
- Akun **Cloudinary** (Gratis)
- **Git**

---

## ⚙️ Environment Setup

### 1. Dapatkan Kredensial Firebase
- Buka [Firebase Console](https://console.firebase.google.com/)
- Buat proyek baru "MTs Al-Yakin"
- Aktifkan **Authentication** (Email/Password)
- Aktifkan **Firestore Database**
- Buka Project Settings > General, tambahkan aplikasi Web untuk mendapatkan `firebaseConfig`.

### 2. Dapatkan Kredensial Cloudinary
- Daftar di [Cloudinary](https://cloudinary.com/)
- Buka Dashboard untuk mendapatkan `Cloud Name`, `API Key`, dan `API Secret`.
- Buka Settings > Upload, buat "Upload preset" baru (Unsigned) dengan nama `mts-alyakin`.

### 3. Database MySQL
- Pastikan MySQL server berjalan.
- Buat database kosong, contoh: `mts_alyakin`.

---

## 🚀 Installation & Run

```bash
# Clone proyek
git clone https://github.com/yourname/mts-alyakin.git
cd mts-alyakin
```

### Setup Frontend (Website & Admin UI)
```bash
cd frontend
npm install

# Buat file environment
cp .env.local.example .env.local

# Buka .env.local dan isi nilai NEXT_PUBLIC_FIREBASE_*, NEXT_PUBLIC_API_URL, dll.

# Jalankan server frontend
npm run dev
# Buka http://localhost:3000
```

### Setup Backend (API Server)
Buka terminal baru:
```bash
cd backend
npm install

# Buat file environment
cp .env.example .env

# Buka .env dan isi DATABASE_URL, JWT_SECRET, serta kredensial Cloudinary.

# Inisialisasi database dan jalankan seeder
npx prisma migrate dev --name init
npx prisma db seed

# Jalankan server backend
npm run dev
# API akan berjalan di http://localhost:5000
```

---

## 🔑 First Admin Login

Setelah database di-_seed_, satu akun admin default telah dibuat:

- **URL:** `http://localhost:3000/admin/login`
- **Email:** `admin@mtsalyakin.sch.id`
- **Password:** `admin123`

> **⚠️ PENTING:** Segera ubah password admin melalui menu "Ganti Password" di sidebar dashboard setelah login pertama kali.

---

## 🌍 Deployment

### 1. Firebase Hosting (Frontend)
Pastikan Firebase CLI terinstal:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```
Build dan Deploy:
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### 2. Render / Railway (Backend API)
Backend dapat di-deploy dengan mudah menggunakan Render (file `render.yaml` telah disediakan) atau Railway.
- Hubungkan repository GitHub ke layanan tersebut.
- Pastikan memasukkan semua variabel environment yang ada di `.env`.
- Root directory untuk service: `backend/`.
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npm start`

---

## 🗄️ Firebase Firestore Setup

1. Buka [Firebase Console](https://console.firebase.google.com/) > Firestore Database.
2. Buat collection bernama `siteSettings`.
3. Buat dokumen dengan ID berikut beserta isian awalnya (bisa dikosongkan jika ingin diset via CMS):
   - `whatsapp`
   - `general`
   - `popup`
4. Masuk ke tab **Rules** dan terapkan kode berikut:
```javascript
rules_version = "2";
service cloud.firestore {
  match /databases/{database}/documents {
    match /siteSettings/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /activityLog/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🛠 Troubleshooting

- **CORS Error:** Pastikan `FRONTEND_URL` di file `.env` backend sesuai dengan URL tempat frontend Anda berjalan.
- **Prisma Error (Client not found):** Jalankan perintah `npx prisma generate` di folder `backend/`.
- **Firebase Error:** Cek kembali semua `NEXT_PUBLIC_FIREBASE_*` di file `.env.local` frontend.
- **Gambar Tidak Muncul:** Cek kembali `domains` (atau `remotePatterns`) di file `frontend/next.config.ts`. Pastikan domain Cloudinary tercantum.

---
_Dibuat dengan ❤️ untuk kemajuan pendidikan MTs Al-Yakin._
