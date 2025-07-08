import React, { useRef, useEffect } from 'react';
import { Users, Check, MapPin, Clock } from 'lucide-react';

const stats = [
  {
    icon: <Check className="w-8 h-8 text-red-500" />,
    value: "3.500+",
    label: "Intervensi Kebakaran Berhasil",
    suffix: "",
  },
  {
    icon: <Users className="w-8 h-8 text-red-500" />,
    value: "450+",
    label: "Dinas Pemadam Kebakaran Dilengkapi",
    suffix: "",
  },
  {
    icon: <MapPin className="w-8 h-8 text-red-500" />,
    value: "28",
    label: "Provinsi Tercakup",
    suffix: "",
  },
  {
    icon: <Clock className="w-8 h-8 text-red-500" />,
    value: "15",
    label: "Tahun Pengalaman",
    suffix: "+",
  }
];

const StatisticsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    statRefs.current.forEach((stat) => {
      if (stat) observer.observe(stat);
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }

      statRefs.current.forEach((stat) => {
        if (stat) observer.unobserve(stat);
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gray-900 opacity-0 transition-opacity duration-1000 ease-in-out"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={(el) => (statRefs.current[index] = el)}
              className="text-center opacity-0 transform translate-y-12 transition-all duration-700"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-10 rounded-full mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                {stat.value}
                <span className="text-red-500">{stat.suffix}</span>
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;