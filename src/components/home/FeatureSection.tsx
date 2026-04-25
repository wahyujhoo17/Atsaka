import React, { useRef, useEffect } from 'react';
import { Package, Shield, Award } from 'lucide-react';

const features = [
  {
    icon: <Package className="w-10 h-10 text-red-500" />,
    title: 'Material Berstandar Internasional',
    description:
      'Menggunakan material berkualitas tinggi dengan desain portable, memastikan performa optimal dan kemudahan penggunaan di berbagai kondisi lapangan.',
  },
  {
    icon: <Shield className="w-10 h-10 text-red-500" />,
    title: 'Kualitas Teruji & Tersertifikasi',
    description:
      'Lolos Uji Lab Damkar DKI yang bersertifikasi SNI, dan memiliki TKDN. Telah lolos juga Matching Test HPPI Pusat (OEM Honda), kami menjamin performa alat yang sesuai dengan standar tertinggi industri.',
    highlight: 'Matching Test HPPI Pusat (OEM Honda)',
  },
  {
    icon: <Award className="w-10 h-10 text-red-500" />,
    title: 'Garansi & Dukungan Spare Part',
    description:
      'Garansi Engine 1 Tahun dan jaminan ketersediaan Sparepart 2 Tahun. Kami memastikan alat Anda selalu siap tempur dengan dukungan teknis yang cepat dan mudah diakses.',
    highlight: 'Garansi Engine 1 Tahun',
  },
];

const FeatureSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    featuresRef.current.forEach((feature) => {
      if (feature) observer.observe(feature);
    });

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      featuresRef.current.forEach((feature) => {
        if (feature) observer.unobserve(feature);
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gray-900 opacity-0 transition-opacity duration-1000 ease-in-out relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-red-600/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-red-600/10 blur-[100px] rounded-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            Kenapa Harus ATSAKA
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
            Keunggulan Manufaktur Kami
          </h2>
          <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featuresRef.current[index] = el)}
              className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10 hover:border-red-500/50 transform transition-all duration-500 opacity-0 translate-y-12 shadow-2xl hover:-translate-y-2"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-transparent rounded-3xl transition-all duration-500"></div>

              {/* Icon Container */}
              <div className="relative w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-red-900/40 group-hover:scale-110 transition-transform duration-500">
                <div className="text-white">
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "w-10 h-10" })}
                </div>
              </div>

              <div className="relative">
                <div className="text-red-500 font-black text-6xl opacity-5 absolute -top-4 -right-2">
                  0{index + 1}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-red-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
