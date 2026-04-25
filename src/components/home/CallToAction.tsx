import React from 'react';
import { MessageCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const WA_NUMBER = '628176454312';

const stats = [
  { value: '3.500+', label: 'Intervensi Kebakaran' },
  { value: '450+', label: 'Dinas Dilengkapi' },
  { value: '28', label: 'Provinsi Tercakup' },
  { value: '15+', label: 'Tahun Pengalaman' },
];

const CallToAction: React.FC = () => {
  const handleWA = () => {
    const message = encodeURIComponent(
      'Halo ATSAKA, saya ingin meminta penawaran harga peralatan pemadam kebakaran hutan.'
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section className="py-0 bg-gray-900">
      {/* Stats Bar */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center py-8 px-4 border-r last:border-r-0 border-gray-700"
              >
                <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main CTA */}
      <div className="py-24 bg-gradient-to-br from-red-700 via-red-600 to-red-500 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Siap Mendapatkan Penawaran Alat Pemadam Kebakaran Hutan Terbaik?
            </h2>
            <p className="text-xl text-red-100 mb-10 leading-relaxed max-w-3xl mx-auto">
              Konsultasikan kebutuhan spesifik instansi Anda dengan tim ahli ATSAKA. Kami siap membantu memperkuat sistem pertahanan karhutla Anda dengan teknologi teruji.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleWA}
                className="inline-flex items-center justify-center gap-3 bg-white text-red-600 font-bold py-4 px-8 rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                <MessageCircle size={22} />
                Minta Penawaran Harga
              </button>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white/10 transition-all duration-200 text-lg"
              >
                <BookOpen size={22} />
                Lihat Katalog Produk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
