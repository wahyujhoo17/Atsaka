import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Loader } from 'lucide-react';
import { api } from '../lib/api';

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch articles from API
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchArticles = async () => {
      try {
        const data = await api.getArticles();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
        <Loader className="w-10 h-10 text-[#E5252A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen pt-28 pb-20 font-sans text-gray-200">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 uppercase tracking-wider">
            Berita & <span className="text-[#E5252A]">Artikel</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Temukan wawasan terbaru, panduan keselamatan, dan teknologi terkini seputar dunia pemadam kebakaran.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-[1px] w-16 bg-gray-600"></div>
            <div className="w-2 h-2 rounded-full bg-[#E5252A]"></div>
            <div className="h-[1px] w-16 bg-gray-600"></div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article 
              key={article.id} 
              className="bg-[#232323] rounded-xl overflow-hidden border border-gray-800 shadow-xl group hover:-translate-y-2 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-[#E5252A] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm shadow-md">
                  {article.category}
                </div>
                <img 
                  src={article.imageUrl || 'https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg'} 
                  alt={article.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#232323] via-transparent to-transparent"></div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-gray-400 text-xs mb-4 uppercase tracking-wide gap-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#E5252A]" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-[#E5252A]" />
                    {article.author}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#E5252A] transition-colors">
                  {article.title}
                </h2>
                
                <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                  {article.excerpt}
                </p>
                
                <Link 
                  to={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white group/link mt-auto w-fit"
                >
                  BACA SELENGKAPNYA
                  <ArrowRight size={16} className="text-[#E5252A] transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
