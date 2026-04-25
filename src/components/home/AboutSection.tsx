import React, { useRef, useEffect } from 'react';
import { CheckCircle2, Users, Wrench } from 'lucide-react';

const stats = [
  {
    value: '250',
    suffix: '+',
    label: 'Unit Telah Digunakan di Berbagai Operasi Lapangan',
  },
  {
    value: 'Dipercaya',
    suffix: '',
    label: 'Oleh Instansi Pemerintah dan Perusahaan Perkebunan',
  },
  {
    value: '3',
    suffix: '+',
    label: 'Tahun Pengembangan Produk dan Pengalaman Manufaktur',
  },
];

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-16 md:py-20 bg-white opacity-0 transition-opacity duration-1000 ease-in-out overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* TOP ROW: Headline & Text */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 mb-16">
          <div className="md:col-span-6 lg:col-span-5">
            <div className="text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">
              [ TENTANG KAMI ]
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.15] tracking-tight">
              Solusi Pemadam<br className="hidden lg:block" /> Kebakaran Hutan
            </h2>
          </div>
          <div className="md:col-span-6 lg:col-span-7 md:pt-12">
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed text-justify">
              ATSAKA merupakan brand dari PT Sinar Surya Semestaraya yang berfokus pada pengembangan dan manufaktur peralatan pemadam kebakaran hutan. Sejak 2010, Produk kami menghadirkan peralatan yang andal, inovatif, dan berstandar internasional, sebagai solusi tangguh untuk kondisi ekstrem. Dengan pendekatan inovasi berkelanjutan dan pengujian ketat, ATSAKA terus menjadi mitra terpercaya di Indonesia.
            </p>
          </div>
        </div>

        {/* BOTTOM ROW: Visuals & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Tall Image (4 columns wide) */}
          <div className="lg:col-span-4 h-[300px] lg:h-[480px]">
            <img
              src="https://images.pexels.com/photos/1205111/pexels-photo-1205111.jpeg"
              alt="Manufaktur ATSAKA"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Right Column: Wide Image + Stats (8 columns wide) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            
            {/* Top: Wide Image */}
            <div className="h-[200px] lg:h-[300px]">
              <img
                src="https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg"
                alt="Tim ATSAKA"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Bottom: 3 Stats Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 flex-1">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-6 flex flex-col justify-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-bold text-gray-900 mb-3 flex items-start text-3xl lg:text-4xl">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-orange-500 text-2xl lg:text-3xl ml-1 leading-none font-black">{stat.suffix}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
