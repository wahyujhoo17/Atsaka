import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Info Perusahaan */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/img/logo.png" className="w-8 h-8" alt="ATSAKA Logo" />
              <span className="text-xl font-bold">ATSAKA</span>
            </div>
            <p className="text-gray-400 mb-4">
              Divisi unggulan dari PT. Sinar Surya Semestaraya yang menyediakan
              solusi pemadam kebakaran hutan berkualitas tinggi.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Tautan Cepat */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Produk
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Galeri
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Produk Kami */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produk Kami</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products?category=pump"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Pompa Pemadam
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=equipment"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Peralatan Pemadam
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=accessory"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Aksesoris & Suku Cadang
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Layanan Perawatan
                </Link>
              </li>
              <li>
                <Link
                  to="/training"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Program Pelatihan
                </Link>
              </li>
            </ul>
          </div>

          {/* Hubungi Kami */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Jl Raya Condet No 6 , Balekambang, Kramat jati Kota Adm
                  Jakarta Timur DKI Jakarta 13530
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-400">+62 8176454312</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                <a
                  href="mailto:info@atsaka.co.id"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  sales@kliksinarsurya.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} ATSAKA - PT. Sinar Surya
              Semestaraya. Hak cipta dilindungi undang-undang.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-gray-500 text-sm hover:text-red-500 transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link
                to="/terms"
                className="text-gray-500 text-sm hover:text-red-500 transition-colors"
              >
                Ketentuan Layanan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
