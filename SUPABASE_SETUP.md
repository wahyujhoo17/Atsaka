# Supabase Setup Instructions

## Features Overview

This admin system provides complete CRUD (Create, Read, Update, Delete) operations for:

### 🏷️ **Categories Management**

- **Create**: Add new product categories with name, description, and image
- **Read**: View all categories in a table format
- **Update**: Edit existing category details
- **Delete**: Remove categories with confirmation

### 📦 **Products Management**

- **Create**: Add new products with category selection from dropdown
- **Read**: View all products with category information
- **Update**: Edit product details including category assignment
- **Delete**: Remove products with confirmation

### � **Image Upload System**

- **Multiple Image Upload**: Upload multiple product images at once
- **Automatic Storage**: Images automatically saved to Supabase Storage
- **Image Preview**: Live preview of selected images before upload
- **Progress Tracking**: Upload progress indicator for large files
- **File Validation**: Automatic validation for file type and size
- **Main Image Selection**: First image automatically set as main product image
- **Supported Formats**: JPEG, PNG, WebP (max 5MB per file)

### �🔐 **Authentication**

- Secure admin login with Supabase Auth
- Protected routes for admin-only access
- Session management and logout functionality

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account or sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `atsaka-admin`
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users

## 2. Get Project Credentials

After your project is created:

1. Go to Settings → API
2. Copy the following values:
   - Project URL
   - Project API Key (anon public)

## 3. Configure Environment Variables

Update your `.env` file with the actual values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Setup Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase/schema.sql`
3. Click "Run" to execute the SQL

## 5. Setup Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Click "Create bucket"
3. Fill in the details:
   - Name: `product-images`
   - Make it public: Check this box
4. Click "Create bucket"

The storage policies are already included in the SQL schema and will be automatically created.

## 6. Create Admin User

1. Go to Authentication → Users in your Supabase dashboard
2. Click "Add user"
3. Fill in the details:
   - Email: `admin@atsaka.com` (or any email you prefer)
   - Password: `qwerty1234`
   - Auto confirm user: Check this box
4. Click "Add user"

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Go to `/admin/login` in your browser
3. Login with:
   - Email: `admin@atsaka.com`
   - Password: `qwerty1234`
4. You should be able to access the admin dashboard and manage products

## 6. Admin Dashboard Features

### Categories Tab

- **Add Category**: Click "Add Category" to create new product categories
- **Edit Category**: Click the edit icon to modify category details
- **Delete Category**: Click the delete icon to remove categories
- **View Categories**: See all categories in a table with name, slug, and description

### Products Tab

- **Add Product**: Click "Add Product" to create new products
- **Select Category**: Choose from available categories using dropdown
- **Edit Product**: Click the edit icon to modify product details
- **Delete Product**: Click the delete icon to remove products
- **View Products**: See all products with category information

### Navigation

- Switch between "Products" and "Categories" tabs using the top navigation
- Use "Logout" button to sign out from admin session

## 7. Migrate Existing Products (Optional)

If you want to migrate your existing products from `src/data/products.ts` to Supabase:

1. Go to your Supabase dashboard → Table Editor
2. Open the `products` table
3. Click "Insert" and add your existing products manually, or
4. Use the admin dashboard to add products through the UI

## Security Notes

- The anon key is safe to use in client-side code
- Row Level Security (RLS) is enabled on the products table
- Only authenticated users can perform CRUD operations
- Make sure to keep your service role key (if needed) secure and never expose it in client code

## Troubleshooting

- If you get authentication errors, make sure your environment variables are set correctly
- If products don't load, check that the database schema was created properly
- If login fails, verify the admin user was created with the correct email and password
