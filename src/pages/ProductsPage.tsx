import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageSearch, ChevronUp, Sparkles, TrendingUp } from "lucide-react";
import ProductFilter from "../components/products/ProductFilter";
import ProductCard from "../components/products/ProductCard";
import { products } from "../data/products";

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [showScrollButton, setShowScrollButton] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative pt-20 pb-8 md:pt-28 md:pb-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Produk
              </span>{" "}
              Unggulan Kami
            </h1>

            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-6 rounded-full"></div>

            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              Jelajahi rangkaian lengkap{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                peralatan pemadam kebakaran profesional
              </span>{" "}
              yang dirancang khusus untuk performa optimal dalam kondisi
              ekstrem.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {products.length}+
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Produk Tersedia
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {categories.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Kategori Utama
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                  100%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Kualitas Terjamin
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16 md:pb-24 mt-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filter */}
          <aside className="lg:w-80 lg:sticky lg:top-24 self-start shrink-0">
            <ProductFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedCategory
                      ? `Kategori: ${
                          selectedCategory === "pump"
                            ? "Pompa Pemadam"
                            : selectedCategory === "equipment"
                            ? "Peralatan"
                            : "Aksesoris"
                        }`
                      : "Semua Produk"}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {filteredProducts.length} produk ditemukan
                  </p>
                </div>
              </div>

              {selectedCategory && (
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                >
                  Lihat Semua
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-12 md:p-16 text-center min-h-[400px] border border-gray-100 dark:border-gray-700">
                <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-full mb-6">
                  <PackageSearch className="w-16 h-16 text-red-400 dark:text-red-500" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                  Produk Tidak Ditemukan
                </h3>

                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
                  Maaf, kami tidak dapat menemukan produk yang cocok dengan
                  kategori{" "}
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    '
                    {selectedCategory === "pump"
                      ? "Pompa Pemadam"
                      : selectedCategory === "equipment"
                      ? "Peralatan"
                      : "Aksesoris"}
                    '
                  </span>
                  . Silakan coba kategori lain atau tampilkan semua produk.
                </p>

                <button
                  onClick={() => handleCategoryChange(null)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg shadow-red-500/25 transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Tampilkan Semua Produk
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl transition-all duration-300 z-50 ${
          showScrollButton
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-12 scale-75 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ProductsPage;
