import React from "react";
import { HomepageContent } from "../../data/homepageContent";
import { getContentIcon } from "../../lib/contentIcons";
import { highlightText } from "../../lib/highlightText";

interface ApplicationSectionProps {
  content: HomepageContent["applications"];
}

const ApplicationSection: React.FC<ApplicationSectionProps> = ({ content }) => {
  return (
    <section className="py-14 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 md:mb-14 tracking-tight">
          {highlightText(content.headline, "text-red-600")}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {content.items.map((item, index) => {
            const Icon = getContentIcon(item.icon);
            return (
              <div
                key={`${item.title}-${index}`}
                className="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="relative h-28 sm:h-44 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white/20" strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div className="relative px-3 pb-4 pt-7 sm:px-5 sm:pb-6 sm:pt-9">
                  <div className="absolute -top-5 left-3 w-10 h-10 sm:-top-7 sm:left-5 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-gray-800 border-2 border-red-100 dark:border-red-900/50 shadow-md flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug">{item.title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ApplicationSection;
