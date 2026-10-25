import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HomepageContent, whatsappLink } from "../../data/homepageContent";
import { getSpecIcon } from "../../lib/contentIcons";
import { highlightText } from "../../lib/highlightText";
import { useProductCards } from "../../lib/useProductCards";

interface HeroSectionProps {
  content: HomepageContent["hero"];
  whatsappNumber: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ content, whatsappNumber }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  // Background aspect ratio (width / height), read from the image once it loads
  const [bgRatio, setBgRatio] = useState(1376 / 768);
  const slides = useProductCards(content.productSource, content.productSlugs || [], content.slides) ?? [];
  const slide = slides[active] ?? slides[0];

  // Size of an object-cover image inside the section, using container query units
  const coverFrame: React.CSSProperties = {
    width: `max(100cqw, calc(100cqh * ${bgRatio}))`,
    height: `max(100cqh, calc(100cqw / ${bgRatio}))`,
  };

  // Zooms background and desktop product together, so the spotlight comes forward and the product stays on it
  const zoomStyle: React.CSSProperties = {
    transform: `scale(${content.bgZoom || 1})`,
    transformOrigin: `50% ${content.bgFocusY}%`,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const goTo = (index: number) => setActive((index + slides.length) % slides.length);

  // Autoplay; restarts after every manual change because `active` is a dependency
  useEffect(() => {
    if (paused || slides.length < 2 || !content.autoplaySeconds) return;
    const timer = setTimeout(() => goTo(active + 1), content.autoplaySeconds * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused, slides.length, content.autoplaySeconds]);

  const fadeIn = (delay: string) =>
    `transition-all duration-1000 ${delay} ${
      isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`;

  const consultHref = (name: string) =>
    whatsappLink(whatsappNumber, `Halo ATSAKA, saya ingin konsultasi mengenai produk ${name}.`);

  const ctaButtons = slide && (
    <>
      <Link
        to={slide.link}
        className="group inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 text-xs tracking-wider uppercase transition-colors shadow-lg shadow-red-900/30"
      >
        {content.primaryCtaLabel}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
      <a
        href={consultHref(slide.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 border border-white/40 bg-white/5 hover:bg-white hover:text-gray-900 backdrop-blur-sm text-white font-bold py-3 px-6 text-xs tracking-wider uppercase transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        {content.secondaryCtaLabel}
      </a>
    </>
  );

  return (
    <section
      className="relative min-h-screen bg-gray-950 flex flex-col overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background + desktop product share one "cover" frame (same maths as object-cover),
          so product positions in % of the image stay on the spotlight at any screen size */}
      <div className="absolute inset-0 z-0 overflow-hidden [container-type:size]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={coverFrame}>
          <div className="w-full h-full" style={zoomStyle}>
            {content.backgroundImage && (
              <img
                src={content.backgroundImage}
                alt=""
                className="w-full h-full"
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget;
                  if (naturalWidth && naturalHeight) setBgRatio(naturalWidth / naturalHeight);
                }}
              />
            )}
          </div>
        </div>
        {/* Darken top so the headline stays readable over the spotlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-gray-950/80 via-gray-950/30 to-transparent" />
        {/* Darken bottom for the specs bar */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />

        {/* Desktop product images, drawn above the gradients */}
        <div
          className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={coverFrame}
        >
         <div className="relative w-full h-full" style={zoomStyle}>
          {slides.map((item, index) =>
            item.image ? (
              <div
                key={`${item.name}-${index}`}
                className="absolute -translate-x-1/2"
                style={{
                  left: `${content.productLeft}%`,
                  bottom: `${content.productBottom}%`,
                  height: `${content.productHeight}%`,
                }}
                aria-hidden={index !== active}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className={`h-full w-auto max-w-none object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.55)] transition-all duration-700 ease-out ${
                    index === active
                      ? "opacity-100 translate-x-0 scale-100"
                      : `opacity-0 scale-95 ${index < active ? "-translate-x-16" : "translate-x-16"}`
                  }`}
                />
              </div>
            ) : null,
          )}
         </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col container mx-auto px-4 pt-28 md:pt-32 pb-8">
        {/* Headline */}
        <div className={`text-center ${fadeIn("delay-0")}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            {highlightText(content.headline, "text-red-600")}
          </h1>
          <p className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {content.subheadline}
          </p>
        </div>

        {slide && (
          <>
            {/* Product stage */}
            <div
              className="relative flex-1 min-h-[280px] md:min-h-[360px] mt-4"
              onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const delta = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(delta) > 50) goTo(active + (delta < 0 ? 1 : -1));
                touchStartX.current = null;
              }}
            >
              {/* Mobile/tablet product images, stacked so they can cross-fade (desktop ones live in the background frame) */}
              {slides.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className={`lg:hidden absolute inset-0 flex items-end justify-center pb-[4vh] transition-all duration-700 ease-out ${
                    index === active
                      ? "opacity-100 translate-x-0 scale-100"
                      : `opacity-0 scale-95 pointer-events-none ${index < active ? "-translate-x-16" : "translate-x-16"}`
                  }`}
                  aria-hidden={index !== active}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full h-[90%] w-auto max-w-[80%] lg:max-w-[45%] object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
                    />
                  )}
                </div>
              ))}

              {/* Slide numbers (desktop) */}
              {slides.length > 1 && (
                <div className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col gap-4">
                  {slides.map((item, index) => (
                    <button
                      key={`${item.name}-${index}`}
                      onClick={() => goTo(index)}
                      className={`flex items-center gap-3 text-xs font-semibold transition-colors ${
                        index === active ? "text-red-500" : "text-gray-500 hover:text-gray-300"
                      }`}
                      aria-label={`Lihat ${item.name}`}
                    >
                      {String(index + 1).padStart(2, "0")}
                      <span
                        className={`h-px transition-all duration-500 ${
                          index === active ? "w-10 bg-red-500" : "w-4 bg-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Product name + CTA (desktop) */}
              <div
                key={active}
                className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 max-w-xs"
                style={{ animation: "fadeInUp 0.6s ease both" }}
              >
                <h2 className="text-3xl xl:text-4xl font-extrabold text-white">{slide.name}</h2>
                {slide.subtitle && <p className="mt-2 text-gray-300">{slide.subtitle}</p>}
                <div className="mt-6 flex flex-col gap-3">{ctaButtons}</div>
              </div>

              {/* Arrows */}
              {slides.length > 1 && (
                <>
                  {/* Tablet only: desktop uses the slide numbers, phones swipe */}
                  <button
                    onClick={() => goTo(active - 1)}
                    className="absolute left-0 bottom-6 hidden md:flex lg:hidden w-10 h-10 rounded-full border border-white/30 text-white items-center justify-center hover:bg-white/10"
                    aria-label="Produk sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => goTo(active + 1)}
                    className="absolute right-0 bottom-6 hidden md:flex lg:hidden w-10 h-10 rounded-full border border-white/30 text-white items-center justify-center hover:bg-white/10"
                    aria-label="Produk berikutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Product name + CTA + dots (mobile/tablet) */}
            <div key={`m-${active}`} className="lg:hidden text-center" style={{ animation: "fadeInUp 0.5s ease both" }}>
              <h2 className="text-2xl font-extrabold text-white">{slide.name}</h2>
              {slide.subtitle && <p className="mt-1 text-sm text-gray-300">{slide.subtitle}</p>}
              <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">{ctaButtons}</div>
            </div>
            {slides.length > 1 && (
              <div className="lg:hidden flex justify-center gap-2 mt-5">
                {slides.map((item, index) => (
                  <button
                    key={`${item.name}-${index}`}
                    onClick={() => goTo(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === active ? "w-6 bg-red-600" : "w-1.5 bg-white/40"
                    }`}
                    aria-label={`Lihat ${item.name}`}
                  />
                ))}
              </div>
            )}

            {/* Specs of the active product */}
            {slide.specs.length > 0 && (
              <div
                key={`s-${active}`}
                className="mt-6 lg:mt-2 flex flex-wrap justify-center gap-y-5"
                style={{ animation: "fadeInUp 0.6s ease both" }}
              >
                {slide.specs.map((spec, index) => {
                  const Icon = getSpecIcon(spec.label);
                  return (
                    <div
                      key={`${spec.label}-${index}`}
                      className={`w-1/3 sm:w-auto flex flex-col items-center text-center px-3 sm:px-6 lg:px-8 ${
                        index > 0 ? "sm:border-l border-red-600/70" : ""
                      }`}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white/80 mb-2" strokeWidth={1.5} />
                      <span className="text-[9px] md:text-[11px] text-gray-400 uppercase tracking-wider leading-tight">
                        {spec.label}
                      </span>
                      <span className="mt-1 text-sm md:text-lg font-semibold text-white whitespace-nowrap">
                        {spec.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
