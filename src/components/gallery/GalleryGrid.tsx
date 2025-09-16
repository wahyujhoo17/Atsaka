import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import { GalleryItem } from "../../types";
import { X, PlayCircle, Image as ImageIcon } from "lucide-react";

// Component to handle image loading state and display placeholder
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string; // Allow passing additional classes
}> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative w-full h-full bg-gray-300 dark:bg-gray-600 ${className}`}
    >
      {/* Placeholder with pulse animation */}
      {!isLoaded && <div className="absolute inset-0 animate-pulse"></div>}
      <img
        src={src}
        alt={alt}
        // Apply base styles and transition for opacity
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0" // Fade in when loaded
        }`}
        loading="lazy" // Keep native lazy loading
        decoding="async" // Keep async decoding hint
        onLoad={() => setIsLoaded(true)} // Set loaded state to true when image finishes loading
        // Optional: Add error handling
        // onError={(e) => { e.currentTarget.style.display = 'none'; /* Hide broken image */ }}
      />
    </div>
  );
};

interface GalleryGridProps {
  items: GalleryItem[];
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  items,
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Preload modal content slightly before opening for smoother transition
  useEffect(() => {
    if (selectedItem) {
      setIsModalOpen(true);
      document.body.style.overflow = "hidden";
    } else {
      // Delay closing animation/cleanup slightly if needed, or close immediately
      setIsModalOpen(false);
      document.body.style.overflow = "auto";
    }
  }, [selectedItem]);

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  const openModal = (item: GalleryItem) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            selectedCategory === null
              ? "bg-red-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedCategory === category
                ? "bg-red-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {category === "field"
              ? "Field Operations"
              : category === "product"
              ? "Product Showcase"
              : "Training"}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow bg-gray-200 dark:bg-gray-700" // Keep card background
            onClick={() => openModal(item)}
          >
            {/* Use aspect-video to reserve space and prevent layout shifts */}
            <div className="relative aspect-video overflow-hidden">
              {item.type === "video" ? (
                <div className="absolute inset-0 w-full h-full">
                  {/* ReactPlayer with light=true loads only thumbnail initially */}
                  <ReactPlayer
                    url={item.url}
                    width="100%"
                    height="100%"
                    light={true} // Crucial for performance: loads thumbnail first
                    playing={false} // Ensure preview doesn't autoplay
                    controls={false} // Hide controls in preview
                    className="absolute top-0 left-0"
                    // Optional: Add a placeholder background while thumbnail loads
                    style={{ backgroundColor: "#000" }} // Keep black bg for video player
                  />
                  {/* Overlay shown on hover */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Use LazyImage component for better perceived performance */}
                  <LazyImage
                    src={item.imageUrl || ""}
                    alt={item.title}
                    // Apply hover effect to the LazyImage container
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay shown on hover */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <ImageIcon className="w-12 h-12 text-white" />
                  </div>
                </>
              )}
              {/* Title overlay shown on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <h3 className="text-white font-semibold text-sm truncate">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in" // Added simple fade-in animation
          onClick={closeModal}
          style={{ animationDuration: "150ms" }} // Adjust duration as needed
        >
          <div
            className="relative max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Ensure container reserves space while content loads */}
            <div className="w-full aspect-video bg-black flex items-center justify-center">
              {selectedItem.type === "video" ? (
                <ReactPlayer
                  url={selectedItem.url}
                  playing={true} // Autoplay video in modal
                  controls={true} // Show controls in modal
                  width="100%"
                  height="100%"
                  // Optional: configure player further if needed
                  // config={{ youtube: { playerVars: { showinfo: 1 } } }}
                />
              ) : (
                // Use LazyImage in modal too for consistency, though less critical
                <LazyImage
                  src={selectedItem.imageUrl || ""}
                  alt={selectedItem.title}
                  className="max-w-full max-h-[80vh] object-contain" // Keep modal specific styles
                />
              )}
            </div>
            <div className="p-4 md:p-6 flex-shrink-0">
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                {selectedItem.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                {selectedItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Add CSS for fade-in animation if not using Tailwind animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn ease-out;
        }
        /* Ensure pulse animation is defined if not using Tailwind */
        /* @keyframes pulse { 50% { opacity: .5; } } */
        /* .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; } */
      `}</style>
    </div>
  );
};

export default GalleryGrid;
