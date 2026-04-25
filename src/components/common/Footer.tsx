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
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/img/logo.png"
                alt="ATSAKA Logo"
                className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-2xl font-semibold tracking-tight text-white">ATSAKA</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Divisi unggulan dari PT. Sinar Surya Semestaraya yang menyediakan solusi pemadam kebakaran hutan berkualitas tinggi.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-md">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-md">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-md">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-md">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider border-l-2 border-red-600 pl-3">Tautan Cepat</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-red-500 transition-colors text-sm">Beranda</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-red-500 transition-colors text-sm">Produk</Link></li>
              <li><Link to="/#about" className="text-gray-400 hover:text-red-500 transition-colors text-sm">Tentang Kami</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-red-500 transition-colors text-sm">Galeri</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-red-500 transition-colors text-sm">Kontak</Link></li>
            </ul>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider border-l-2 border-red-600 pl-3">Produk Kami</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors text-sm">Pompa Pemadam</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors text-sm">Peralatan Pemadam</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors text-sm">Aksesoris & Suku Cadang</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors text-sm">Layanan Perawatan</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors text-sm">Program Pelatihan</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider border-l-2 border-red-600 pl-3">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  Jl Raya Condet No 9, Balekambang, Kramat Jati Kota Adm Jakarta Timur DKI Jakarta 13530
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+62 8176454312</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">sales@kliksinarsurya.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} ATSAKA - PT. Sinar Surya Semestaraya. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex space-x-6 text-xs">
            <Link to="#" className="text-gray-500 hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link to="#" className="text-gray-500 hover:text-white transition-colors">Ketentuan Layanan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
