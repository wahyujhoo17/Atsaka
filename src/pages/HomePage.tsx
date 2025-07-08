import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import HeroSection from "../components/home/HeroSection";
import FeatureSection from "../components/home/FeatureSection";
import ProductHighlight from "../components/home/ProductHighlight";
import TestimonialSection from "../components/home/TestimonialSection";
import StatisticsSection from "../components/home/StatisticsSection";
import CallToAction from "../components/home/CallToAction";

const HomePage: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <ProductHighlight />
      <TestimonialSection />
      <StatisticsSection />
      <CallToAction />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-300 ${
          showScrollButton
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default HomePage;
