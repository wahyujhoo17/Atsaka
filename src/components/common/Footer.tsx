import React from "react";
import { Link, useLocation } from "react-router-dom";
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
  const { pathname } = useLocation();
  // Homepage and product detail pages end with the red CTA section already
  const endsWithRedCta = pathname === "/" || pathname.startsWith("/products/");

  return (
    <footer className="bg-[#1a1a1c] text-white pb-24 md:pb-8">
      {/* Red accent strip; skipped where the red CTA section already sits right above */}
      {!endsWithRedCta && (
        <div className="h-12 md:h-16 bg-gradient-to-r from-red-600 via-red-600 to-orange-500" />
      )}
      <div className="container mx-auto px-5 md:px-4 pt-12 pb-6 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 lg:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-4 space-y-5 md:space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 group-hover:border-red-500/50 transition-all duration-300">
                <img
                  src="/img/logo.png"
                  alt="ATSAKA Logo"
                  className="w-8 h-8 transition-transform duration-500 group-hover:rotate-[360deg]"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-red-500 transition-colors">ATSAKA</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Divisi unggulan dari Atsaka yang menyediakan solusi pemadam kebakaran hutan berkualitas tinggi dan berstandar internasional.
            </p>
            <div className="flex space-x-3">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Linkedin, href: "#" },
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:-translate-y-1 transition-all duration-300 border border-white/5"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs md:text-sm mb-6 md:mb-7 uppercase tracking-[0.15em] relative inline-block">
              Tautan Cepat
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-red-600 rounded-full"></span>
            </h4>
            <ul className="space-y-3 md:space-y-4">
              {[
                { name: "Beranda", path: "/" },
                { name: "Produk", path: "/products" },
                { name: "About Us", path: "/company" },
                { name: "Artikel", path: "/articles" },
                { name: "Kontak", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs md:text-sm mb-6 md:mb-7 uppercase tracking-[0.15em] relative inline-block">
              Produk Kami
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-red-600 rounded-full"></span>
            </h4>
            <ul className="space-y-3 md:space-y-4">
              {[
                { name: "Mini Pump", path: "/products?category=pompa-mini" },
                { name: "Middle Pump", path: "/products?category=pompa-middle" },
                { name: "Master Pump", path: "/products?category=pompa-master" },
                { name: "Floating Pump", path: "/products?category=pompa-floating" },
                { name: "Kelengkapan Pemadam", path: "/products?category=aksesoris" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Certification Column */}
          <div className="col-span-2 lg:col-span-2">
            <h4 className="text-white font-bold text-xs md:text-sm mb-6 md:mb-7 uppercase tracking-[0.15em] relative inline-block">
              Sertifikasi
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-red-600 rounded-full"></span>
            </h4>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:block lg:space-y-4">
              {["TKDN", "Uji Lab Damkar SNI", "OEM Honda"].map((item) => (
                <li key={item} className="text-gray-400 text-sm flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-span-2 lg:col-span-2">
            <h4 className="text-white font-bold text-xs md:text-sm mb-6 md:mb-7 uppercase tracking-[0.15em] relative inline-block">
              Hubungi Kami
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-red-600 rounded-full"></span>
            </h4>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
              <li className="flex items-start space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 transition-colors">
                  <MapPin className="w-4 h-4 text-red-500 group-hover:text-white transition-colors" />
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Atsaka+Jalan+Raya+Condet+No.6+Balekambang+Kramatjati" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-xs leading-relaxed"
                >
                  <span className="font-semibold block text-white mb-1">Atsaka</span>
                  Jalan Raya Condet No.6, Jakarta Timur
                </a>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 transition-colors">
                  <Phone className="w-4 h-4 text-red-500 group-hover:text-white transition-colors" />
                </div>
                <a href="tel:+628176454312" className="text-gray-400 hover:text-white transition-colors text-xs">+62 817-6454-312</a>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 transition-colors">
                  <Mail className="w-4 h-4 text-red-500 group-hover:text-white transition-colors" />
                </div>
                <a href="mailto:sales@kliksinarsurya.com" className="text-gray-400 hover:text-white transition-colors text-xs break-all">sales@kliksinarsurya.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 md:mt-16 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} ATSAKA. Hak cipta dilindungi undang-undang.
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
