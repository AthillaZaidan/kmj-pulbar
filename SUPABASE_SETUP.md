# Supabase PostgreSQL Integration - Setup Guide

## 📋 Overview
Aplikasi KMJ Pulang Bareng telah diintegrasikan dengan Supabase PostgreSQL untuk mengelola data pengguna berdasarkan akun Google mereka.

## 🔧 Setup Steps

### 1. Create Supabase Project
1. Buka [Supabase](https://supabase.com)
2. Klik "New Project"
3. Isi detail project:
   - Project name: `kmj-pulbar`
   - Database password: (generate strong password)
   - Region: Southeast Asia (Singapore)
4. Tunggu project selesai dibuat (~2 menit)

### 2. Run Database Schema
1. Di Supabase Dashboard, buka **SQL Editor**
2. Copy semua isi dari file `supabase/schema.sql`
3. Paste ke SQL Editor dan klik "Run"
4. Verifikasi bahwa 3 tabel telah dibuat:
   - `users`
   - `travel_dates`
   - `participants`

### 3. Get API Credentials
1. Di Supabase Dashboard, buka **Settings → API**
2. Copy nilai berikut:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Update Environment Variables
Update file `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 6. Restart Development Server
```bash
npm run dev
```

## 📊 Database Schema

### Users Table
Menyimpan data pengguna yang login via Google OAuth:
- `id` (TEXT): Google user ID
- `email` (TEXT): Email dari Google account
- `name` (TEXT): Nama lengkap
- `image` (TEXT): URL foto profil Google
- `role` (TEXT): 'user' atau 'admin'
- `created_at`, `updated_at`: Timestamps

### Travel Dates Table
Menyimpan tanggal keberangkatan yang tersedia:
- `id` (UUID): Primary key
- `date` (DATE): Tanggal keberangkatan
- `capacity` (INTEGER): Kapasitas peserta (default: 50)
- `is_available` (BOOLEAN): Status ketersediaan
- `created_at`, `updated_at`: Timestamps

### Participants Table
Menyimpan pendaftaran peserta per tanggal:
- `id` (UUID): Primary key
- `travel_date_id` (UUID): Foreign key ke travel_dates
- `user_id` (TEXT): Foreign key ke users (Google ID)
- `name` (TEXT): Nama peserta
- `phone` (TEXT): Nomor telepon
- `flight` (TEXT): Nama maskapai
- `pickup_location` (TEXT): Lokasi penjemputan
- `notes` (TEXT): Catatan tambahan
- `created_at`, `updated_at`: Timestamps

**Constraint**: Satu user hanya bisa daftar 1x per tanggal (UNIQUE: travel_date_id + user_id)

## 🔒 Row Level Security (RLS)

### Users Table
- ✅ Semua user bisa view all users
- ✅ User hanya bisa update data mereka sendiri

### Travel Dates Table
- ✅ Semua user bisa view travel dates
- ⚠️ Hanya admin yang bisa create/update/delete

### Participants Table
- ✅ Semua user bisa view participants
- ✅ User bisa create/update/delete registrasi mereka sendiri
- ⚠️ Admin bisa manage semua participants

## 🔌 API Endpoints

### Travel Dates
- `GET /api/travel-dates` - Get all travel dates with participants
- `GET /api/travel-dates?date=2025-12-20` - Get specific date
- `POST /api/travel-dates` - Create new date (admin only)
- `PATCH /api/travel-dates` - Update capacity/availability (admin only)

### Participants
- `GET /api/participants` - Get all participants
- `GET /api/participants?userId={id}` - Get user's registrations
- `GET /api/participants?travelDateId={id}` - Get participants for specific date
- `POST /api/participants` - Register for travel date
- `PATCH /api/participants` - Update registration
- `DELETE /api/participants?id={id}` - Cancel registration

## 🎯 Key Features

### User Authentication
- ✅ Auto-create user record saat login pertama via Google
- ✅ Update user info (nama, foto) setiap login
- ✅ Role assignment (admin@gmail.com → admin, others → user)

### Data Isolation
- ✅ Setiap user punya data registrasi sendiri
- ✅ User tidak bisa edit/delete registrasi user lain
- ✅ Admin punya full access ke semua data

### Real-time Sync
- ✅ Data otomatis refresh setelah create/update/delete
- ✅ Tidak ada lagi localStorage, semua di database
- ✅ Multi-device sync via database

### Capacity Management
- ✅ Auto-update `is_available` saat capacity penuh
- ✅ Prevent double registration per user per date
- ✅ Restore availability saat ada yang cancel

## 🧪 Testing Checklist

1. **Authentication**
   - [ ] Login dengan Google account
   - [ ] User record ter-create di Supabase
   - [ ] Role correct (admin vs user)

2. **Registration**
   - [ ] Daftar untuk travel date
   - [ ] Data tersimpan dengan user_id yang benar
   - [ ] Tidak bisa daftar 2x untuk tanggal yang sama

3. **Data Isolation**
   - [ ] Login dengan 2 akun berbeda
   - [ ] Setiap user hanya lihat registrasi mereka di "My Registrations"
   - [ ] User A tidak bisa edit/delete registrasi User B

4. **Admin Functions**
   - [ ] Login sebagai admin@gmail.com
   - [ ] Bisa create travel dates
   - [ ] Bisa update capacity
   - [ ] Bisa manage semua participants

5. **Capacity Management**
   - [ ] Set capacity ke 2, daftar 2 orang
   - [ ] Status berubah jadi "Penuh"
   - [ ] Cancel 1 orang, status kembali "Tersedia"

## 🐛 Troubleshooting

### Error: "Failed to fetch travel dates"
- Cek apakah Supabase URL & Anon Key sudah benar di `.env.local`
- Restart dev server setelah update env variables
- Cek Supabase Dashboard → API Logs untuk error details

### Error: "User not found"
- Pastikan schema sudah di-run (check Table Editor di Supabase)
- Cek RLS policies sudah enabled
- Re-login untuk trigger user creation

### Error: "Forbidden"
- Cek role user di `users` table
- Admin email harus exact: `admin@gmail.com`
- Re-login setelah update role manually

### Data tidak sync antar tab/device
- Refresh page untuk fetch data terbaru
- Cek network tab untuk API errors
- Verifikasi session token masih valid

## 📁 File Changes Summary

### New Files
- `lib/supabase.ts` - Supabase client & TypeScript types
- `supabase/schema.sql` - Database schema & RLS policies
- `app/api/travel-dates/route.ts` - Travel dates API endpoints
- `app/api/participants/route.ts` - Participants API endpoints
- `SUPABASE_SETUP.md` - This guide

### Modified Files
- `lib/travel-context.tsx` - Replaced localStorage with API calls
- `app/api/auth/[...nextauth]/route.ts` - Added Supabase user sync
- `types/next-auth.d.ts` - Added role to session type
- `.env.local` - Added Supabase credentials

## 🚀 Next Steps

1. Setup Supabase project & run schema
2. Update `.env.local` with real credentials
3. Install dependencies: `npm install @supabase/supabase-js @supabase/ssr`
4. Restart dev server
5. Test login & registration flow
6. Verify data in Supabase Table Editor
