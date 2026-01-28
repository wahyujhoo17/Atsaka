# Admin Panel Guide

## Login

- URL: http://localhost:5173/admin-login
- Email: `admin@atsaka.com`
- Password: `admin123`
- ⚠️ **PENTING**: Ganti password setelah login pertama!

## Mengelola Produk

### Menambah Produk Baru

1. Klik tab "Products"
2. Klik tombol "Tambah Product"
3. Isi form dengan data produk:

#### Field yang Wajib:

- **Name**: Nama produk (otomatis generate slug)
- **Category**: Pilih kategori atau sub-kategori
- **Main Image URL**: URL gambar utama produk

#### Field Opsional:

**Additional Images** (Multiple):

- Masukkan URL gambar tambahan
- Tekan Enter atau klik tombol + untuk menambahkan
- Klik ❌ untuk menghapus gambar
- Bisa menambahkan banyak gambar

**Features** (Array):

- Masukkan fitur produk satu per satu
- Tekan Enter atau klik tombol + untuk menambahkan
- Klik ❌ untuk menghapus fitur
- Contoh: "Tahan api", "Desain ergonomis"

**Specifications** (Key-Value):

- Masukkan Key (contoh: "Model", "Engine type", "Volume")
- Masukkan Value (contoh: "Honda GX690", "4 stroke", "20 L")
- Tekan Enter atau klik tombol + untuk menambahkan
- Klik ❌ untuk menghapus spesifikasi
- Akan ditampilkan dalam format tabel

## Mengelola Kategori

### Struktur Hierarki

Kategori mendukung parent-child relationship:

- **Top Level Categories**: Kategori utama (tidak ada parent)
- **Sub Categories**: Kategori turunan (memiliki parent)

### Menambah Kategori

1. Klik tab "Categories"
2. Klik tombol "Tambah Category"
3. Isi data:
   - **Name**: Nama kategori
   - **Description**: Deskripsi kategori
   - **Parent Category**: Pilih parent jika ini sub-category (optional)

### Contoh Struktur:

```
Alat Pemadam Kebakaran (Parent)
  ↳ Pompa (Sub-category)

Alat Peraga Pendidikan (Parent)
  ↳ Peralatan Tangan (Sub-category)

Kimia Laboratorium (Parent)
  ↳ Aksesoris (Sub-category)
```

## Mengelola Gallery

1. Klik tab "Gallery"
2. Klik tombol "Tambah Gallery Item"
3. Isi data gambar/video gallery. Untuk kategori, Anda dapat memilih beberapa kategori dari dropdown atau mengetik kategori baru (tekan Enter untuk menambahkan).

## Tips

- Slug akan otomatis di-generate dari nama
- Semua URL gambar harus valid dan accessible
- Features dan Specifications akan tersimpan sebagai JSON di database
- Sub-category akan ditampilkan dengan indent "↳" di list

## Format Data di Database

### Product Schema:

```typescript
{
  name: string
  slug: string
  category: string (slug kategori)
  description: string
  features: string[] (array)
  imageUrl: string (gambar utama)
  imageUrls: string[] (gambar tambahan)
  specifications: object (key-value pairs)
}
```

### Contoh Specifications:

```json
{
  "Model": "Honda GX690",
  "Engine type": "4 stroke OHV",
  "Volume": "20 L",
  "Max Width": "625 mm",
  "Spray distance": "8 M"
}
```
