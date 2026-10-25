import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageSearch, ChevronUp, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
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

  const itemsPerPage = 12; // Show 12 products per page

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();

      // Transform data to match Product interface
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        subtitle: item.subtitle || "",
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

  // A category plus all of its descendants (any depth, e.g. Pompa → Pompa Mini)
  const getCategoryAndChildrenSlugs = (categorySlug: string): string[] => {
    const category = categories.find((cat) => cat.slug === categorySlug);
    if (!category) return [categorySlug];

    const childSlugs = categories
      .filter((cat) => cat.parentId === category.id)
      .flatMap((child) => getCategoryAndChildrenSlugs(child.slug));
    return [categorySlug, ...childSlugs];
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

  // Product count per category, parents include their children
  const countFor = (slug: string) =>
    products.filter((product) =>
      getCategoryAndChildrenSlugs(slug).includes(product.category?.toLowerCase().trim()),
    ).length;

  // Only categories that actually have products become filter pills (parents first, then children)
  const filterCategories = [
    ...categories.filter((cat) => !cat.parentId),
    ...categories.filter((cat) => cat.parentId),
  ]
    .map((category) => ({ ...category, count: countFor(category.slug) }))
    .filter((category) => category.count > 0 || category.slug === selectedCategory);

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

  const pillClasses = (active: boolean) =>
    `shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
      active
        ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20"
        : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600"
    }`;

  const countBadge = (count: number, active: boolean) => (
    <span
      className={`text-xs tabular-nums px-1.5 rounded-full ${
        active ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
      }`}
    >
      {count}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Header: same spotlight backdrop and dark tone as the homepage hero */}
      <section className="relative overflow-hidden bg-gray-950 pt-28 pb-12 md:pt-36 md:pb-16">
        <img
          src="/img/bgonly.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[50%_35%] opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/60 to-gray-950" />

        <div className="relative container mx-auto px-5 md:px-4 text-center">
          <span className="inline-block text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            Katalog Produk
          </span>
          <h1 className="mt-3 text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Produk <span className="text-red-600">ATSAKA</span>
          </h1>
          <p className="mt-4 text-sm md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Pompa pemadam dan kelengkapan karhutla produk lokal berstandar global, teruji dan
            tersertifikasi untuk kebutuhan nyata di lapangan.
          </p>

          <div className="mt-8 inline-grid grid-cols-3 divide-x divide-red-600/60">
            {[
              { value: products.length, label: "Produk" },
              { value: filterCategories.length, label: "Kategori" },
              { value: "TKDN", label: "Produk Lokal" },
            ].map((stat) => (
              <div key={stat.label} className="px-5 md:px-10">
                <div className="text-xl md:text-3xl font-bold text-white tabular-nums">{stat.value}</div>
                <div className="mt-1 text-[10px] md:text-xs uppercase tracking-wider text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toolbar: search + category pills */}
      <div className="sticky top-20 z-30 bg-gray-100/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-5 md:px-4 py-3 md:py-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative md:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-700"
                aria-label="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button onClick={() => handleCategoryChange(null)} className={pillClasses(!selectedCategory)}>
              Semua
              {countBadge(products.length, !selectedCategory)}
            </button>
            {filterCategories.map((category) => {
              const active = selectedCategory === category.slug;
              return (
                <button
                  key={category.slug}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={pillClasses(active)}
                  title={category.description}
                >
                  {category.name}
                  {countBadge(category.count, active)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-5 md:px-4 py-8 md:py-12">
        {/* Results summary */}
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
            {selectedCategory ? getCategoryName(selectedCategory) : "Semua Produk"}
            {searchQuery && (
              <span className="font-normal text-gray-500"> · "{searchQuery}"</span>
            )}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredProducts.length > itemsPerPage
              ? `Menampilkan ${startIndex + 1}–${Math.min(endIndex, filteredProducts.length)} dari ${filteredProducts.length} produk`
              : `${filteredProducts.length} produk`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={getCategoryName(product.category)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex justify-center items-center gap-1.5 mt-10" aria-label="Halaman produk">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:border-red-500 hover:text-red-600 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-1 text-gray-400">…</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        aria-current={currentPage === page ? "page" : undefined}
                        className={`min-w-10 h-10 px-3 rounded-full text-sm font-semibold tabular-nums transition-colors ${
                          currentPage === page
                            ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                            : "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:border-red-500 hover:text-red-600 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label="Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-6 py-16 md:py-24">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-5">
              <PackageSearch className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Produk tidak ditemukan
            </h3>
            <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md">
              {searchQuery
                ? `Tidak ada produk yang cocok dengan "${searchQuery}"${selectedCategory ? ` di kategori ${getCategoryName(selectedCategory)}` : ""}.`
                : selectedCategory
                  ? `Belum ada produk di kategori ${getCategoryName(selectedCategory)}.`
                  : "Belum ada produk yang tersedia saat ini."}
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  handleSearchChange("");
                  handleCategoryChange(null);
                }}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
              >
                Tampilkan Semua Produk
              </button>
            )}
          </div>
        )}
      </main>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 md:bottom-8 md:right-8 p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-300 z-40 ${
          showScrollButton
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ProductsPage;
