import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'fire-pump',
    title: 'FIRE PUMP',
    imageUrl: '/img/products/fire-pump-removebg-preview.png',
    fallbackUrl: 'https://images.pexels.com/photos/2684219/pexels-photo-2684219.jpeg',
    category: 'pump',
  },
  {
    id: 'baju-pemadam',
    title: 'BAJU PEMADAM',
    imageUrl: '/img/products/baju-pemadam-removebg-preview.png',
    fallbackUrl: 'https://images.pexels.com/photos/5765182/pexels-photo-5765182.jpeg',
    category: 'equipment',
  },
  {
    id: 'peralatan-tangan',
    title: 'PERALATAN TANGAN',
    imageUrl: '/img/products/peralatan-tangan-removebg-preview.png',
    fallbackUrl: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg',
    category: 'equipment',
  },
  {
    id: 'aksesoris',
    title: 'AKSESORIS',
    imageUrl: '/img/products/aksesoris-removebg-preview.png',
    fallbackUrl: 'https://images.pexels.com/photos/210881/pexels-photo-210881.jpeg',
    category: 'accessory',
  },
];

const ProductHighlight: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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

    if (sectionRef.current) observer.observe(sectionRef.current);
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[#232323] opacity-0 transition-opacity duration-1000 ease-in-out relative"
    >
      <div className="container mx-auto px-4 max-w-6xl relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#E5252A] mb-4 tracking-wider uppercase">
            Produk Kami
          </h2>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-[1px] w-12 bg-gray-500"></div>
            <div className="w-2.5 h-2.5 bg-white"></div>
            <div className="h-[1px] w-12 bg-gray-500"></div>
          </div>

          {/* Subtitle */}
          <p className="text-gray-300 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            ATSAKA menawarkan jajaran lengkap pompa kebakaran portabel sentrifugal tekanan tinggi dan komponen yang cocok untuk memenuhi persyaratan penanganan air yang paling sulit di lapangan.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-20">
          {categories.map((item, index) => (
            <Link
              key={item.id}
              to={`/products?category=${item.category}`}
              ref={(el) => (cardRefs.current[index] = el)}
              className="group flex flex-col items-center justify-between opacity-0 translate-y-8 transition-all duration-700 hover:-translate-y-2"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Product Image */}
              <div className="w-full aspect-square flex items-center justify-center mb-6">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if transparent image is missing
                    (e.target as HTMLImageElement).src = item.fallbackUrl;
                    (e.target as HTMLImageElement).className = "w-full h-full object-cover rounded-xl opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all";
                  }}
                />
              </div>

              {/* Product Title */}
              <h3 className="text-[#E5252A] font-bold text-base md:text-lg text-center uppercase tracking-widest group-hover:text-red-400 transition-colors">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            to="/products"
            className="bg-[#E5252A] hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-full uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-red-600/30 hover:scale-105"
          >
            Temukan Produk Yang Tepat
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlight;
