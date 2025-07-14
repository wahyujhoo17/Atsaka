import React from "react";
import { Filter, X, Grid, Package, Wrench, Zap } from "lucide-react";

interface ProductFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
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
    // You can implement actual counting logic here if needed
    // For now, returning placeholder counts
    switch (category) {
      case "pump":
        return 8;
      case "equipment":
        return 12;
      default:
        return 6;
    }
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

          {/* Category Options */}
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full group flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                  : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-md ${
                    selectedCategory === category
                      ? "bg-white/20"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  {getCategoryIcon(category)}
                </div>
                <div className="text-left">
                  <span className="font-semibold block text-sm">
                    {getCategoryLabel(category)}
                  </span>
                  <span
                    className={`text-xs ${
                      selectedCategory === category
                        ? "text-white/80"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {getCategoryCount(category)} produk
                  </span>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedCategory === category
                    ? "border-white bg-white"
                    : "border-gray-300 dark:border-gray-500"
                }`}
              >
                {selectedCategory === category && (
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                )}
              </div>
            </button>
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
