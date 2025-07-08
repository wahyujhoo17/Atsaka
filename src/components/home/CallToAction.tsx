import React from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-red-600 to-red-500 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Meningkatkan Respons Kebakaran Hutan Anda?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Hubungi tim kami hari ini untuk mendiskusikan kebutuhan spesifik
            Anda dan temukan bagaimana peralatan ATSAKA dapat memperkuat
            kemampuan pemadaman kebakaran Anda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="secondary" size="lg">
              <Link to="/contact">Minta Penawaran</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:bg-opacity-10"
            >
              <Link to="/products">Jelajahi Produk</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
