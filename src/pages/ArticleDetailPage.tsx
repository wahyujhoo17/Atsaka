import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2 } from 'lucide-react';

// Menggunakan data dummy yang sama
const dummyArticles = [
  {
    id: 1,
    slug: 'pentingnya-sistem-pompa-kebakaran-bertekanan-tinggi',
    title: 'Pentingnya Sistem Pompa Kebakaran Bertekanan Tinggi di Area Industri',
    content: `
      <p class="mb-4">Kebakaran di area industri sering kali melibatkan material yang mudah terbakar dengan intensitas panas yang sangat tinggi. Dalam situasi kritis ini, suplai air standar dari hidran perkotaan sering kali tidak mencukupi untuk memadamkan api secara efektif. Inilah mengapa sistem pompa kebakaran bertekanan tinggi menjadi tulang punggung keselamatan industri.</p>
      
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">Mengapa Tekanan Tinggi Sangat Penting?</h3>
      <p class="mb-4">Pompa sentrifugal bertekanan tinggi dirancang untuk mengatasi "friction loss" (kehilangan tekanan akibat gesekan) saat air didorong melewati selang yang sangat panjang. Selain itu, tekanan yang tinggi memungkinkan air menembus inti api (deep-seated fire) dan memecah air menjadi kabut halus (fog pattern) yang sangat efektif menyerap panas.</p>
      
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">Komponen Kunci Pompa Industri</h3>
      <ul class="list-disc pl-5 mb-6 space-y-2">
        <li><strong>Impeller Bertingkat:</strong> Memberikan dorongan tekanan ganda pada air sebelum dikeluarkan.</li>
        <li><strong>Sistem Pendingin Mesin Independen:</strong> Menjamin mesin tetap bekerja optimal meski beroperasi berjam-jam dalam cuaca panas.</li>
        <li><strong>Rangka Pelindung (Roll Cage):</strong> Memudahkan mobilitas di medan berat dan melindungi komponen vital dari benturan.</li>
      </ul>
      
      <div class="bg-[#2a2a2a] border-l-4 border-[#E5252A] p-6 rounded-r-lg my-8 italic">
        "Kecepatan penanganan di 5 menit pertama kebakaran menentukan 90% hasil akhir. Pompa bertekanan tinggi memastikan suplai air maksimal tiba di titik api secepat mungkin."
      </div>
      
      <p>Memilih pompa yang tepat bukanlah pengeluaran, melainkan investasi perlindungan aset yang nilainya tak terhingga. ATSAKA menyediakan jajaran pompa sentrifugal spesifikasi militer dan industri yang siap menghadapi tantangan terberat Anda.</p>
    `,
    imageUrl: 'https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg',
    date: '12 Okt 2023',
    author: 'Atsaka Tim Ahli',
    category: 'Edukasi',
    tags: ['Pompa', 'Industri', 'Tekanan Tinggi', 'Keselamatan']
  },
  {
    id: 2,
    slug: 'perawatan-baju-pemadam-standar-nfpa',
    title: 'Panduan Perawatan Baju Pemadam (Turnout Gear) Sesuai Standar NFPA',
    content: '<p>Konten artikel perawatan baju pemadam (dummy)...</p>',
    imageUrl: 'https://images.pexels.com/photos/5765182/pexels-photo-5765182.jpeg',
    date: '05 Nov 2023',
    author: 'Divisi Safety',
    category: 'Panduan',
    tags: ['NFPA', 'Perawatan', 'Turnout Gear']
  },
  {
    id: 3,
    slug: 'inovasi-nozzle-pemadam-modern',
    title: 'Inovasi Nozzle Pemadam: Antara Jangkauan Air dan Perlindungan Tirai',
    content: '<p>Konten artikel inovasi nozzle (dummy)...</p>',
    imageUrl: 'https://images.pexels.com/photos/10183419/pexels-photo-10183419.jpeg',
    date: '18 Des 2023',
    author: 'Teknisi ATSAKA',
    category: 'Teknologi',
    tags: ['Nozzle', 'Teknologi', 'Peralatan']
  }
];

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Mencari artikel berdasarkan slug
  const article = dummyArticles.find(a => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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
              <span>{article.date}</span>
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
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none mb-16 text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Article Footer & Tags */}
        <footer className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-wrap items-center gap-2">
            <Tag size={18} className="text-gray-500 mr-2" />
            {article.tags.map(tag => (
              <span key={tag} className="bg-[#232323] text-gray-400 px-3 py-1 text-sm rounded-full border border-gray-700 hover:border-[#E5252A] hover:text-white cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </footer>

      </div>
    </div>
  );
};

export default ArticleDetailPage;
