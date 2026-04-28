# Jaya Motospart

Website e-commerce sparepart motor menggunakan Node.js, EJS, dan direct PostgreSQL (Supabase host).

## Stack
- Express.js
- EJS
- PostgreSQL (`pg`) direct connection
- Session auth (`express-session`)
- Upload bukti transfer (`multer`)
- Hash password (`bcryptjs`)

## Setup
1. Copy `.env.example` menjadi `.env` lalu isi `DATABASE_URL`.
2. Jalankan migration SQL di Supabase SQL Editor atau `supabase db push`.
3. Install dependency:
   - `npm install`
4. Run:
   - `npm run dev`
5. Buka:
   - `http://localhost:3001/login`

## Akun
- Admin:
  - `admin@jaya.com`
  - `admin123`
- Customer:
  - Register langsung dari halaman `/register`
