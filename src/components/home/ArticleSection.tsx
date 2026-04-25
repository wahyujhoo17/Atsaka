import React, { useRef, useEffect } from 'react';
import { ArrowRight, BookOpen, Flame, TreePine, Wind } from 'lucide-react';

const placeholderArticles = [
  {
    id: 1,
    title: 'Teknologi Pompa Pemadam Kebakaran Hutan Terkini',
    excerpt: 'Mengenal inovasi terbaru dalam teknologi pompa pemadam kebakaran hutan yang efisien dan ramah lingkungan untuk operasi lapangan...',
    category: 'Teknologi',
    icon: <Flame className="w-5 h-5 text-orange-500" />,
    date: 'Segera Hadir',
    readTime: '',
    imageUrl: 'https://images.pexels.com/photos/51951/forest-fire-fire-smoke-conservation-51951.jpeg',
  },
  {
    id: 2,
    title: 'Strategi Efektif Penanganan Kebakaran Hutan di Indonesia',
    excerpt: 'Panduan strategi penanganan kebakaran hutan yang terbukti efektif dari berbagai operasi lapangan di seluruh Indonesia...',
    category: 'Operasional',
    icon: <TreePine className="w-5 h-5 text-green-500" />,
    date: 'Segera Hadir',
    readTime: '',
    imageUrl: 'https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg',
  },
  {
    id: 3,
    title: 'Pentingnya Sertifikasi SNI pada Peralatan Pemadam Kebakaran',
    excerpt: 'Memahami standar SNI dan mengapa sertifikasi menjadi jaminan kualitas peralatan pemadam kebakaran yang andal...',
    category: 'Regulasi',
    icon: <Wind className="w-5 h-5 text-blue-500" />,
    date: 'Segera Hadir',
    readTime: '',
    imageUrl: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg',
  },
];

const ArticleSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      className="py-24 bg-white dark:bg-gray-900 opacity-0 transition-opacity duration-1000 ease-in-out"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
              <BookOpen size={14} />
              Artikel & Insight
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              Insight & Wawasan Kebakaran Hutan
            </h2>
            <div className="w-14 h-1 bg-red-500 mb-4 rounded-full" />
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl leading-relaxed">
              Temukan informasi terkini tentang penanggulangan kebakaran hutan, teknologi peralatan, dan tips operasional lapangan.
            </p>
          </div>
          <a
            href="#"
            className="group flex items-center gap-2 text-red-500 font-semibold hover:text-red-600 transition-colors whitespace-nowrap opacity-50 cursor-not-allowed"
          >
            Lihat Semua Artikel
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {placeholderArticles.map((article, index) => (
            <div
              key={article.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 opacity-0 translate-y-12 border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                  loading="lazy"
                />
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-full">
                    Segera Hadir
                  </span>
                </div>
                {/* Category Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                  {article.icon}
                  {article.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-3 leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-400 italic">{article.date}</span>
                  <span className="text-xs text-red-400 font-medium cursor-not-allowed">
                    Baca Selengkapnya →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;
