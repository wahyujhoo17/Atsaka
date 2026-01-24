# Deployment Guide - Atsaka Website

## 🚀 Production Deployment

### Setup Environment Variables

Buat file `.env` di root project dengan:

```env
# Database
DATABASE_URL="postgresql://USER@HOST:5432/DATABASE_NAME"

# Server
PORT=3001
NODE_ENV=production

# JWT Secret (GANTI dengan random string yang kuat!)
JWT_SECRET="your-very-secure-random-secret-key-here"

# Frontend URL (untuk CORS)
FRONTEND_URL="https://yourdomain.com"

# Vite (untuk build frontend)
VITE_API_URL="/api"
```

⚠️ **PENTING**:

- Ganti `JWT_SECRET` dengan string random yang kuat (minimal 32 karakter)
- Set `VITE_API_URL="/api"` untuk production (relative path)

---

## 📦 Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:prod

# Seed database (optional - untuk data awal)
npm run prisma:seed
```

### 3. Build & Start

```bash
# Build frontend + start server (all-in-one)
npm start
```

**ATAU** manual step-by-step:

```bash
# Build frontend
npm run build

# Start production server
npm run server:prod
```

### 4. Verify

Server akan running di port yang di-set di `.env` (default: 3001)

- Frontend: `http://localhost:3001`
- API: `http://localhost:3001/api/*`

---

## 🔧 Development Mode

```bash
# Terminal 1 - Frontend (Vite dev server)
npm run dev

# Terminal 2 - Backend (Nodemon auto-reload)
npm run server
```

---

## 🌐 VPS Deployment

### Option 1: Manual dengan PM2 (Recommended)

1. **Install PM2**

```bash
npm install -g pm2
```

2. **Build & Start dengan PM2**

```bash
# Build frontend
npm run build

# Start dengan PM2
pm2 start npm --name "atsaka-server" -- run server:prod

# Auto-start on reboot
pm2 startup
pm2 save
```

3. **PM2 Commands**

```bash
# Lihat status
pm2 status

# Lihat logs
pm2 logs atsaka-server

# Restart
pm2 restart atsaka-server

# Stop
pm2 stop atsaka-server
```

### Option 2: Systemd Service

1. Buat file `/etc/systemd/system/atsaka.service`:

```ini
[Unit]
Description=Atsaka Website
After=network.target postgresql.service

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/Atsaka
ExecStart=/usr/bin/npm run server:prod
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

2. **Enable & Start**

```bash
sudo systemctl enable atsaka
sudo systemctl start atsaka
sudo systemctl status atsaka
```

### Option 3: Docker (Advanced)

Buat `Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

# Build frontend
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "server:prod"]
```

Build & Run:

```bash
docker build -t atsaka-website .
docker run -p 3001:3001 --env-file .env atsaka-website
```

---

## 🔒 Security Checklist

- [ ] Ganti `JWT_SECRET` dengan string random yang kuat
- [ ] Set proper `FRONTEND_URL` untuk CORS
- [ ] Gunakan HTTPS di production (reverse proxy dengan Nginx/Caddy)
- [ ] Set database password yang kuat
- [ ] Ganti password admin default setelah deploy
- [ ] Enable firewall (hanya buka port yang diperlukan)
- [ ] Regular backup database

---

## 🌍 Nginx Reverse Proxy (Optional)

Untuk setup domain dengan HTTPS:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Kemudian:

```bash
# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

---

## 📊 Monitoring & Logs

### PM2 Monitoring

```bash
# Live monitoring
pm2 monit

# View logs
pm2 logs atsaka-server --lines 100

# Flush logs
pm2 flush
```

### Manual Logs

```bash
# Check server logs (jika menggunakan systemd)
journalctl -u atsaka -f

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-16-main.log
```

---

## 🔄 Update & Maintenance

### Update Code

```bash
# Pull latest code
git pull origin main

# Install new dependencies (if any)
npm install

# Run migrations (if any)
npm run prisma:migrate:prod

# Rebuild frontend
npm run build

# Restart server
pm2 restart atsaka-server
# OR
sudo systemctl restart atsaka
```

### Database Backup

```bash
# Backup database
pg_dump -U username -d atsaka_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U username -d atsaka_db < backup_20260124.sql
```

---

## 🆘 Troubleshooting

### Server tidak start

```bash
# Check logs
pm2 logs atsaka-server

# Check port
sudo lsof -i :3001

# Check database connection
psql -U username -d atsaka_db -c "SELECT 1"
```

### Frontend tidak load

- Pastikan `npm run build` sudah dijalankan
- Check folder `dist/` sudah ada dan berisi file
- Check console browser untuk error

### API Error 500

- Check database connection di `.env`
- Run `npm run prisma:generate` ulang
- Check logs untuk detail error

### Database Migration Error

```bash
# Reset migrations (HATI-HATI: akan hapus data!)
npx prisma migrate reset

# OR manual fix
npx prisma db push
```

---

## 📞 Support

Jika ada masalah deployment, hubungi tim development atau check:

- Backend logs: `pm2 logs atsaka-server`
- Database status: `sudo systemctl status postgresql`
- Nginx logs: `sudo tail -f /var/log/nginx/error.log`
