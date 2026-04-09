# 🧠 BeinBout Backend API

BeinBout adalah platform API backend yang dirancang untuk mendukung aplikasi pelacakan kesehatan mental, jurnal harian, dan analisis psikologis berbasis AI. Dibangun dengan fokus pada performa dan keamanan menggunakan Node.js, Express, dan Prisma ORM.

## ✨ Fitur Utama

- **🔐 Autentikasi**: Sistem registrasi dan login menggunakan JWT (JSON Web Tokens).
- **📝 Daily Journal**: Pencatatan jurnal harian yang mencakup metrik mood, intensitas, jam tidur, dan kualitas tidur.
- **📊 Dashboard Analytics**: Penyediaan data chart harian untuk memantau fluktuasi mood dan durasi tidur selama 7 hari terakhir.
- **👤 User Persona & Questionnaires**: Asesmen psikologis awal dan mingguan berbasis standar medis (PHQ-9, GAD-7, PSQI, dll).
- **🤖 AI Integration**: Analisis sentimen, deteksi anomali, dan refleksi AI pada setiap entri jurnal (Via External AI Service).
- **📚 API Documentation**: Dokumentasi interaktif menggunakan Swagger UI.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL (Supabase)](https://supabase.com/)
- **Caching/Session**: [Redis](https://redis.io/)
- **Deployment**: [Vercel](https://vercel.com/) (Serverless Functions)

---

## 🚀 Cara Menjalankan Proyek (Local Development)

### 1. Prasyarat
Pastikan kamu sudah menginstal perangkat lunak berikut di komputermu:
- Node.js (v16 atau lebih baru)
- npm atau yarn
- Git

### 2. Instalasi
Clone repositori ini dan instal semua dependensi:

```bash
git clone [https://github.com/USERNAME_KAMU/beinbout-backend.git](https://github.com/USERNAME_KAMU/beinbout-backend.git)
cd beinbout-backend
npm install
```

### 3. Konfigurasi Environment Variables
Buat file .env di root directory proyek. Copy format di bawah ini dan isi nilainya sesuai dengan kredensial database dan layanan pihak ketiga (merujuk pada konfigurasi Vercel):

```env
PORT=3000
API_VERSION=/api/v1
JWT_SECRET=your_secret_jwt_in_here

# Database (Supabase / PostgreSQL)
DIRECT_URL=postgresql://postgres.xxx:password@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres

# Redis
REDIS_URL=rediss://default:password@host:port

# AI Service
AI_SERVICE_URL=your_url_ai_service
AI_SERVICE_CREDS=your_secret_ai_service_token
```

### 4. Setup Database (Prisma)
Proyek ini menggunakan metode `db push` untuk sinkronisasi skema karena lebih aman untuk data prototyping saat ini. Jalankan perintah berikut untuk memastikan tabel database sudah siap:

```bash
npx prisma generate
npx prisma db push
```

> [!WARNING]
> Hindari menggunakan `npx prisma migrate dev` jika database sudah berisi data berharga tanpa melakukan backup terlebih dahulu untuk menghindari Drift Detected yang mereset tabel.

### 5. Jalankan Server
Mulai server untuk proses development:

```bash
npm run dev
# atau
node index.js
```

Server akan berjalan di `http://localhost:3000`

---

## 📖 Dokumentasi API
Proyek ini dilengkapi dengan Swagger UI untuk memudahkan testing dan integrasi dengan Frontend.
Setelah server berjalan, buka URL berikut di browser kamu:

👉 `http://localhost:3000/api-docs` (Sesuaikan dengan rute Swagger kamu)

---

## 🏗️ Struktur Folder Utama

```
beinbout/
├── prisma/               # Skema database Prisma (schema.prisma)
├── src/
│   ├── config/           # Konfigurasi Database (db.js), Redis, dll
│   ├── controllers/      # Logika bisnis (dashboard, journal, auth)
│   ├── middleware/       # Autentikasi JWT, validasi request
│   ├── routes/           # Definisi endpoint API
│   └── index.js          # Entry point aplikasi
├── .env                  # Variabel environment (jangan di-commit!)
├── package.json          # Dependensi dan script project
└── vercel.json           # Konfigurasi deployment serverless Vercel
```

---

## 💡 Catatan Tambahan (Developer Notes)
- **BigInt Serialization:** Proyek ini sudah diatur untuk meng-handle masalah serialisasi `BigInt` dari PostgreSQL ke JSON agar kompatibel dengan Express `res.json()`.
- **Timezone Handling:** Semua pengiriman tanggal via API (seperti fitur jurnal) telah dinormalisasi menggunakan **UTC** (`setUTCHours`) untuk mencegah bug zona waktu saat di-deploy ke Vercel.

---

### Dibuat oleh team Back-end BeinBout.
