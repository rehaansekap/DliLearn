# DliLearn — Setup & Deployment Guide

> 🌐 **Live Demo Application:** [https://dlilearn.vercel.app/](https://dlilearn.vercel.app/)

Platform pembelajaran interaktif berbasis web yang dibangun menggunakan **Laravel 12**, **Inertia.js**, **React 19**, **TypeScript**, dan **Tailwind CSS**.

---

## 🔐 Akun Demo (Seeded Users)

Semua akun demo di bawah ini telah dibuat melalui seeder database dengan password default: **`123123123`**

| Role | Nama / Akun | Username | Email | Password |
|---|---|---|---|---|
| **Admin** | Admin | `admin` | `admin@sekolah.id` | `123123123` |
| **Guru** | Pak Budi Santoso | `guru1` | `guru1@sekolah.id` | `123123123` |
| **Guru** | Bu Siti Aminah | `guru2` | `guru2@sekolah.id` | `123123123` |
| **Siswa (1–31)** | Siswa 1 s.d. Siswa 31 | `siswa1` s.d. `siswa31` | `siswa1@sekolah.id` s.d. `siswa31@sekolah.id` | `123123123` |

---

## Repository Layout (High Level)

- Laravel PHP backend (`app/`, `routes/`, `config/`, `bootstrap/`, `resources/views/`)
- React + Inertia frontend (`resources/js/`, `vite.config.ts`)
- Key files:
    - [resources/js/app.tsx](resources/js/app.tsx)
    - [resources/js/ssr.tsx](resources/js/ssr.tsx)
    - [vite.config.ts](vite.config.ts)
    - [package.json](package.json)
    - [.env.example](.env.example)
    - [artisan](artisan)
    - [resources/views/app.blade.php](resources/views/app.blade.php)
    - [bootstrap/app.php](bootstrap/app.php)
    - [`useMissionForm`](resources/js/hooks/useMissionForm.ts)
    - [`MaterialViewer`](resources/js/components/mission/materialViewer.tsx)
    - [`MissionPageTitle`](resources/js/components/mission/ui/missionPageTitle.tsx)
    - [`NativeCppRunnerService`](app/Services/Mission/NativeCppRunnerService.php)
    - [config/inertia.php](config/inertia.php)

---

## Prerequisites

- PHP 8.2+ and required PHP extensions (pdo_pgsql, pdo_sqlite, etc.)
- Composer
- Node.js 18+ (or LTS) and npm
- Git
- Database (PostgreSQL / SQLite / MySQL)

---

## 1. Clone Repository

```sh
git clone https://github.com/rehaansekap/DliLearn.git
cd DliLearn
```

---

## 2. Backend (Laravel) Setup

1. Install dependensi PHP:
   ```sh
   composer install --no-interaction --prefer-dist
   ```

2. Salin environment file:
   ```sh
   cp .env.example .env
   ```

3. Generate application key:
   ```sh
   php artisan key:generate
   ```

4. Buat storage link:
   ```sh
   php artisan storage:link
   ```

5. Jalankan migrasi dan seeder database:
   ```sh
   php artisan migrate:fresh --seed --force
   ```

6. (Opsional) Jalankan pengujian:
   ```sh
   php artisan test
   ```

---

## 3. Frontend (Node / Vite / React) Setup

1. Install dependensi JavaScript:
   ```sh
   npm install
   ```

2. Development mode (Hot reload):
   ```sh
   npm run dev
   ```

3. Build untuk produksi:
   ```sh
   npm run build
   ```

---

## 4. Menjalankan Aplikasi Lokal

Opsi pengembangan lengkap (server + queue + vite):
```sh
npm run dev
# atau via composer:
composer run dev
```

Atau jalankan server PHP secara mandiri:
```sh
php artisan serve --host=127.0.0.1 --port=8000
```

---

## 5. Deployment & Otomatisasi (Vercel & Supabase)

- **Hosting Aplikasi**: Vercel Serverless PHP (`vercel.json` + `api/index.php`)
- **Database**: Supabase PostgreSQL
- **Otomatisasi Anti-Suspensi Supabase (Keep-Alive)**: `.github/workflows/keep-supabase-alive.yml` berjalan otomatis via cron setiap 3 hari untuk mem-ping API Supabase dan endpoint health check aplikasi, menjaga database tetap aktif tanpa terkena suspensi 7 hari.

---

## 6. Dokumentasi & Tangkapan Layar

- **Login**  
  ![Login Page](documentations/login.jpeg)

- **Student Dashboard**  
  ![Student Dashboard Page](documentations/dashboard-siswa.jpeg)

- **Creative Lab**  
  ![Creative Lab Page](documentations/creative-lab.jpeg)

- **Teacher Monitoring**  
  ![Teacher Monitoring Page](documentations/guru-monitoring.jpeg)
