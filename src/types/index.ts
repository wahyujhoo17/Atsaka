export interface Product {
  id: string;
  name: string;
  slug: string; // Tambahkan ini
  category: string;
  description: string;
  features: string[];
  imageUrl: string;
  imageUrls: string[];
  specifications: { [key: string]: string };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  type: "photo" | "video";
  url?: string; // For video links
  imageUrl?: string; // For uploaded photos
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  imageUrl?: string;
}
