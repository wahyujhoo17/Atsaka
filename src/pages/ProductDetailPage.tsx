import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MessageCircle, Package } from "lucide-react";
import Button from "../components/common/Button";
import ApplicationSection from "../components/home/ApplicationSection";
import ProductCard from "../components/products/ProductCard";
import CallToAction from "../components/home/CallToAction";
import { api } from "../lib/api";
import { Category, Product } from "../types";
import { cleanSpecGroups, highlightedSpecs, toSpecGroups } from "../lib/specGroups";
import { firstSentence, getFeatureIcon, toProductDetails } from "../lib/productDetails";
import { getContentIcon, getSpecIcon } from "../lib/contentIcons";
import { HomepageContent, mergeHomepageContent, whatsappLink } from "../data/homepageContent";

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-center mb-8 md:mb-10">
    <h2 className="text-lg md:text-2xl font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">
      {children}
    </h2>
    <div className="w-12 h-1 bg-red-600 mx-auto mt-3 rounded-full" />
  </div>
);

const SpecCallout: React.FC<{ spec: { label: string; value: string }; align: "left" | "right" }> = ({ spec, align }) => {
  const Icon = getSpecIcon(spec.label);
  return (
    <div className={`flex items-center gap-3 lg:gap-4 ${align === "right" ? "lg:flex-row-reverse lg:text-right" : ""}`}>
      <div className="w-11 h-11 lg:w-14 lg:h-14 shrink-0 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 lg:w-7 lg:h-7 text-gray-800 dark:text-gray-200" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {spec.label}
        </div>
        <div className="text-lg lg:text-3xl font-extrabold text-red-600 leading-tight">{spec.value}</div>
      </div>
    </div>
  );
};

const ProductDetailPage: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [homepage, setHomepage] = useState<HomepageContent>(mergeHomepageContent(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) {
        setError("Product slug is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await api.getProductBySlug(productSlug);

        if (!data) {
          setError("Product not found");
        } else {
          // Transform data to match Product interface
          const transformedProduct: Product = {
            id: data.id,
            name: data.name,
            slug: data.slug,
            category: data.category,
            description: data.description || "",
            features: data.features || [],
            imageUrl: data.imageUrl || "",
            imageUrls: data.imageUrls || [],
            specifications: data.specifications || {},
            subtitle: data.subtitle || "",
            details: data.details || null,
          };
          setProduct(transformedProduct);
          setActiveImage(0);
          setActiveTab(0);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  // Breadcrumb categories, and the shared applications / CTA content from the homepage
  useEffect(() => {
    api.getCategories().then((data) => setCategories(data || [])).catch(() => setCategories([]));
    api.getProducts().then((data) => setAllProducts(data || [])).catch(() => setAllProducts([]));
    api
      .getContent("homepage")
      .then((result) => setHomepage(mergeHomepageContent(result.data)))
      .catch(() => undefined);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-28 pb-16">
        <div className="container mx-auto px-4 animate-pulse">
          <div className="h-3 w-48 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="mx-auto mt-10 h-12 w-72 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="mx-auto mt-10 aspect-[4/3] max-w-xl rounded-2xl bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Produk Tidak Ditemukan
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Produk yang Anda cari tidak ada atau telah dihapus.
          </p>
          <Link to="/products">
            <Button>Kembali ke Produk</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = [...new Set([product.imageUrl, ...(product.imageUrls || [])].filter(Boolean))];
  const details = toProductDetails(product.details);
  const tagline = details.tagline || firstSentence(product.description);
  const keySpecs = highlightedSpecs(product.specifications);
  const leftSpecs = keySpecs.slice(0, Math.ceil(keySpecs.length / 2));
  const rightSpecs = keySpecs.slice(Math.ceil(keySpecs.length / 2));
  const allSpecGroups = cleanSpecGroups(toSpecGroups(product.specifications));
  // A group whose rows are all starred is the summary ("Ringkasan"); the rest are technical detail tabs
  const isSummaryGroup = (group: { items: { highlight?: boolean }[] }) => group.items.every((item) => item.highlight);
  const specGroups = allSpecGroups.filter((group) => !isSummaryGroup(group));
  const currentGroup = specGroups[Math.min(activeTab, specGroups.length - 1)];
  const features = product.features.filter(Boolean);
  const reasons = (details.reasons || []).filter((reason) => reason.title);
  const badges = (details.badges || []).filter((badge) => badge.label);

  const parentOf = (slug: string) => categories.find((cat) => cat.slug === slug)?.parentId || null;
  const relatedScore = (other: Product) =>
    other.category === product.category ? 0 : parentOf(other.category) && parentOf(other.category) === parentOf(product.category) ? 1 : 2;
  const relatedProducts = allProducts
    .filter((other) => other.slug !== product.slug)
    .sort((x, y) => relatedScore(x) - relatedScore(y))
    .slice(0, 4);
  const categoryName = (slug: string) => categories.find((cat) => cat.slug === slug)?.name || "";

  // Breadcrumb: the product's category and its parents
  const trail: Category[] = [];
  let crumb = categories.find((cat) => cat.slug === product.category);
  while (crumb && trail.length < 5) {
    trail.unshift(crumb);
    const parentId = crumb.parentId;
    crumb = parentId ? categories.find((cat) => cat.id === parentId) : undefined;
  }

  const showImage = (index: number) => {
    const next = (index + images.length) % images.length;
    setActiveImage(next);
    const thumb = thumbsRef.current?.children[next] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  // Spec table rows split into two columns on large screens
  const half = currentGroup ? Math.ceil(currentGroup.items.length / 2) : 0;
  const specColumns = currentGroup ? [currentGroup.items.slice(0, half), currentGroup.items.slice(half)] : [];

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* ---------- Hero ---------- */}
      <section className="relative pt-24 md:pt-28 pb-10 md:pb-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-5 md:px-4">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-red-600">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-red-600">Produk</Link>
            {/* Only the product's own category; the full parent chain made the trail too long */}
            {trail.slice(-1).map((cat) => (
              <React.Fragment key={cat.id}>
                <ChevronRight className="w-3 h-3" />
                <Link to={`/products?category=${cat.slug}`} className="hover:text-red-600">{cat.name}</Link>
              </React.Fragment>
            ))}
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-gray-900 dark:text-white">{product.name}</span>
          </nav>

          <div className="text-center mt-6 md:mt-4">
            {product.subtitle && (
              <p className="text-[11px] md:text-sm font-bold uppercase tracking-[0.2em] text-red-600">
                {product.subtitle}
              </p>
            )}
            <h1 className="mt-2 text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase tracking-tight text-gray-900 dark:text-white">
              {product.name}
            </h1>
            {tagline && (
              <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{tagline}</p>
            )}
          </div>

          {/* Image with key specs on both sides (stacked under the image on phones) */}
          <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,40rem)_1fr] items-center gap-8 lg:gap-6">
            <div className="hidden lg:flex flex-col gap-12 xl:pl-10">
              {leftSpecs.map((spec) => <SpecCallout key={spec.label} spec={spec} align="left" />)}
            </div>

            <div className="relative h-[34vh] min-h-[220px] sm:h-[40vh] lg:h-[46vh] max-h-[520px]">
              {images.length > 0 ? (
                images.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${product.name} ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)] transition-opacity duration-500 ${
                      index === activeImage ? "opacity-100" : "opacity-0"
                    }`}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ))
              ) : (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-900">
                  <Package className="w-16 h-16 text-gray-300" strokeWidth={1} />
                </div>
              )}
            </div>

            <div className="hidden lg:flex flex-col gap-12 xl:pr-10">
              {rightSpecs.map((spec) => <SpecCallout key={spec.label} spec={spec} align="right" />)}
            </div>

            {keySpecs.length > 0 && (
              <div className="lg:hidden grid grid-cols-2 gap-x-4 gap-y-5">
                {keySpecs.map((spec) => <SpecCallout key={spec.label} spec={spec} align="left" />)}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => showImage(activeImage - 1)}
                className="hidden sm:flex w-9 h-9 shrink-0 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 items-center justify-center text-gray-600 hover:border-red-500 hover:text-red-600"
                aria-label="Gambar sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div ref={thumbsRef} className="flex gap-2.5 md:gap-3 overflow-x-auto py-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {images.map((src, index) => (
                  <button
                    key={src}
                    onClick={() => showImage(index)}
                    className={`shrink-0 w-16 h-14 md:w-24 md:h-[4.5rem] rounded-xl bg-white dark:bg-gray-900 p-1.5 border-2 transition-colors ${
                      index === activeImage
                        ? "border-gray-900 dark:border-white"
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-400"
                    }`}
                    aria-label={`Lihat gambar ${index + 1}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-contain" loading="lazy" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => showImage(activeImage + 1)}
                className="hidden sm:flex w-9 h-9 shrink-0 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 items-center justify-center text-gray-600 hover:border-red-500 hover:text-red-600"
                aria-label="Gambar berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={whatsappLink(homepage.whatsappNumber, `Halo ATSAKA, saya ingin konsultasi mengenai produk ${product.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-600/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Konsultasi Sekarang
            </a>
            <Link
              to={trail.length ? `/products?category=${trail[trail.length - 1].slug}` : "/products"}
              className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold uppercase tracking-wider hover:border-red-500 hover:text-red-600 transition-colors"
            >
              Produk Sejenis
            </Link>
          </div>

          {/* Certification / warranty strip */}
          {badges.length > 0 && (
            <div className="mt-10 md:mt-12 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm grid grid-cols-2 sm:grid-cols-3 lg:flex lg:divide-x divide-gray-200 dark:divide-gray-800">
              {badges.map((badge, index) => {
                const Icon = getContentIcon(badge.icon);
                return (
                  <div key={`${badge.label}-${index}`} className="lg:flex-1 flex items-center gap-3 px-4 py-4 lg:px-5 lg:py-5">
                    <Icon className="w-7 h-7 shrink-0 text-red-600" strokeWidth={1.5} />
                    <span className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug whitespace-pre-line">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ---------- Why this product: intro on the left, reason cards fill the rest of the width ---------- */}
      {(reasons.length > 0 || product.description) && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-5 md:px-4">
            <div className={`grid grid-cols-1 gap-8 lg:gap-12 ${reasons.length > 0 ? "lg:grid-cols-12" : ""}`}>
              <div className={reasons.length > 0 ? "lg:col-span-4 lg:sticky lg:top-28 self-start" : "max-w-4xl"}>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">Keunggulan</span>
                <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Mengapa Memilih {product.name}?
                </h2>
                <div className="w-12 h-1 bg-red-600 mt-4 rounded-full" />
                {product.description && (
                  <p className="mt-5 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {product.description.replace(/\s*\n\s*/g, " ")}
                  </p>
                )}
              </div>
              {reasons.length > 0 && (
                <div className={`lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 ${reasons.length >= 3 && reasons.length !== 4 ? "xl:grid-cols-3" : ""}`}>
                  {reasons.map((reason, index) => (
                    <div key={`${reason.title}-${index}`} className="group flex rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow sm:flex-col">
                      <div className="w-28 shrink-0 sm:w-auto sm:aspect-[16/10] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                        {reason.image && (
                          <img src={reason.image} alt={reason.title} className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        )}
                      </div>
                      <div className="p-4 md:p-5">
                        <h3 className="font-bold text-gray-900 dark:text-white leading-snug">{reason.title}</h3>
                        {reason.description && (
                          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{reason.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Key features ---------- */}
      {features.length > 0 && (
        <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-5 md:px-4">
            <SectionTitle>Fitur Utama</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-flow-col lg:auto-cols-fr gap-y-6">
              {features.map((feature, index) => {
                const Icon = getFeatureIcon(feature);
                return (
                  <div key={index} className="flex flex-col items-center text-center px-3 lg:border-l first:border-l-0 border-gray-200 dark:border-gray-800">
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-red-600 mb-3" strokeWidth={1.5} />
                    <p className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">{feature}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Specifications: summary tiles, then technical detail tabs ---------- */}
      {(keySpecs.length > 0 || specGroups.length > 0) && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-5 md:px-4">
            <SectionTitle>Spesifikasi</SectionTitle>

            {keySpecs.length > 0 && (
              <div className="mb-8 md:mb-10">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Ringkasan</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-flow-col lg:auto-cols-fr gap-3">
                  {keySpecs.map((spec) => {
                    const Icon = getSpecIcon(spec.label);
                    return (
                      <div key={spec.label} className="flex items-center gap-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm px-4 py-4 md:px-5">
                        <div className="w-10 h-10 md:w-11 md:h-11 shrink-0 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-red-600" strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] md:text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 truncate">{spec.label}</div>
                          <div className="text-base md:text-xl font-bold text-gray-900 dark:text-white truncate">{spec.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {specGroups.length > 0 && (
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Detail Teknis</h3>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                  {specGroups.length > 1 && (
                    <div className="flex overflow-x-auto bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist">
                      {specGroups.map((group, index) => (
                        <button
                          key={`${group.title}-${index}`}
                          role="tab"
                          aria-selected={index === activeTab}
                          onClick={() => setActiveTab(index)}
                          className={`relative flex-1 min-w-max px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                            index === activeTab
                              ? "text-red-600 bg-white dark:bg-gray-900"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          {group.title || "Spesifikasi"}
                          <span className="ml-1.5 text-xs font-normal text-gray-400">{group.items.length}</span>
                          {index === activeTab && <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-gray-100 dark:divide-gray-800">
                    {specColumns.map((column, columnIndex) => (
                      <dl key={columnIndex} className="px-5 md:px-8 py-2 lg:py-4">
                        {column.map((item, itemIndex) => (
                          <div
                            key={`${item.label}-${itemIndex}`}
                            className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-800 text-sm"
                          >
                            <dt className="font-semibold text-gray-900 dark:text-white">{item.label}</dt>
                            <dd className="text-gray-600 dark:text-gray-300">{item.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------- Shared homepage sections ---------- */}
      {homepage.applications.visible && <ApplicationSection content={homepage.applications} />}

      {/* ---------- Other products ---------- */}
      {relatedProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-5 md:px-4">
            <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">Jelajahi</span>
                <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Produk Lainnya
                </h2>
              </div>
              <Link
                to="/products"
                className="shrink-0 text-sm font-semibold text-gray-900 dark:text-white hover:text-red-600 inline-flex items-center gap-1"
              >
                Semua Produk <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {relatedProducts.map((other) => (
                <ProductCard key={other.id} product={other} categoryName={categoryName(other.category)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {homepage.cta.visible && <CallToAction content={homepage.cta} whatsappNumber={homepage.whatsappNumber} />}
    </div>
  );
};

export default ProductDetailPage;
