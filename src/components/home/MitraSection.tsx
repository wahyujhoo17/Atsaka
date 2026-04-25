import React, { useRef, useEffect } from 'react';

const partnerLogos = [
  { name: 'BNPB', logo: null },
  { name: 'Dinas Damkar DKI', logo: null },
  { name: 'Kementerian LHK', logo: null },
  { name: 'Pertamina', logo: null },
  { name: 'APP Sinar Mas', logo: null },
];

const MitraSection: React.FC = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-white dark:bg-gray-900 opacity-0 transition-opacity duration-1000 ease-in-out"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            Dipercaya oleh
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
            Mitra Kami
          </h2>
          <div className="w-14 h-1 bg-red-500 mx-auto mb-6 rounded-full" />
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            Lihat bagaimana teknologi ATSAKA membantu instansi dan tim pemadam kebakaran
            bekerja lebih efektif dan efisien.
          </p>
        </div>

        {/* Partners Logo Bar */}
        <div className="relative overflow-hidden">
          <div className="border-y border-gray-100 dark:border-gray-700 py-10">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-8">
              Trusted by leading institutions & companies
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {partnerLogos.map((partner, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center h-14 px-8 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 transition-colors group"
                >
                  <span className="text-gray-500 dark:text-gray-400 font-semibold text-sm group-hover:text-red-500 transition-colors">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial Coming Soon Notice */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            * Testimoni dari mitra kami akan segera hadir
          </p>
        </div>
      </div>
    </section>
  );
};

export default MitraSection;
