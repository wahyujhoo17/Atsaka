import React, { useState, useEffect } from "react";
import GalleryGrid from "../components/gallery/GalleryGrid";
import { api } from "../lib/api";
import { GalleryItem } from "../types";

const GalleryPage: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const data = await api.getGallery();

      // Transform data to match GalleryItem interface (support both old `category` and new `categories`)
      const transformedItems: GalleryItem[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        url: item.url,
        imageUrl: item.imageUrl,
        categories: item.categories
          ? (item.categories || []).map((c: string) => c.toLowerCase())
          : item.category
            ? [String(item.category).toLowerCase()]
            : [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      setGalleryItems(transformedItems);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(transformedItems.flatMap((item) => item.categories || [])),
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      setError("Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading gallery...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchGalleryItems}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Gallery
          </h1>
          <div className="w-16 h-1 bg-red-500 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            Explore our collection of images showcasing ATSAKA equipment in
            action, training programs, and field operations.
          </p>
        </div>

        <GalleryGrid
          items={galleryItems}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
    </div>
  );
};

export default GalleryPage;
