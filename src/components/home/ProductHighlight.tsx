import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products'; // Pastikan data produk memiliki field 'slug'
import Button from '../common/Button';
// Jika belum ada slugify, Anda bisa menggunakan library seperti 'slugify'
// import slugify from 'slugify'; // Contoh jika menggunakan library
// Atau buat fungsi slugify sederhana jika diperlukan
// const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const ProductHighlight: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
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
  }, []);

  // Ambil hanya produk unggulan (3 pertama)
  const featuredProducts = products.slice(0, 3);

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
              Temukan peralatan pemadam kebakaran inovatif kami yang dirancang khusus untuk lingkungan hutan.
            </p>
          </div>

          <Link
            to="/products"
            className="mt-6 md:mt-0 group flex items-center text-red-500 font-medium hover:text-red-600 transition-colors"
          >
            Lihat Semua Produk
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id} // Key tetap menggunakan ID unik
              ref={(el) => (productRefs.current[index] = el)}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transform transition-all duration-500 opacity-0 translate-y-12 hover:shadow-lg"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <span className="text-sm font-medium text-blue-500 uppercase tracking-wider">
                  {product.category === 'pump' ? 'Pompa Kebakaran' :
                   product.category === 'equipment' ? 'Peralatan' : 'Aksesori'}
                </span>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white mt-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                  {product.description}
                </p>

                {/* Pastikan objek product memiliki properti 'slug' */}
                {/* Jika tidak, Anda perlu membuatnya, misal: slugify(product.name) */}
                <Link to={`/products/${product.slug}`}>
                  <Button variant="outline" className="w-full">
                    Lihat Detail
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductHighlight;