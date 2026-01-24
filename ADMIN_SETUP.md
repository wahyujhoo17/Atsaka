# 🔐 Setup Admin Login

## Kredensial Default Admin

Setelah seeding, gunakan kredensial berikut untuk login:

```
Email: admin@atsaka.com
Password: admin123
```

⚠️ **PENTING**: Ganti password ini segera setelah login pertama!

## Setup Step-by-Step

### 1. Generate Prisma Client

```bash
npm run prisma:generate
```

### 2. Jalankan Migration (Buat Tabel)

```bash
npm run prisma:migrate
```

Atau manual:

```bash
npx prisma migrate dev --name add_admin_table
```

### 3. Jalankan Seeder (Buat Admin User)

```bash
npm run prisma:seed
```

### 4. Jalankan Backend Server

```bash
npm run server
```

### 5. Jalankan Frontend (Terminal Terpisah)

```bash
npm run dev
```

### 6. Akses Admin Login

Buka browser dan akses:

```
http://localhost:5173/admin-login
```

Login dengan kredensial di atas.

## API Endpoints Auth

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@atsaka.com",
  "password": "admin123"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Admin ATS",
    "email": "admin@atsaka.com",
    "role": "admin"
  }
}
```

### Verify Token

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Change Password

```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "admin123",
  "newPassword": "new_secure_password"
}
```

## Menambah Admin Baru (Manual via Prisma Studio)

```bash
npm run prisma:studio
```

Atau via script Node.js:

```javascript
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("password_baru", 10);

  const admin = await prisma.admin.create({
    data: {
      name: "Admin Baru",
      email: "admin2@atsaka.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin created:", admin);
}

createAdmin();
```

## Security Best Practices

### Production

1. **Ganti JWT_SECRET** di `.env`:

   ```bash
   # Generate random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Gunakan HTTPS** untuk production

3. **Set Token Expiry** sesuai kebutuhan (default: 7 hari)

4. **Implement Rate Limiting** untuk login endpoint

5. **Log Failed Login Attempts**

### Password Policy

- Minimum 6 karakter (bisa ditingkatkan)
- Gunakan password yang kuat
- Ganti password default segera setelah setup

## Troubleshooting

### Error: Table 'admins' doesn't exist

```bash
npm run prisma:migrate
```

### Error: Admin already exists

Seeder menggunakan `upsert`, jadi aman dijalankan multiple kali.

### Lupa Password Admin

Reset via Prisma Studio atau buat script reset:

```javascript
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function resetPassword() {
  const hashedPassword = await bcrypt.hash("new_password", 10);

  await prisma.admin.update({
    where: { email: "admin@atsaka.com" },
    data: { password: hashedPassword },
  });

  console.log("Password reset successfully");
}

resetPassword();
```

## Token Storage

Token disimpan di `localStorage` dengan key `auth_token`.

Untuk logout:

```javascript
localStorage.removeItem("auth_token");
```

Atau gunakan `api.logout()`.
