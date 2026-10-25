import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HomepageContent, whatsappLink } from '../../data/homepageContent';
import { highlightText } from '../../lib/highlightText';
import { useCategoryChips, useProductCards } from '../../lib/useProductCards';

interface ProductHighlightProps {
  content: HomepageContent['solutions'];
  whatsappNumber: string;
}

const GAP_PX = 20; // matches gap-5

const ProductHighlight: React.FC<ProductHighlightProps> = ({ content, whatsappNumber }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [page, setPage] = useState(0);
  const [perView, setPerView] = useState(1);
  const desktopPerView = Math.min(Math.max(content.cardsPerView || 3, 1), 4);
  const categoryChips = useCategoryChips(content.categorySource, content.categories);
  const products = useProductCards(content.productSource, content.productSlugs || [], content.products) ?? [];

  const pageCount = Math.max(1, Math.ceil(products.length / perView));

  // Cards per page follows the same breakpoints as the card widths below
  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setPerView(width >= 1024 ? desktopPerView : width >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [desktopPerView]);

  const pageWidth = useCallback(() => {
    const card = trackRef.current?.firstElementChild as HTMLElement | null;
    return card ? (card.offsetWidth + GAP_PX) * perView : 1;
  }, [perView]);

  // Derive the current page from the scroll position (covers swipe, drag and buttons)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      setPage(atEnd ? pageCount - 1 : Math.round(track.scrollLeft / pageWidth()));
    };
    update();
    track.addEventListener('scroll', update, { passive: true });
    return () => track.removeEventListener('scroll', update);
  }, [pageCount, pageWidth]);

  const goToPage = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.min(Math.max(target, 0), pageCount - 1);
    track.scrollTo({ left: clamped * pageWidth(), behavior: 'smooth' });
  };

  // Mouse drag to scroll (touch devices already swipe natively)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !trackRef.current) return;
    drag.current = { active: true, startX: e.clientX, startScroll: trackRef.current.scrollLeft, moved: false };
    trackRef.current.style.scrollSnapType = 'none';
    trackRef.current.style.scrollBehavior = 'auto';
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !trackRef.current) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 5) drag.current.moved = true;
    trackRef.current.scrollLeft = drag.current.startScroll - delta;
  };
  const endDrag = () => {
    if (!drag.current.active || !trackRef.current) return;
    drag.current.active = false;
    const track = trackRef.current;
    track.style.scrollSnapType = '';
    track.style.scrollBehavior = '';
    goToPage(Math.round(track.scrollLeft / pageWidth()));
  };

  return (
    <section className="py-14 md:py-24 bg-gray-100 dark:bg-gray-950 relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            {highlightText(content.headline, 'text-red-600')}
          </h2>
          <div className="w-14 h-1 bg-red-600 mx-auto mb-5 rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
            {content.subheadline}
          </p>
        </div>

        {/* Product line shortcuts */}
        {categoryChips.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-12">
            {categoryChips.map((category) => (
              <Link
                key={category.title}
                to={category.link}
                title={category.description}
                className="px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs md:text-sm font-medium shadow-sm hover:border-red-500 hover:text-red-600 transition-colors"
              >
                {category.title}
              </Link>
            ))}
          </div>
        )}

        {/* Product slider */}
        <div className="min-h-[320px]">
          <div
            ref={trackRef}
            tabIndex={0}
            aria-roledescription="carousel"
            aria-label="Produk"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') goToPage(page + 1);
              if (e.key === 'ArrowLeft') goToPage(page - 1);
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            // Swallow the click that ends a drag so cards don't navigate by accident
            onClickCapture={(e) => {
              if (drag.current.moved) {
                e.preventDefault();
                e.stopPropagation();
                drag.current.moved = false;
              }
            }}
            className="flex gap-5 py-2 overflow-x-auto snap-x snap-mandatory scroll-smooth select-none cursor-grab active:cursor-grabbing focus:outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ '--per': desktopPerView } as React.CSSProperties}
          >
            {products.map((product, index) => (
              <article
                key={`${product.name}-${index}`}
                className="snap-start shrink-0 w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-(var(--per)-1)*1.25rem)/var(--per))] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-lg hover:border-red-200 transition-all"
              >
                <div className="flex justify-between gap-2 min-h-[130px]">
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{product.name}</h3>
                    {product.subtitle && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-1">({product.subtitle})</p>
                    )}
                  </div>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      draggable={false}
                      className="w-28 h-28 object-contain shrink-0 drop-shadow-lg"
                      loading="lazy"
                    />
                  )}
                </div>

                <dl className="mt-4 space-y-1.5 text-xs">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="grid grid-cols-[1fr_auto] gap-2">
                      <dt className="font-semibold text-gray-700 dark:text-gray-300">{spec.label}</dt>
                      <dd className="text-gray-600 dark:text-gray-400">: {spec.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-auto pt-6 flex items-center justify-between gap-2 text-xs font-semibold">
                  <Link
                    to={product.link}
                    draggable={false}
                    className="group inline-flex items-center gap-1 text-gray-900 dark:text-white hover:text-red-600"
                  >
                    Jelajahi produk
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href={whatsappLink(whatsappNumber, `Halo ATSAKA, saya ingin konsultasi mengenai produk ${product.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    draggable={false}
                    className="inline-flex items-center gap-1.5 text-gray-900 dark:text-white hover:text-green-600"
                  >
                    Konsultasi Sekarang
                    <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0012.05 0Z" />
                      </svg>
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination: counter, page segments, arrows */}
          {pageCount > 1 && (
            <div className="mt-8 flex items-center gap-4 md:gap-6">
              <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white shrink-0">
                {String(page + 1).padStart(2, '0')}
                <span className="text-gray-400 font-normal"> / {String(pageCount).padStart(2, '0')}</span>
              </span>
              <div className="flex-1 flex gap-1.5">
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className="group flex-1 py-2"
                    aria-label={`Halaman ${index + 1}`}
                    aria-current={index === page}
                  >
                    <span
                      className={`block h-1 rounded-full transition-colors duration-300 ${
                        index === page
                          ? 'bg-red-600'
                          : 'bg-gray-300 dark:bg-gray-700 group-hover:bg-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0}
                  className="w-11 h-11 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= pageCount - 1}
                  className="w-11 h-11 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label="Berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductHighlight;
