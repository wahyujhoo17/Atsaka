import React from "react";
import {
  ShieldCheck,
  Target,
  Rocket,
  History as HistoryIcon,
  Award,
  ArrowRight,
  CheckCircle2,
  Handshake,
  FileCheck2,
  Search,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const CompanyPage: React.FC = () => {
  const handleWAClick = () => {
    const phoneNumber = "6287888491949";
    const message = "Halo ATSAKA, saya ingin meminta penawaran produk.";
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/162539/fire-firefighters-protection-environment-162539.jpeg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-gray-900/50 dark:to-gray-900"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Tentang <span className="text-red-600">ATSAKA</span>
          </h1>
          <div className="w-24 h-1.5 bg-red-600 mx-auto mb-8 rounded-full"></div>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            ATSAKA adalah merek lokal terdepan dalam solusi pemadam kebakaran
            hutan, bagian dari Atsaka. Kami bangga menghadirkan
            produk pompa berkualitas tinggi dan peralatan pendukung yang
            dirancang khusus untuk kondisi di Indonesia.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <img
                src="https://images.pexels.com/photos/3844788/pexels-photo-3844788.jpeg"
                alt="ATSAKA Production"
                className="relative rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  ATasi BerSAka Kami
                </h2>
                <div className="w-12 h-1 bg-red-600 mb-6"></div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  ATSAKA merupakan merek lokal yang bergerak di bidang alat
                  pemadam kebakaran hutan yang dinaungi oleh{" "}
                  <span className="font-bold">Atsaka</span>.
                  ATSAKA memiliki berbagai produk macam-macam pompa lokal yang
                  berkualitas dan alat-alat pendukung di bidang pemadam
                  kebakaran hutan.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mt-4 font-medium italic">
                  ATSAKA berkomitmen dalam membantu pencegahan hingga
                  pengendalian dalam bencana kebakaran hutan.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleWAClick}
                  className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2"
                >
                  Pelajari Inovasi Kami <ArrowRight size={20} />
                </button>
                <Link
                  to="/products"
                  className="px-8 py-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm"
                >
                  Katalog Produk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Visi & Misi
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Dedikasi kami untuk masa depan Indonesia yang lebih aman dari
              bencana kebakaran hutan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Vision Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                <Target size={160} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-8 backdrop-blur-md">
                  <Target size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-6">Visi Kami</h3>
                <p className="text-xl leading-relaxed font-medium opacity-90">
                  "Menjadi pelopor industri alat pemadam kebakaran hutan
                  portable yang tangguh, inovatif, dan berdaya saing global,
                  serta menjadi kebanggaan Indonesia dalam kontribusi nyata
                  terhadap perlindungan lingkungan dan keselamatan publik."
                </p>
              </div>
            </div>

            {/* Mission Section */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-1 gap-6">
              {[
                {
                  title: "KuAT",
                  desc: "Menghadirkan produk yang kuat (kuAT) dirancang khusus untuk kehandalan operasional di berbagai kondisi ekstrem lapangan.",
                  icon: ShieldCheck,
                  color: "blue",
                },
                {
                  title: "KuaSA",
                  desc: "Berinovasi secara berkelanjutan (kuaSA) dengan mengembangkan teknologi dan desain terkini demi efisiensi dan efektivitas pemadaman.",
                  icon: Rocket,
                  color: "purple",
                },
                {
                  title: "MerdeKA",
                  desc: "Mengutamakan produk lokal berkualitas internasional (merdeKA) sebagai wujud kemandirian bangsa dalam industri strategis.",
                  icon: Award,
                  color: "orange",
                },
              ].map((misi, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl hover:border-red-500 transition-all group flex items-start gap-6"
                >
                  <div
                    className={`p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform`}
                  >
                    <misi.icon size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {misi.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {misi.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mitra Section */}
      <section
        id="customer"
        className="py-20 bg-gray-900 text-white overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Handshake className="text-red-500" /> Dipercaya Oleh
              </h2>
              <p className="text-gray-400">
                Digunakan oleh instansi pemerintah, dinas pemadam kebakaran, dan
                perusahaan perkebunan di seluruh Indonesia.
              </p>
            </div>
            <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
              {/* Logo Placeholders */}
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <span className="text-xs font-bold tracking-widest text-white/50">
                    PARTNER {i}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center gap-4">
              <HistoryIcon className="text-red-600" /> Perjalanan Kami
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Membangun kemandirian alat pemadam kebakaran karya anak bangsa.
            </p>
          </div>

          <div className="max-w-5xl mx-auto relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

            <div className="space-y-20">
              {[
                {
                  year: "2017",
                  title: "Inisiasi & Riset Kebutuhan Pasar",
                  desc: "Kami memulai langkah dengan riset mendalam terhadap teknologi alat pemadam kebakaran. Fokus kami adalah menganalisis tantangan di lapangan untuk menciptakan solusi proteksi api yang tepat sasaran.",
                  img: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
                },
                {
                  year: "2022",
                  title: "Pengembangan Prototipe & Uji Internal",
                  desc: "Era pengembangan desain awal dan produksi generasi pertama. Melalui serangkaian uji coba internal yang ketat, kami memastikan setiap fitur pompa memenuhi standar kehandalan di kondisi ekstrem.",
                  img: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
                },
                {
                  year: "2024",
                  title: "Peresmian Atsaka",
                  desc: "Resmi berdiri sebagai entitas legal yang mandiri. Tahun ini menandai dimulainya produksi massal alat pemadam kebakaran hutan karya anak bangsa yang fokus pada kemandirian industri strategis.",
                  img: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg",
                },
                {
                  year: "Sekarang",
                  title: "Ekspansi Pasar & Inovasi Berkelanjutan",
                  desc: "Meningkatkan penetrasi pasar nasional dan terus memperbarui fitur pompa. Kami berkomitmen menghadirkan inovasi teknologi terbaru untuk efisiensi pemadaman dan perlindungan lingkungan Indonesia.",
                  img: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="md:w-1/2 w-full">
                    <div className="relative rounded-3xl overflow-hidden group shadow-xl">
                      <div className="absolute inset-0 bg-red-600/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-[300px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-6 left-6 z-20">
                        <span className="px-6 py-2 bg-red-600 text-white rounded-full font-bold text-lg shadow-lg">
                          {item.year}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 w-full space-y-4">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section
        id="certificates"
        className="py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h4 className="text-red-600 font-bold uppercase tracking-widest mb-4">
              Sertifikasi & Legalitas
            </h4>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Standar Kualitas yang Teruji dan Diakui
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Komitmen kami terhadap keamanan dibuktikan melalui sertifikasi
              nasional dan hasil uji laboratorium yang memenuhi standar
              tertinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                label: "TKDN",
                title: "Kepatuhan Produk Dalam Negeri",
                desc: "Memenuhi ambang batas komponen lokal untuk mendukung kemandirian industri nasional.",
                icon: FileCheck2,
              },
              {
                label: "Uji Lab Damkar",
                title: "Teruji Standar SNI",
                desc: "Lulus uji performa di Lab Damkar dengan parameter pengujian sesuai Standar Nasional Indonesia (SNI).",
                icon: ShieldCheck,
              },
              {
                label: "OEM Honda",
                title: "Engine Quality Assurance",
                desc: "Menggunakan penggerak resmi Honda untuk jaminan durabilitas mesin dan kemudahan suku cadang.",
                icon: CheckCircle2,
              },
            ].map((cert, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-700 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-600 group hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600 mb-8 group-hover:scale-110 transition-transform">
                  <cert.icon size={32} />
                </div>
                <span className="text-red-600 font-bold text-sm uppercase tracking-widest mb-2 block">
                  {cert.label}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {cert.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {cert.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
          <Rocket size={400} className="text-white" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-white text-xl md:text-2xl font-medium mb-10 leading-relaxed">
              Produk ATSAKA telah melalui pengujian dan memenuhi standar yang
              berlaku untuk mendukung kebutuhan operasional Anda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={handleWAClick}
                className="w-full sm:w-auto px-10 py-5 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-3 group"
              >
                <MessageCircle size={24} />
                Minta Penawaran
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <Link
                to="/products"
                className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3"
              >
                <Search size={24} />
                Cari Produk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyPage;
