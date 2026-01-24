# Migrasi dari Supabase ke PostgreSQL + Prisma

Proyek ini telah dimigrasikan dari Supabase ke PostgreSQL dengan Prisma ORM dan Express backend.

## Setup PostgreSQL di VPS

### 1. Install PostgreSQL di VPS

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Buat Database dan User

```bash
# Login sebagai postgres user
sudo -u postgres psql

# Buat database
CREATE DATABASE atsaka_db;

# Buat user
CREATE USER atsaka_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE atsaka_db TO atsaka_user;

# Exit
\q
```

### 3. Konfigurasi PostgreSQL untuk Remote Access (Jika diperlukan)

Edit file `/etc/postgresql/[version]/main/postgresql.conf`:

```
listen_addresses = 'localhost'  # atau '*' untuk semua IP
```

Edit file `/etc/postgresql/[version]/main/pg_hba.conf`:

```
# Tambahkan baris ini:
host    atsaka_db    atsaka_user    127.0.0.1/32    md5
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

## Setup Aplikasi di VPS

### 1. Clone Repository dan Install Dependencies

```bash
cd /path/to/your/app
git pull
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di root project:

```bash
# Database Configuration
DATABASE_URL="postgresql://atsaka_user:your_secure_password@localhost:5432/atsaka_db"

# API Configuration
VITE_API_URL="http://your-vps-ip:5000/api"
PORT=5000
```

**Untuk production di VPS, ubah VITE_API_URL:**

```bash
# Jika menggunakan domain
VITE_API_URL="https://yourdomain.com/api"

# Jika menggunakan IP
VITE_API_URL="http://your-vps-ip:5000/api"
```

### 3. Migrasi Data dari Supabase (Opsional)

Jika Anda ingin memindahkan data dari Supabase ke PostgreSQL lokal:

```bash
# Export data dari Supabase menggunakan pg_dump
# Atau export manual melalui Supabase Dashboard

# Import ke database PostgreSQL lokal
psql -U atsaka_user -d atsaka_db -f backup.sql
```

### 4. Generate Prisma Client dan Migrate

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Atau manual:
npx prisma migrate deploy
```

### 5. Seed Database (Opsional)

Jika perlu data awal, buat file `prisma/seed.ts` atau jalankan SQL:

```bash
psql -U atsaka_user -d atsaka_db < supabase/schema.sql
```

### 6. Build Frontend

```bash
npm run build
```

### 7. Jalankan Backend Server

```bash
# Development
npm run server

# Production (gunakan PM2)
npm install -g pm2
pm2 start npm --name "atsaka-backend" -- run server:prod
pm2 save
pm2 startup
```

### 8. Setup Nginx sebagai Reverse Proxy

Buat file konfigurasi Nginx `/etc/nginx/sites-available/atsaka`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;  # atau IP VPS

    # Serve static frontend files
    root /path/to/your/app/dist;
    index index.html;

    # Frontend (React)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable dan restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/atsaka /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. Setup SSL dengan Let's Encrypt (Opsional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Struktur Baru Aplikasi

```
├── server/              # Express Backend API
│   ├── index.ts        # Main server file
│   └── tsconfig.json   # TypeScript config for server
├── prisma/             # Prisma ORM
│   └── schema.prisma   # Database schema
├── src/
│   └── lib/
│       └── api.ts      # Frontend API client
└── .env                # Environment variables
```

## Scripts yang Tersedia

```bash
# Frontend Development
npm run dev              # Run Vite dev server

# Backend Development
npm run server           # Run Express server with hot reload

# Production
npm run server:prod      # Run Express server (production)

# Prisma
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio (GUI)

# Build
npm run build            # Build frontend for production
```

## Monitoring dan Logs

```bash
# Melihat logs PM2
pm2 logs atsaka-backend

# Monitoring
pm2 monit

# Restart server
pm2 restart atsaka-backend
```

## Troubleshooting

### Backend tidak bisa connect ke database

1. Cek DATABASE_URL di `.env`
2. Pastikan PostgreSQL running: `sudo systemctl status postgresql`
3. Test koneksi: `psql -U atsaka_user -d atsaka_db -h localhost`

### Frontend tidak bisa fetch data

1. Cek VITE_API_URL di `.env`
2. Pastikan backend running: `pm2 status`
3. Cek CORS di `server/index.ts`
4. Rebuild frontend: `npm run build`

### Port sudah digunakan

```bash
# Cari process yang menggunakan port 5000
lsof -i :5000
# Kill process
kill -9 [PID]
```
