import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center">
      {/* Gambar latar belakang dengan overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/51951/forest-fire-fire-smoke-conservation-51951.jpeg"
          alt="Kebakaran hutan"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              <span className="text-red-500">Melindungi Hutan,</span> <br />
              Menyelamatkan Masa Depan
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Solusi Pemadam Kebakaran Hutan Terdepan dari Indonesia
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                variant="primary"
                size="lg"
                className="group"
              >
                <Link to="/products" className="flex items-center justify-center">
                  Jelajahi Produk
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
              >
                <Link to="/contact">Hubungi Penjualan</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Indikator gulir */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-sm mb-2">Gulir untuk menemukan</span>
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-red-500 to-transparent relative">
            <div className="absolute w-1.5 h-2 bg-white rounded-full top-0 left-1/2 transform -translate-x-1/2 animate-ping"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;