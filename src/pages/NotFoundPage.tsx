import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 animate-pulse">
            404
          </h1>
          <div className="mt-4 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            <Search className="w-6 h-6 animate-bounce" />
            <p className="text-xl font-medium">Halaman Tidak Ditemukan</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-12 space-y-3">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Maaf, halaman yang Anda cari tidak dapat ditemukan.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Halaman mungkin telah dipindahkan, dihapus, atau URL yang Anda
            masukkan salah.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Kembali ke Beranda
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Halaman Sebelumnya
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            Mungkin Anda mencari:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/products"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Produk Kami
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link
              to="/about"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Tentang Kami
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link
              to="/gallery"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Galeri
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link
              to="/contact"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Kontak
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
