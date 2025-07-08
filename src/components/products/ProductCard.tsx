import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Function to generate hypothetical image URLs for different sizes
  // In a real application, these URLs would likely come from your backend or CDN
  const getSrcSet = (baseUrl: string) => {
    // Example: Assuming your image service supports width parameters like ?w=
    // Adjust this logic based on how your actual image URLs are structured
    const sizes = [400, 800, 1200]; // Example widths
    return sizes
      .map((size) => `${baseUrl}?w=${size} ${size}w`) // Append width parameter and specify width descriptor
      .join(", ");
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <div className="h-64 overflow-hidden relative">
        <img
          // Provide multiple image sources for different resolutions
          srcSet={getSrcSet(product.imageUrl)}
          // Define image sizes relative to the viewport for optimal loading
          // Adjust these values based on your actual card layout breakpoints
          // e.g., "100vw" below 640px, "50vw" between 640px and 1024px, "33vw" above 1024px
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          // Fallback src for browsers that don't support srcset
          src={product.imageUrl} // Preferably a medium-sized default
          alt={product.name}
          // Defer loading of off-screen images
          loading="lazy"
          // Ensure image scales correctly within its container
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          // Optional: Specify intrinsic dimensions if known, helps browser layout
          // width={/* intrinsic width */}
          // height={/* intrinsic height */}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <span className="inline-block bg-red-500 text-white text-xs uppercase tracking-wider px-2 py-1 rounded mb-2">
              {product.category === "pump"
                ? "Fire Pump"
                : product.category === "equipment"
                ? "Equipment"
                : "Accessory"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate group-hover:text-red-600">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {product.description}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
