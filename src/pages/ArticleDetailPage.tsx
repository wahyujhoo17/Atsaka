import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { Calendar, User, ArrowLeft, Tag, Share2, Loader } from 'lucide-react';
import { api } from '../lib/api';

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchArticle = async () => {
      if (!slug) return;
      try {
        const data = await api.getArticleBySlug(slug);
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
        <Loader className="w-10 h-10 text-[#E5252A] animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-[#1A1A1A] min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-4">Artikel Tidak Ditemukan</h1>
        <p className="text-gray-400 mb-8">Maaf, artikel yang Anda cari tidak tersedia atau telah dipindahkan.</p>
        <Link to="/articles" className="bg-[#E5252A] hover:bg-red-700 text-white px-6 py-3 rounded font-bold transition-colors">
          Kembali ke Daftar Artikel
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen pt-24 pb-20 font-sans text-gray-300">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Breadcrumb & Back Link */}
        <div className="mb-8">
          <Link to="/articles" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Kembali ke Artikel
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#E5252A]/20 text-[#E5252A] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border border-[#E5252A]/30">
              {article.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 border-b border-gray-800 pb-6">
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#E5252A]" />
              <span className="font-medium text-gray-300">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#E5252A]" />
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <button className="flex items-center gap-2 hover:text-white transition-colors ml-auto">
              <Share2 size={16} />
              <span>Bagikan</span>
            </button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="w-full aspect-video rounded-xl overflow-hidden mb-12 shadow-2xl border border-gray-800">
          <img 
            src={article.imageUrl || 'https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg'} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="ql-snow mb-16">
          <article className="article-content ql-editor prose prose-invert prose-lg max-w-none leading-relaxed !p-0"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Article Footer & Tags */}
        {article.tags && article.tags.length > 0 && (
          <footer className="border-t border-gray-800 pt-8 mt-12">
            <div className="flex flex-wrap items-center gap-2">
              <Tag size={18} className="text-gray-500 mr-2" />
              {article.tags.map((tag: string) => (
                <span key={tag} className="bg-[#232323] text-gray-400 px-3 py-1 text-sm rounded-full border border-gray-700 hover:border-[#E5252A] hover:text-white cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </footer>
        )}

      </div>
    </div>
  );
};

export default ArticleDetailPage;
