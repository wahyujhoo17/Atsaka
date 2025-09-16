import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageSearch, ChevronUp, Sparkles, TrendingUp } from "lucide-react";
import ProductFilter from "../components/products/ProductFilter";
import ProductCard from "../components/products/ProductCard";
import { supabase } from "../lib/supabase";
import { Product, Category } from "../types";

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("search") || ""
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 12; // Show 12 products per page

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data to match Product interface
      const transformedProducts: Product[] = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        category: item.category,
        description: item.description || "",
        features: item.features || [],
        imageUrl: item.image_url || "",
        imageUrls: item.image_urls || [],
        specifications: item.specifications || {},
      }));

      setProducts(transformedProducts);
      console.log(
        "Fetched products:",
        transformedProducts.map((p) => ({ name: p.name, category: p.category }))
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
      console.log(
        "Fetched categories:",
        data?.map((c) => ({ name: c.name, slug: c.slug }))
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getCategoryName = (slug: string) => {
    const category = categories.find((cat) => cat.slug === slug);
    return category ? category.name : slug;
  };

  const filteredProducts = products.filter((product) => {
    // Category filter
    const categoryMatch = selectedCategory
      ? product.category?.toLowerCase().trim() ===
        selectedCategory.toLowerCase().trim()
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
  const productCounts = products.reduce((acc, product) => {
    const category = product.category?.toLowerCase().trim() || "uncategorized";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
              categories={categories.map((cat) => cat.slug)}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              productCounts={productCounts}
            />
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <PackageSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedCategory
                      ? `Kategori: ${getCategoryName(selectedCategory)}`
                      : "Semua Produk"}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {filteredProducts.length} produk ditemukan
                    {filteredProducts.length > itemsPerPage && (
                      <span className="ml-1">
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
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                >
                  Lihat Semua
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      ‹ Previous
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
                              <span className="px-2 py-2 text-gray-500">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
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
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next ›
                    </button>
                  </div>
                )}
              </>
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
