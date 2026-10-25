import { SpecificationsData } from "../lib/specGroups";
import { ProductDetails } from "../lib/productDetails";

export interface Product {
  id: string;
  name: string;
  slug: string; // Tambahkan ini
  category: string;
  description: string;
  features: string[];
  imageUrl: string;
  imageUrls: string[];
  specifications: SpecificationsData;
  subtitle?: string | null;
  details?: ProductDetails | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  children?: Category[];
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  type: "image" | "video";
  url?: string; // For video links
  imageUrl?: string; // For uploaded photos
  categories: string[];
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
