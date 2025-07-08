import React, { useRef, useEffect } from "react";
import { Shield, Flame, Award, Leaf } from "lucide-react";

const features = [
  {
    icon: <Shield className="w-10 h-10 text-red-500" />,
    title: "Material produksi berkualitas tinggi",
    description:
      "Semua produk ATSAKA dirancang dengan standar tertinggi, memastikan keandalan dan kinerja di lingkungan yang paling menuntut.",
  },
  {
    icon: <Flame className="w-10 h-10 text-red-500" />,
    title: "Menggunakan sistem penarikan 3 bilah putar", // "blade rotary" translated
    description:
      "Peralatan kami dirancang khusus untuk memadamkan kebakaran hutan, dengan konstruksi ringan namun tahan lama yang ideal untuk operasi jarak jauh.",
  },
  {
    icon: <Award className="w-10 h-10 text-red-500" />,
    title: "Dilengkapi dengan sertifikat SNI", // Capitalized "Dilengkapi"
    description:
      "Dengan bangga dibuat di Indonesia, produk kami mendukung industri lokal sekaligus disesuaikan secara sempurna dengan kondisi hutan Asia Tenggara.",
  },
  {
    icon: <Leaf className="w-10 h-10 text-red-500" />,
    title: "Garansi produk dan ketersediaan suku cadang",
    description:
      "Kami merancang peralatan kami dengan mempertimbangkan dampak lingkungan minimal, menggunakan praktik berkelanjutan di seluruh proses manufaktur kami.",
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
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    featuresRef.current.forEach((feature) => {
      if (feature) observer.observe(feature);
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }

      featuresRef.current.forEach((feature) => {
        if (feature) observer.unobserve(feature);
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-white dark:bg-gray-800 transition-opacity opacity-0 duration-1000 ease-in-out"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Kenapa Harus ATSAKA
          </h2>
          <div className="w-16 h-1 bg-red-500 mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            ATSAKA memiliki komitmen untuk selalu berinovasi dalam memenuhi
            kebutuhan klien kami, serta selalu menjaga kualitas dari produk kami
            sehingga dalam penggunaannya mampu mengatasi masalah yang dimiliki
            klien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featuresRef.current[index] = el)}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 shadow-md transform transition-all duration-500 opacity-0 translate-y-12"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
