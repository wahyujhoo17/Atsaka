import React, { useState } from "react";
import {
  Filter,
  X,
  Grid,
  Package,
  Wrench,
  Zap,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: Category[];
}

interface ProductFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  productCounts: Record<string, number>;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  productCounts,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pump":
        return <Zap className="w-4 h-4" />;
      case "equipment":
        return <Wrench className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
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

  const getCategoryCount = (category: string) => {
    return productCounts[category] || 0;
  };

  // Get total count for parent category (including all children)
  const getTotalCategoryCount = (parentCategory: Category) => {
    let total = productCounts[parentCategory.slug] || 0;

    if (parentCategory.children) {
      parentCategory.children.forEach((child) => {
        total += productCounts[child.slug] || 0;
      });
    }

    return total;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Filter className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Filter Produk
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Temukan produk sesuai kebutuhan
              </p>
            </div>
          </div>
          {selectedCategory && (
            <button
              onClick={() => onCategoryChange(null)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="p-5">
        <div className="space-y-2">
          {/* All Products */}
          <button
            onClick={() => onCategoryChange(null)}
            className={`w-full group flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
              selectedCategory === null
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-1.5 rounded-md ${
                  selectedCategory === null
                    ? "bg-white/20"
                    : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="font-semibold block text-sm">
                  Semua Produk
                </span>
                <span
                  className={`text-xs ${
                    selectedCategory === null
                      ? "text-white/80"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Tampilkan semua
                </span>
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedCategory === null
                  ? "border-white bg-white"
                  : "border-gray-300 dark:border-gray-500"
              }`}
            >
              {selectedCategory === null && (
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              )}
            </div>
          </button>

          {/* Category Options - Only show parent categories */}
          {categories
            .filter((cat) => !cat.parentId)
            .map((parentCategory) => (
              <div key={parentCategory.slug} className="space-y-1">
                {/* Parent Category */}
                <div className="flex items-stretch gap-1">
                  {/* Expand/Collapse Button */}
                  {parentCategory.children &&
                    parentCategory.children.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(parentCategory.slug);
                        }}
                        className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {expandedCategories.has(parentCategory.slug) ? (
                          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </button>
                    )}

                  {/* Category Button */}
                  <button
                    onClick={() => onCategoryChange(parentCategory.slug)}
                    className={`flex-1 group flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                      selectedCategory === parentCategory.slug
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                        : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-md ${
                          selectedCategory === parentCategory.slug
                            ? "bg-white/20"
                            : "bg-gray-200 dark:bg-gray-600"
                        }`}
                      >
                        {getCategoryIcon(parentCategory.slug)}
                      </div>
                      <div className="text-left">
                        <span className="font-semibold block text-sm">
                          {parentCategory.name}
                        </span>
                        <span
                          className={`text-xs ${
                            selectedCategory === parentCategory.slug
                              ? "text-white/80"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {getTotalCategoryCount(parentCategory)} produk
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedCategory === parentCategory.slug
                          ? "border-white bg-white"
                          : "border-gray-300 dark:border-gray-500"
                      }`}
                    >
                      {selectedCategory === parentCategory.slug && (
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                </div>

                {/* Sub Categories - Only show when parent is expanded */}
                {expandedCategories.has(parentCategory.slug) &&
                  parentCategory.children && (
                    <div className="ml-10 space-y-1">
                      {parentCategory.children.map((subCategory) => (
                        <button
                          key={subCategory.slug}
                          onClick={() => onCategoryChange(subCategory.slug)}
                          className={`w-full group flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                            selectedCategory === subCategory.slug
                              ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                              : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-1.5 rounded-md ${
                                selectedCategory === subCategory.slug
                                  ? "bg-white/20"
                                  : "bg-gray-200 dark:bg-gray-600"
                              }`}
                            >
                              {getCategoryIcon(subCategory.slug)}
                            </div>
                            <div className="text-left">
                              <span className="font-semibold block text-sm">
                                ↳ {subCategory.name}
                              </span>
                              <span
                                className={`text-xs ${
                                  selectedCategory === subCategory.slug
                                    ? "text-white/80"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {getCategoryCount(subCategory.slug)} produk
                              </span>
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selectedCategory === subCategory.slug
                                ? "border-white bg-white"
                                : "border-gray-300 dark:border-gray-500"
                            }`}
                          >
                            {selectedCategory === subCategory.slug && (
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
        </div>

        {/* Additional Info */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Perlu bantuan memilih produk?
            </p>
            <button className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors">
              Hubungi Konsultan Kami
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
