import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import ProductFilter from "../components/products/ProductFilter";
import ProductCard from "../components/products/ProductCard";
import { products } from "../data/products";
import { ChevronUp } from "lucide-react";

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );

  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [selectedCategory, setSearchParams]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24 pb-16 md:pt-28 md:pb-24">
      {" "}
      {/* Adjusted padding for mobile */}
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12 md:mb-16 text-center">
          {" "}
          {/* Adjusted bottom margin for mobile */}
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-4 text-gray-900 dark:text-white tracking-tight">
            {" "}
            {/* Adjusted text size for mobile */}
            Produk Kami
          </h1>
          <div className="w-16 md:w-20 h-1 md:h-1.5 bg-red-600 mx-auto mb-6 md:mb-8 rounded-full"></div>{" "}
          {/* Adjusted divider size/margin for mobile */}
          <p className="max-w-3xl mx-auto text-base md:text-xl leading-relaxed text-gray-600 dark:text-gray-300">
            {" "}
            {/* Adjusted text size for mobile */}
            Jelajahi rangkaian lengkap peralatan pemadam kebakaran kami yang
            dirancang khusus untuk lingkungan hutan. Setiap produk dirancang
            untuk kinerja, daya tahan, dan keandalan dalam kondisi yang
            menantang.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {" "}
          {/* Adjusted gap for mobile */}
          {/* Filter Sidebar */}
          <aside className="lg:w-1/4 lg:sticky lg:top-28 self-start">
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              {" "}
              {/* Adjusted padding for mobile */}
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-5 text-gray-800 dark:text-white border-b pb-2 md:pb-3 border-gray-200 dark:border-gray-700">
                {" "}
                {/* Adjusted text size/margin for mobile */}
                Kategori Produk
              </h2>
              <ProductFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </aside>
          {/* Product Grid */}
          <main className="lg:w-3/4">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {" "}
                {/* Adjusted gap for mobile */}
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              // Enhanced Empty State - Adjusted for mobile
              <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 md:p-12 text-center min-h-[250px] md:min-h-[300px]">
                {" "}
                {/* Adjusted padding & min-height */}
                <PackageSearch className="w-12 h-12 md:w-16 md:h-16 text-red-400 dark:text-red-500 mb-4 md:mb-6" />{" "}
                {/* Adjusted icon size */}
                <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3 text-gray-800 dark:text-white">
                  {" "}
                  {/* Adjusted text size */}
                  Produk Tidak Ditemukan
                </h3>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-sm">
                  {" "}
                  {/* Adjusted text size */}
                  Maaf, kami tidak dapat menemukan produk yang cocok dengan
                  kategori '{selectedCategory}'. Silakan coba kategori lain atau
                  tampilkan semua produk.
                </p>
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="mt-5 md:mt-6 px-4 py-2 md:px-5 md:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 text-xs md:text-sm font-medium" /* Adjusted padding/text size */
                >
                  Tampilkan Semua Produk
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-300 ${
          showScrollButton
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ProductsPage;
