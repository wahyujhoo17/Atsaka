-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  features TEXT[], -- Array of features
  image_url TEXT,
  image_urls TEXT[], -- Array of image URLs
  specifications JSONB, -- JSON object for specifications
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read all products
CREATE POLICY "Allow authenticated users to read products" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to insert products
CREATE POLICY "Allow authenticated users to insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update products
CREATE POLICY "Allow authenticated users to update products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete products
CREATE POLICY "Allow authenticated users to delete products" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Enable Row Level Security (RLS) for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read all categories
CREATE POLICY "Allow authenticated users to read categories" ON categories
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to insert categories
CREATE POLICY "Allow authenticated users to insert categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update categories
CREATE POLICY "Allow authenticated users to update categories" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete categories
CREATE POLICY "Allow authenticated users to delete categories" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at for categories
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Pompa Pemadam', 'pump', 'Peralatan pompa untuk pemadam kebakaran'),
  ('Peralatan', 'equipment', 'Peralatan pendukung pemadam kebakaran'),
  ('Aksesoris', 'aksesori', 'Aksesoris dan sparepart')
ON CONFLICT (slug) DO NOTHING;

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for product images
CREATE POLICY "Allow authenticated users to upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated users to update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated users to delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Allow public to view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');