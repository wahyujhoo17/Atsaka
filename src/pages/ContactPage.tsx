import React from "react";
import { MessageCircle } from "lucide-react";
import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";

const ContactPage: React.FC = () => {
  const handleWhatsAppClick = () => {
    // Nomor WhatsApp perusahaan (ganti dengan nomor yang sesuai)
    const phoneNumber = "6281234567890"; // Format: 62 (kode negara) + nomor tanpa 0 di depan
    const message =
      "Halo, saya tertarik dengan produk ATSAKA. Bisakah Anda memberikan informasi lebih lanjut?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Hubungi Kami
          </h1>
          <div className="w-16 h-1 bg-red-500 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            Punya pertanyaan tentang produk kami atau butuh penawaran? Tim kami
            siap membantu Anda. Isi formulir di bawah ini atau hubungi kami
            langsung melalui telepon atau email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContactForm />
          <ContactInfo />
        </div>

        <div className="mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <h3 className="text-xl font-bold p-6 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              Lokasi Kami
            </h3>
            <div className="h-96">
              <iframe
                src="https://www.google.com/maps?q=Jl.+Raya+Condet+No.6,+RT.2/RW.1,+Balekambang,+Kec.+Kramat+jati,+Kota+Jakarta+Timur,+Daerah+Khusus+Ibukota+Jakarta+13530&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Lokasi ATSAKA"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Floating WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 group"
          aria-label="Chat via WhatsApp"
        >
          <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Chat via WhatsApp
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-20"></div>
        </button>
      </div>
    </div>
  );
};

export default ContactPage;
