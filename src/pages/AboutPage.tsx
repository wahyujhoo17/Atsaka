import React from "react";
import { Shield, Target, Zap, Milestone, Building2 } from "lucide-react"; // Added more icons for variety

const AboutPage: React.FC = () => {
  // Data for the timeline section
  const timelineEvents = [
    {
      year: "2010",
      title: "Pendirian ATSAKA",
      description:
        "ATSAKA didirikan sebagai divisi khusus PT. Sinar Surya Semestaraya untuk menjawab tantangan kebakaran hutan di Indonesia.",
      imageUrl:
        "https://images.pexels.com/photos/3856487/pexels-photo-3856487.jpeg",
      alt: "Tim pendiri ATSAKA",
      icon: Building2,
    },
    {
      year: "2014",
      title: "Kontrak Besar Pertama",
      description:
        "Meraih kontrak signifikan pertama dengan Badan Nasional Penanggulangan Bencana (BNPB).",
      imageUrl:
        "https://images.pexels.com/photos/2661279/pexels-photo-2661279.jpeg",
      alt: "Kerjasama dengan BNPB",
      icon: Milestone,
    },
    {
      year: "2018",
      title: "Ekspansi Fasilitas",
      description:
        "Memperluas fasilitas manufaktur dan meluncurkan lini produk pompa pemadam inovatif.",
      imageUrl:
        "https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg",
      alt: "Perluasan pabrik ATSAKA",
      icon: Zap,
    },
    {
      year: "2023",
      title: "Ekspansi Internasional",
      description:
        "Memperluas operasi ke pasar regional termasuk Malaysia, Thailand, dan Vietnam.",
      imageUrl:
        "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg",
      alt: "Ekspansi ATSAKA ke Asia Tenggara",
      icon: Milestone,
    },
    {
      year: "2025",
      title: "15 Tahun Melayani",
      description:
        "Merayakan 15 tahun dedikasi dalam inovasi dan pelayanan untuk penanggulangan kebakaran hutan.",
      imageUrl:
        "https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg",
      alt: "Perayaan 15 tahun ATSAKA",
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-28 pb-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
            Tentang ATSAKA
          </h1>
          <div className="w-20 h-1.5 bg-red-600 mx-auto mb-8 rounded-full"></div>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed">
            ATSAKA adalah merek lokal terdepan dalam solusi pemadam kebakaran
            hutan, bagian dari PT. Sinar Surya Semestaraya. Kami bangga
            menghadirkan produk pompa berkualitas tinggi dan peralatan pendukung
            yang dirancang khusus untuk kondisi di Indonesia.
          </p>
        </div>

        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Kisah Kami
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                Berdiri sejak 2010, ATSAKA lahir dari visi PT. Sinar Surya
                Semestaraya untuk menciptakan solusi lokal yang tangguh dalam
                menghadapi tantangan unik kebakaran hutan di Indonesia. Kami
                memulai dengan misi jelas: memproduksi peralatan berkualitas
                tinggi yang sesuai dengan medan lokal.
              </p>
              <p>
                Dari tim kecil yang terdiri dari insinyur dan ahli pemadam
                kebakaran, ATSAKA telah berkembang menjadi penyedia peralatan
                pemadam kebakaran hutan terkemuka di Asia Tenggara. Keberhasilan
                kami didorong oleh pemahaman mendalam tentang kondisi hutan
                lokal dan komitmen tak tergoyahkan pada kualitas.
              </p>
              <p>
                Saat ini, peralatan ATSAKA dipercaya oleh perusahaan pengelola
                hutan, instansi pemerintah, dan dinas pemadam kebakaran di
                seluruh Indonesia dan negara tetangga. Kami terus berinovasi,
                memperluas jangkauan produk, dengan fokus pada kualitas,
                ketahanan, dan performa optimal di medan yang menantang.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg"
              alt="Tim ATSAKA di lapangan"
              className="rounded-xl shadow-2xl w-full max-w-lg object-cover aspect-video"
              loading="lazy" // Added lazy loading
              decoding="async" // Added async decoding
            />
          </div>
        </div>

        {/* Vision & Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
          {/* Vision Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transform hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-full flex items-center justify-center shadow-md">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
              Visi Kami
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center flex-grow">
              Menjadi garda terdepan dalam pencegahan dan pengendalian bencana
              kebakaran hutan serta pelestarian alam. Melalui tagline{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                kuAT-kuaSA-merdeKA
              </span>
              , kami bercita-cita membawa produk lokal berkualitas ke panggung
              internasional.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transform hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full flex items-center justify-center shadow-md">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
              Misi Kami
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center flex-grow">
              Mengimplementasikan komitmen kami melalui penyediaan alat-alat
              penunjang yang handal untuk pencegahan, pengendalian kebakaran
              hutan, hingga restorasi alam. Komitmen ini terangkum dalam slogan
              kami:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                “ATSAKA”, ATasi berSAma KAmi.
              </span>
            </p>
          </div>
        </div>

        {/* Company Timeline */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-gray-900 dark:text-white">
            Perjalanan Kami
          </h2>
          <div className="relative container mx-auto px-4">
            {/* Vertical Line (visible on md screens and up) */}
            <div className="hidden md:block absolute w-1 h-full bg-gradient-to-b from-red-300 to-red-500 dark:from-red-700/50 dark:to-red-900/50 top-0 left-1/2 transform -translate-x-1/2 rounded-full"></div>

            <div className="space-y-12 md:space-y-0">
              {timelineEvents.map((event, index) => (
                <div
                  key={index}
                  className={`md:flex items-center w-full mb-8 md:mb-0 group ${
                    index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  {/* Content Block */}
                  <div className="w-full md:w-5/12 px-2 md:px-4 py-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 md:group-hover:scale-105">
                      <img
                        src={event.imageUrl}
                        alt={event.alt}
                        className="w-full h-48 object-cover rounded-md mb-4 shadow-inner"
                        loading="lazy" // Added lazy loading
                        decoding="async" // Added async decoding
                      />
                      <span className="inline-block bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                        {event.year}
                      </span>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Dot & Icon (visible on md screens and up) */}
                  <div className="hidden md:flex w-auto md:w-2/12 items-center justify-center relative">
                    <div className="absolute w-4 h-4 rounded-full bg-red-500 border-4 border-white dark:border-gray-800 z-10 group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="absolute w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md z-0 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300">
                      <event.icon className="w-5 h-5 text-red-500" />
                    </div>
                  </div>

                  {/* Spacer (for alignment on md screens and up) */}
                  <div className="hidden md:block w-full md:w-5/12 px-2 md:px-4 py-4"></div>

                  {/* Horizontal Line (visible on sm screens) */}
                  <div className="md:hidden w-full h-0.5 bg-red-300 dark:bg-red-700/50 my-6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
