import React from "react";
import { Filter } from "lucide-react";

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
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Filter
        </h3>
        <button
          onClick={() => onCategoryChange(null)}
          className="text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          Hapus Semua
        </button>
      </div>

      <div>
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
          <h4 className="font-medium text-gray-700 dark:text-gray-300">
            Kategori Produk
          </h4>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === null
                ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Semua Produk
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedCategory === category
                  ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {category === "pump"
                ? "Pompa Pemadam"
                : category === "equipment"
                ? "Peralatan"
                : "Aksesoris"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
