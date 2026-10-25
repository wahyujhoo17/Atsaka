import React from "react";
import { MessageCircle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { HomepageContent, whatsappLink } from "../../data/homepageContent";
import { highlightText } from "../../lib/highlightText";

interface CallToActionProps {
  content: HomepageContent["cta"];
  whatsappNumber: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ content, whatsappNumber }) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-red-700 via-red-600 to-orange-500 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Highlight is dark here because red would vanish on the red background */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight uppercase tracking-tight">
            {highlightText(content.headline, "text-gray-950")}
          </h2>
          <p className="text-base md:text-xl text-red-50 mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto">
            {content.description}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 max-w-sm sm:max-w-none mx-auto">
            <a
              href={whatsappLink(
                whatsappNumber,
                "Halo ATSAKA, saya ingin konsultasi mengenai peralatan pemadam kebakaran hutan.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-red-600 font-bold py-3.5 md:py-4 px-8 rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl text-base md:text-lg"
            >
              <MessageCircle size={22} />
              {content.primaryLabel}
            </a>
            <Link
              to={content.secondaryLink}
              className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white font-bold py-3.5 md:py-4 px-8 rounded-xl hover:bg-white/10 transition-all duration-200 text-base md:text-lg"
            >
              <BookOpen size={22} />
              {content.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
