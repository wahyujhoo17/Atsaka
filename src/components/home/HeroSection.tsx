import React, { useEffect, useState } from 'react';
import { MessageCircle, ArrowRight, ShieldCheck, BadgeCheck, Star } from 'lucide-react';

const WA_NUMBER = '628176454312';

const pillars = [
  {
    title: 'Produk Lokal',
    subtitle: 'Berkualitas International',
  },
  {
    title: 'Standar Teruji',
    subtitle: 'Kualitas Terjamin',
  },
  {
    title: 'Bersertifikasi',
    subtitle: 'Sesuai Ketentuan',
  },
];

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleWAConsultation = () => {
    const message = encodeURIComponent('Halo ATSAKA, saya ingin konsultasi mengenai peralatan pemadam kebakaran hutan.');
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-gray-900 flex flex-col">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/51951/forest-fire-fire-smoke-conservation-51951.jpeg"
          alt="Kebakaran hutan"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/75 to-gray-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex items-center relative z-10 pb-20 md:pb-0">
        <div className="container mx-auto px-4 pt-32">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {/* Top Content: Badge, Headline, Text */}
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="text-orange-500 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-6">
                [ ATASI BERSAMA KAMI ]
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Manufaktur Peralatan<br />
                Pemadam Kebakaran
              </h1>

              {/* Sub Headline */}
              <p className="text-base md:text-lg text-gray-300 mb-12 leading-relaxed max-w-2xl font-light">
                Menghadirkan rangkaian alat pemadam kebakaran hutan berbasis produk lokal dengan kualitas internasional untuk mendukung efektivitas dan kesiapan tim Anda dalam setiap operasi lapangan.
              </p>
            </div>

            {/* Bottom Content: Buttons (Left) & Pillars (Right) */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mt-4">
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <a
                  href="/products"
                  className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 text-sm tracking-wider uppercase transition-colors"
                >
                  Jelajahi Produk
                </a>

                <button
                  onClick={handleWAConsultation}
                  className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 text-sm tracking-wider uppercase transition-colors"
                >
                  Konsultasi Sekarang
                </button>
              </div>

              {/* Pillars (Right aligned visually on desktop) */}
              <div className="flex items-center gap-6 md:gap-10 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-auto">
                {pillars.map((pillar, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col whitespace-nowrap">
                      <span className="text-white font-bold text-lg md:text-xl tracking-wide mb-1">
                        {pillar.title}
                      </span>
                      <span className="text-gray-400 text-sm font-light tracking-wide">
                        {pillar.subtitle}
                      </span>
                    </div>
                    {/* Vertical Divider */}
                    {index < pillars.length - 1 && (
                      <div className="h-10 w-px bg-white/30 hidden sm:block"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;