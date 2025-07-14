import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types";
import { ArrowRight, Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getSrcSet = (baseUrl: string) => {
    const sizes = [400, 800, 1200];
    return sizes.map((size) => `${baseUrl}?w=${size} ${size}w`).join(", ");
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "pump":
        return "Pompa Pemadam";
      case "equipment":
        return "Peralatan";
      default:
        return "Aksesoris";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "pump":
        return "bg-blue-600/95 border border-blue-400/50";
      case "equipment":
        return "bg-emerald-600/95 border border-emerald-400/50";
      default:
        return "bg-purple-600/95 border border-purple-400/50";
    }
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-600/30 transform hover:-translate-y-1 hover:scale-[1.02] h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          srcSet={getSrcSet(product.imageUrl)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-white text-xs font-bold tracking-wide shadow-lg backdrop-blur-md ${getCategoryColor(
              product.category
            )}`}
          >
            <Tag className="w-3 h-3" />
            {getCategoryLabel(product.category)}
          </span>
        </div>

        {/* Hover overlay with action button */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/85 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
          <div className="p-4 w-full">
            <div className="flex items-center justify-between text-white">
              <span className="text-sm font-medium">Lihat Detail</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-300 leading-tight min-h-[3.5rem]">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed text-sm mb-4 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Additional visual element */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
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
