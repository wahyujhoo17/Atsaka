import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageSearch, ChevronUp, Sparkles, TrendingUp, SlidersHorizontal, X } from "lucide-react";
import ProductFilter from "../components/products/ProductFilter";
import ProductCard from "../components/products/ProductCard";
import { api } from "../lib/api";
import { Product, Category } from "../types";

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category"),
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("search") || "",
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const itemsPerPage = 12; // Show 12 products per page

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();

      // Transform data to match Product interface
      const transformedProducts: Product[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        category: item.category,
        description: item.description || "",
        features: item.features || [],
        imageUrl: item.imageUrl || "",
        imageUrls: item.imageUrls || [],
        specifications: item.specifications || {},
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getCategoryName = (slug: string) => {
    const category = categories.find((cat) => cat.slug === slug);
    return category ? category.name : slug;
  };

  // Get all category slugs including children for filtering
  const getCategoryAndChildrenSlugs = (categorySlug: string): string[] => {
    const category = categories.find((cat) => cat.slug === categorySlug);
    if (!category) return [categorySlug];

    const slugs = [categorySlug];
    if (category.children) {
      category.children.forEach((child) => {
        slugs.push(child.slug);
      });
    }

    return slugs;
  };

  const filteredProducts = products.filter((product) => {
    // Category filter - include parent and all children
    const categoryMatch = selectedCategory
      ? getCategoryAndChildrenSlugs(selectedCategory).includes(
          product.category?.toLowerCase().trim(),
        )
      : true;

    // Search filter
    const searchMatch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return categoryMatch && searchMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Calculate product counts per category
  const productCounts = products.reduce(
    (acc, product) => {
      const category =
        product.category?.toLowerCase().trim() || "uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = searchParams.get("page");

    setSelectedCategory(category);
    setSearchQuery(search || "");
    setCurrentPage(page ? parseInt(page) : 1);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (searchQuery) params.set("search", searchQuery);
    if (currentPage > 1) params.set("page", currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, currentPage, setSearchParams]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
    setShowMobileFilter(false); // Close mobile filter on selection
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (showMobileFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileFilter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section - Compact on mobile */}
      <div className="relative pt-24 pb-4 md:pt-28 md:pb-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-2 md:mb-4 tracking-tight">
              Produk
            </h1>

            <div className="w-14 md:w-20 h-1 bg-red-600 mx-auto mb-4 md:mb-8 rounded-full"></div>

            {/* Description - hidden on mobile */}
            <p className="hidden md:block text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto font-medium">
              Jelajahi katalog produk unggulan kami, mulai dari alat pemadam hingga sistem pendukung pendidikan keselamatan yang teruji dan tersertifikasi.
            </p>

            {/* Stats - Compact on mobile */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-sm md:max-w-lg mx-auto">
              <div className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-2 md:p-0 md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none md:rounded-none">
                <div className="text-lg md:text-2xl font-bold text-red-600 dark:text-red-400 mb-0.5 md:mb-1">
                  {products.length}+
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300">
                  Produk
                </div>
              </div>
              <div className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-2 md:p-0 md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none md:rounded-none">
                <div className="text-lg md:text-2xl font-bold text-red-600 dark:text-red-400 mb-0.5 md:mb-1">
                  {categories.length}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300">
                  Kategori
                </div>
              </div>
              <div className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-2 md:p-0 md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none md:rounded-none">
                <div className="text-lg md:text-2xl font-bold text-red-600 dark:text-red-400 mb-0.5 md:mb-1">
                  100%
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300">
                  Kualitas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 pb-16 md:pb-24 mt-4 md:mt-10">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar Filter - hidden on mobile, shown in drawer */}
          <aside className="hidden lg:block lg:w-80 lg:sticky lg:top-24 self-start shrink-0">
            <ProductFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              productCounts={productCounts}
            />
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Mobile: Search + Filter Row */}
            <div className="mb-3 sm:mb-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <PackageSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilter(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shrink-0"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">Filter</span>
                  {selectedCategory && (
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>

              {/* Active Filter Chip on mobile */}
              {selectedCategory && (
                <div className="lg:hidden mt-2 flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium border border-red-100 dark:border-red-800/30">
                    {getCategoryName(selectedCategory)}
                    <button 
                      onClick={() => handleCategoryChange(null)}
                      className="hover:bg-red-100 dark:hover:bg-red-800/30 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              )}
            </div>

            {/* Results Header - Compact on mobile */}
            <div className="flex items-center justify-between gap-2 mb-3 sm:mb-6 p-3 sm:p-5 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm sm:shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                    {selectedCategory
                      ? getCategoryName(selectedCategory)
                      : "Semua Produk"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {filteredProducts.length} produk
                    {filteredProducts.length > itemsPerPage && (
                      <span className="hidden sm:inline ml-1">
                        (menampilkan {startIndex + 1}-
                        {Math.min(endIndex, filteredProducts.length)} dari{" "}
                        {filteredProducts.length})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {selectedCategory && (
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="hidden sm:inline-flex px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                >
                  Lihat Semua
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-3 sm:mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                {/* Mobile: 2 columns, Desktop: 2-4 columns */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination - simplified on mobile */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-1 sm:gap-2 mt-6 sm:mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-xs sm:text-sm"
                    >
                      <span className="sm:hidden">‹</span>
                      <span className="hidden sm:inline">‹ Previous</span>
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          // Show first page, last page, current page, and pages around current
                          return (
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1
                          );
                        })
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-1 sm:px-2 py-2 text-gray-500 text-xs sm:text-sm">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-2.5 sm:px-3 py-2 rounded-lg border transition-colors duration-200 text-xs sm:text-sm ${
                                currentPage === page
                                  ? "bg-red-600 text-white border-red-600"
                                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-xs sm:text-sm"
                    >
                      <span className="sm:hidden">›</span>
                      <span className="hidden sm:inline">Next ›</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 sm:p-12 md:p-16 text-center min-h-[300px] sm:min-h-[400px] border border-gray-100 dark:border-gray-700">
                <div className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 rounded-full mb-4 sm:mb-6">
                  <PackageSearch className="w-10 h-10 sm:w-16 sm:h-16 text-red-400 dark:text-red-500" />
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                  Produk Tidak Ditemukan
                </h3>

                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mb-6 sm:mb-8 leading-relaxed">
                  {selectedCategory ? (
                    <>
                      Maaf, kami tidak dapat menemukan produk yang cocok dengan
                      kategori{" "}
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        '{getCategoryName(selectedCategory)}'
                      </span>
                      . Silakan coba kategori lain atau tampilkan semua produk.
                    </>
                  ) : searchQuery ? (
                    <>
                      Maaf, kami tidak dapat menemukan produk dengan kata kunci{" "}
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        '{searchQuery}'
                      </span>
                      . Silakan coba kata kunci lain atau tampilkan semua
                      produk.
                    </>
                  ) : (
                    "Belum ada produk yang tersedia saat ini."
                  )}
                </p>

                <button
                  onClick={() => handleCategoryChange(null)}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg shadow-red-500/25 transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <Sparkles className="w-4 h-4" />
                  Tampilkan Semua Produk
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer/Bottom Sheet */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowMobileFilter(false)}
          />
          
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto animate-slideUp">
            {/* Drawer Handle */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 pt-3 pb-2 px-5 border-b border-gray-100 dark:border-gray-700 z-10 rounded-t-2xl">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-3"></div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filter Produk</h3>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            {/* Filter Content */}
            <div className="p-4">
              <ProductFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                productCounts={productCounts}
              />
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-4 sm:bottom-8 sm:right-8 p-3 sm:p-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl transition-all duration-300 z-40 ${
          showScrollButton
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-12 scale-75 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

export default ProductsPage;
