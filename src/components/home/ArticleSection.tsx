import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Flame, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

const ArticleSection: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await api.getArticles();
        setArticles(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching articles for home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();

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
    
    // We need to re-observe cards when articles change
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [articles.length]);

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
          <Link
            to="/articles"
            className="group flex items-center gap-2 text-red-500 font-semibold hover:text-red-600 transition-colors whitespace-nowrap"
          >
            Lihat Semua Artikel
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
            ))
          ) : articles.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              Belum ada artikel terbaru.
            </div>
          ) : (
            articles.map((article, index) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                ref={(el) => (cardRefs.current[index] = el)}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 opacity-0 translate-y-12 border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={article.imageUrl || 'https://images.pexels.com/photos/51951/forest-fire-fire-smoke-conservation-51951.jpeg'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                    <Flame className="w-4 h-4 text-red-500" />
                    {article.category || 'Berita'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-3 leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span className="text-xs text-red-500 font-bold group-hover:underline">
                      Baca Selengkapnya
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;
