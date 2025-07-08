import React, { useState } from 'react';
import GalleryGrid from '../components/gallery/GalleryGrid';
import { galleryItems } from '../data/gallery';

const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Extract unique categories from gallery items
  const categories = Array.from(new Set(galleryItems.map(item => item.category)));
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Gallery
          </h1>
          <div className="w-16 h-1 bg-red-500 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            Explore our collection of images showcasing ATSAKA equipment in action, 
            training programs, and field operations.
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