import React from "react";
import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";

const ContactPage: React.FC = () => {
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
      </div>
    </div>
  );
};

export default ContactPage;
