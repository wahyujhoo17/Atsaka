import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types";
import { ArrowRight, Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getCategoryLabel = (category: string) => {
    if (!category) return "Produk";
    
    // Ganti tanda hubung dengan spasi
    const withSpaces = category.replace(/-/g, ' ');
    
    // Kapitalisasi setiap kata
    return withSpaces
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryColor = (category: string) => {
    // Warna konsisten berdasarkan kategori
    const colorMap: Record<string, string> = {
      "pump": "bg-blue-600/90",
      "equipment": "bg-emerald-600/90",
      "aksesori": "bg-purple-600/90",
      "accessory": "bg-purple-600/90",
      "fire-extinguisher": "bg-red-600/90",
      "nozzle": "bg-amber-600/90",
      "hose": "bg-cyan-600/90",
      "valve": "bg-indigo-600/90",
      "tools": "bg-emerald-600/90",
      "safety": "bg-green-600/90"
    };
    
    const lowerCategory = category.toLowerCase();
    if (colorMap[lowerCategory]) {
      return colorMap[lowerCategory];
    }
    
    // Default color for unknown categories
    return "bg-gray-600/90";
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="product-card group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-600/30 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500" />

        {/* Category badge - smaller on mobile */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-white text-[10px] sm:text-xs font-bold tracking-wide shadow-lg backdrop-blur-md ${getCategoryColor(
              product.category
            )}`}
          >
            <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 hidden sm:inline" />
            {getCategoryLabel(product.category)}
          </span>
        </div>


        {/* Desktop: Hover overlay with action button */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/85 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 hidden sm:flex items-end">
          <div className="p-4 w-full">
            <div className="flex items-center justify-between text-white">
              <span className="text-sm font-medium">Lihat Detail</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Content - compact on mobile */}
      <div className="p-2.5 sm:p-5 flex-1 flex flex-col">
        <h3 className="text-xs sm:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-3 line-clamp-2 sm:line-clamp-3 group-hover:text-red-600 transition-colors duration-300 leading-snug sm:leading-tight flex-shrink-0">
          {product.name}
        </h3>

        {/* Description - hidden on mobile for compact look */}
        <p className="hidden sm:block text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed text-sm mb-4 flex-1">
          {product.description}
        </p>

        {/* Mobile: subtle category text */}
        <div className="sm:hidden mt-auto">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">
            Lihat Detail →
          </span>
        </div>

        {/* Desktop: Additional visual element */}
        <div className="hidden sm:block pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
              Produk Profesional
            </span>
            <div className="w-6 h-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
