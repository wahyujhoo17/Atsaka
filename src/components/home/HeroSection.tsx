import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Star,
} from "lucide-react";

const WA_NUMBER = "6287888491949";

const pillars = [
  {
    title: "Produk Lokal",
    subtitle: "Berkualitas International",
  },
  {
    title: "Standar Teruji",
    subtitle: "Kualitas Terjamin",
  },
  {
    title: "Bersertifikasi",
    subtitle: "Sesuai Ketentuan",
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
    const message = encodeURIComponent(
      "Halo ATSAKA, saya ingin konsultasi mengenai peralatan pemadam kebakaran hutan.",
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <div className="relative min-h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/51951/forest-fire-fire-smoke-conservation-51951.jpeg"
          alt="Kebakaran hutan"
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex items-center relative z-10">
        <div className="container mx-auto px-4 pt-20 md:pt-32 pb-12 md:pb-0">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Top Content: Badge, Headline, Text */}
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="text-orange-500 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase mb-4 md:mb-6">
                [ ATASI BERSAMA KAMI ]
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.2] md:leading-[1.1] mb-4 md:mb-6 tracking-tight">
                Manufaktur Peralatan
                <br className="hidden md:block" />
                Pemadam Kebakaran
              </h1>

              {/* Sub Headline */}
              <p className="text-[13px] sm:text-base md:text-lg text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-2xl font-light">
                Menghadirkan rangkaian alat pemadam kebakaran hutan berbasis
                produk lokal dengan kualitas internasional untuk mendukung
                efektivitas dan kesiapan tim Anda.
              </p>
            </div>

            {/* Bottom Content: Buttons (Left) & Pillars (Right) */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-end gap-10 md:gap-12 mt-4">
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <a
                  href="/products"
                  className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 md:py-4 px-8 text-xs md:text-sm tracking-wider uppercase transition-colors shadow-lg"
                >
                  Jelajahi Produk
                </a>

                <button
                  onClick={handleWAConsultation}
                  className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-gray-900 font-bold py-3.5 md:py-4 px-8 text-xs md:text-sm tracking-wider uppercase transition-colors shadow-lg"
                >
                  Konsultasi Sekarang
                </button>
              </div>

              {/* Pillars */}
              <div className="grid grid-cols-3 gap-2 md:flex md:items-center md:gap-10 overflow-hidden pb-2 lg:pb-0">
                {pillars.map((pillar, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-0">
                      <span className="text-white font-bold text-[10px] sm:text-xs md:text-xl tracking-tight md:tracking-wide mb-0.5 md:mb-1 truncate w-full">
                        {pillar.title}
                      </span>
                      <span className="text-gray-400 text-[8px] sm:text-[9px] md:text-sm font-light tracking-wide uppercase opacity-80 leading-tight">
                        {pillar.subtitle}
                      </span>
                    </div>
                    {/* Vertical Divider */}
                    {index < pillars.length - 1 && (
                      <div className="h-6 md:h-10 w-px bg-white/10 shrink-0 self-center"></div>
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
