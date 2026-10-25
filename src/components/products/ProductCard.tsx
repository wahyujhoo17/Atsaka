import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types";
import { ArrowRight, Package } from "lucide-react";
import { highlightedSpecs } from "../../lib/specGroups";

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, categoryName }) => {
  const image = product.imageUrl || product.imageUrls?.[0];
  const highlights = highlightedSpecs(product.specifications).slice(0, 3);

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/60 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image: contained on a soft backdrop so transparent product cut-outs look their best */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain p-4 md:p-6 drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300 dark:text-gray-700" strokeWidth={1.25} />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col p-3.5 md:p-5">
        {categoryName && (
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
            {categoryName}
          </span>
        )}
        <h3 className="mt-1 text-sm md:text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        {product.subtitle && (
          <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {product.subtitle}
          </p>
        )}

        {/* Starred technical specs, otherwise a short description.
            Pinned to the bottom with a fixed height, so they line up across a row whatever the title length. */}
        <div className="mt-auto pt-4 hidden sm:block h-[4.25rem] box-content">
          {highlights.length > 0 ? (
            <dl className="h-full grid grid-cols-3 gap-2 items-center rounded-xl bg-gray-50 dark:bg-gray-800/60 px-2.5">
              {highlights.map((spec) => (
                <div key={spec.label} className="min-w-0 text-center">
                  <dt className="text-[10px] uppercase tracking-wide text-gray-400 truncate">{spec.label}</dt>
                  <dd className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white truncate">{spec.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            product.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            )
          )}
        </div>

        <div className="mt-auto sm:mt-0 pt-3 md:pt-4">
          <div className="flex justify-end border-t border-gray-100 dark:border-gray-800 pt-3 md:pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
              Lihat Detail
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
