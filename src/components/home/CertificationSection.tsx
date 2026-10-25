import React from "react";
import { HomepageContent } from "../../data/homepageContent";
import { getContentIcon } from "../../lib/contentIcons";
import { highlightText } from "../../lib/highlightText";

interface CertificationSectionProps {
  content: HomepageContent["certification"];
}

const CertificationSection: React.FC<CertificationSectionProps> = ({ content }) => {
  return (
    <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center max-w-6xl mx-auto">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
              {highlightText(content.headline, "text-red-600")}
            </h2>

            <div
              className="mt-10 grid max-w-xl"
              style={{ gridTemplateColumns: `repeat(${Math.max(content.badges.length, 1)}, minmax(0, 1fr))` }}
            >
              {content.badges.map((badge, index) => {
                const Icon = getContentIcon(badge.icon);
                return (
                  <div
                    key={`${badge.label}-${index}`}
                    className={`flex flex-col items-center text-center px-3 ${
                      index > 0 ? "border-l border-gray-300 dark:border-gray-700" : ""
                    }`}
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center mb-3">
                      <Icon className="w-7 h-7 text-gray-800 dark:text-gray-200" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug whitespace-pre-line">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {content.image && (
            <div className="flex justify-center">
              <img
                src={content.image}
                alt="Pompa pemadam ATSAKA buatan Indonesia"
                className="w-auto max-w-full max-h-64 md:max-h-72 lg:max-h-80 object-contain drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
