import React from 'react';
import { HomepageContent } from '../../data/homepageContent';

interface MitraSectionProps {
  content: HomepageContent['partners'];
}

const MitraSection: React.FC<MitraSectionProps> = ({ content }) => {
  return (
    <section className="py-12 md:py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-900 dark:text-white mb-8 md:mb-10">
          {content.headline}
        </h2>

        {/* Flex + justify-center keeps any number of partners centred, including a short last row */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-6xl mx-auto">
          {content.items.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="w-[calc(50%-0.375rem)] sm:w-52 h-20 px-4 flex items-center justify-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 transition-colors"
            >
              {partner.logo && (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className={
                    partner.showName
                      ? 'h-11 w-11 shrink-0 object-contain'
                      : 'max-h-12 max-w-full object-contain'
                  }
                  loading="lazy"
                />
              )}
              {(!partner.logo || partner.showName) && (
                <span
                  className={`text-sm font-semibold text-gray-700 dark:text-gray-300 leading-tight line-clamp-2 ${
                    partner.logo ? 'text-left' : 'text-center'
                  }`}
                >
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MitraSection;
