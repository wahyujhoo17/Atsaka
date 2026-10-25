import React, { useRef, useEffect } from 'react';
import { HomepageContent } from '../../data/homepageContent';
import { getContentIcon } from '../../lib/contentIcons';
import { highlightText } from '../../lib/highlightText';

interface FeatureSectionProps {
  content: HomepageContent['features'];
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ content }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    featuresRef.current.forEach((feature) => {
      if (feature) observer.observe(feature);
    });

    return () => observer.disconnect();
  }, [content.items.length]);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-28 bg-gray-950 opacity-0 transition-opacity duration-1000 ease-in-out relative overflow-hidden"
    >
      <div className="container mx-auto px-5 md:px-4 relative z-10">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16 mb-8 md:mb-20 items-end">
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            {highlightText(content.headline, 'text-red-600')}
          </h2>
          <p className="text-gray-400 text-[15px] md:text-lg leading-relaxed">{content.subheadline}</p>
        </div>

        {/* Feature Cards: compact icon rows on phones, numbered columns from tablet up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:border-t border-white/10">
          {content.items.map((item, index) => {
            const Icon = getContentIcon(item.icon);
            return (
              <div
                key={`${item.title}-${index}`}
                ref={(el) => (featuresRef.current[index] = el)}
                className="group relative flex gap-4 py-5 border-b last:border-b-0 sm:block sm:border-b-0 sm:pt-10 sm:pb-8 sm:pr-8 lg:px-8 lg:first:pl-0 lg:border-l lg:first:border-l-0 border-white/10 transition-all duration-700 opacity-0 translate-y-8"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Red accent line that extends on hover */}
                <span className="hidden sm:block absolute top-0 left-0 lg:left-8 lg:group-first:left-0 h-0.5 w-10 bg-red-600 transition-all duration-500 group-hover:w-20" />
                <div className="hidden sm:block text-gray-600 text-sm font-mono mb-6">{String(index + 1).padStart(2, '0')}</div>
                <div className="shrink-0 w-11 h-11 rounded-xl bg-red-600/10 flex items-center justify-center sm:w-auto sm:h-auto sm:bg-transparent sm:rounded-none sm:block sm:mb-6">
                  <Icon className="w-5 h-5 sm:w-9 sm:h-9 text-red-500" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-3">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
