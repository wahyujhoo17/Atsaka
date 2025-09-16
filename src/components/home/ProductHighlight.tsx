import React, { useRef, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Product } from "../../types";
import Button from "../common/Button";
// Jika belum ada slugify, Anda bisa menggunakan library seperti 'slugify'
// import slugify from 'slugify'; // Contoh jika menggunakan library
// Atau buat fungsi slugify sederhana jika diperlukan
// const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const ProductHighlight: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    productRefs.current.forEach((product) => {
      if (product) observer.observe(product);
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }

      productRefs.current.forEach((product) => {
        if (product) observer.unobserve(product);
      });
    };
  }, [featuredProducts]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

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

      setFeaturedProducts(transformedProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setError("Gagal memuat produk unggulan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gray-50 dark:bg-gray-900 transition-opacity opacity-0 duration-1000 ease-in-out"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Produk Unggulan
            </h2>
            <div className="w-16 h-1 bg-red-500 mb-6"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl">
              Temukan peralatan pemadam kebakaran inovatif kami yang dirancang
              khusus untuk lingkungan hutan.
            </p>
          </div>

          <Link
            to="/products"
            className="mt-6 md:mt-0 group flex items-center text-red-500 font-medium hover:text-red-600 transition-colors"
          >
            Lihat Semua Produk
            <ArrowRight
              className="ml-2 group-hover:translate-x-1 transition-transform"
              size={20}
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                ref={(el) => (productRefs.current[index] = el)}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse"
              >
                <div className="h-64 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-6 w-3/4"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchFeaturedProducts}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product: Product, index: number) => (
              <div
                key={product.id}
                ref={(el) => (productRefs.current[index] = el)}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transform transition-all duration-500 opacity-0 translate-y-12 hover:shadow-lg group"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-6">
                  <span className="text-sm font-medium text-blue-500 uppercase tracking-wider">
                    {product.category === "pump"
                      ? "Pompa Kebakaran"
                      : product.category === "equipment"
                      ? "Peralatan"
                      : "Aksesori"}
                  </span>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white mt-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                    {product.description}
                  </p>

                  <Link to={`/products/${product.slug}`}>
                    <Button variant="outline" className="w-full">
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Belum ada produk unggulan
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductHighlight;
