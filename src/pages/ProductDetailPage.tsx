import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import Button from "../components/common/Button";
import { products } from "../data/products";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({
  src,
  alt,
  className,
}) => {
  return <img src={src} alt={alt} className={className} loading="lazy" />;
};

const CustomArrow: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  icon: React.ElementType;
}> = ({ className, style, onClick, icon: Icon }) => {
  return (
    <div
      className={`${className} custom-slick-arrow`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
  );
};

const ProductDetailPage: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const product = products.find((p) => p.slug === productSlug);

  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);
  const slider1Ref = useRef<Slider>(null);
  const slider2Ref = useRef<Slider>(null);

  useEffect(() => {
    setNav1(slider1Ref.current);
    setNav2(slider2Ref.current);
  }, []);

  if (!product) {
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

  const mainSliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    infinite: true,
    speed: 500,
    prevArrow: <CustomArrow icon={ChevronLeft} />,
    nextArrow: <CustomArrow icon={ChevronRight} />,
    asNavFor: nav2,
  };

  const thumbSliderSettings = {
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: nav1,
    dots: false,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
    infinite: product.imageUrls.length > 5,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow:
            product.imageUrls.length < 4 ? product.imageUrls.length : 4,
          infinite: product.imageUrls.length > 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow:
            product.imageUrls.length < 4 ? product.imageUrls.length : 4,
          infinite: product.imageUrls.length > 4,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow:
            product.imageUrls.length < 3 ? product.imageUrls.length : 3,
          infinite: product.imageUrls.length > 3,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16 md:pt-24 md:pb-20 mt-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Kembali ke Produk
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            <div className="lg:col-span-2 p-4 sm:p-5 bg-gray-50 dark:bg-gray-800/50">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <>
                  <div className="relative mb-3 product-main-slider">
                    <Slider {...mainSliderSettings} ref={slider1Ref}>
                      {product.imageUrls.map((url, index) => (
                        <div
                          key={`main-${index}`}
                          className="outline-none focus:outline-none"
                        >
                          <div className="aspect-w-4 aspect-h-3 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                            <LazyImage
                              src={url}
                              alt={`${product.name} - Gambar ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>

                  {product.imageUrls.length > 1 && (
                    <div className="product-thumb-slider -mx-1">
                      <Slider {...thumbSliderSettings} ref={slider2Ref}>
                        {product.imageUrls.map((url, index) => (
                          <div
                            key={`thumb-${index}`}
                            className="px-1 outline-none focus:outline-none"
                          >
                            <div className="relative aspect-square cursor-pointer rounded overflow-hidden border-2 border-transparent slick-thumb-item group">
                              <LazyImage
                                src={url}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-300 slick-thumb-overlay"></div>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-w-4 aspect-h-3 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-500">Gambar tidak tersedia</span>
                </div>
              )}
            </div>

            <div className="lg:col-span-3 p-5 sm:p-6 lg:p-8 border-l border-gray-100 dark:border-gray-700/50">
              <span className="inline-block bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full mb-3">
                {product.category === "pump"
                  ? "Pompa Kebakaran"
                  : product.category === "equipment"
                  ? "Peralatan"
                  : "Aksesori"}
              </span>

              <h1 className="text-2xl lg:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                {product.name}
              </h1>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                {product.description}
              </p>

              <div className="mb-6">
                <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1.5">
                  Fitur Utama
                </h3>
                <ul className="space-y-1.5 pt-2.5">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 p-0.5 rounded-full mr-2 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-gray-700 dark:text-gray-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="sm">
                  <Link to="/contact">Minta Penawaran</Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Link to="/contact">Dukungan Teknis</Link>
                </Button>
              </div>
            </div>
          </div>

          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-5 sm:p-6 lg:p-8">
                <h3 className="text-lg lg:text-xl font-bold mb-5 text-gray-900 dark:text-white">
                  Spesifikasi Teknis
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <li
                        key={key}
                        className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700/50 pb-3"
                      >
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-4 flex-shrink-0">
                          {key}
                        </span>
                        <span className="text-sm font-semibold text-gray-800 dark:text-white text-right">
                          {value}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
        </div>
      </div>
      <style>{`
        .product-main-slider .slick-arrow {
            z-index: 10;
            width: 36px;
            height: 36px;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            display: flex !important;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease, opacity 0.3s ease;
            opacity: 0;
        }
        .product-main-slider:hover .slick-arrow {
             opacity: 0.8;
        }
        .product-main-slider .slick-arrow:hover {
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 1;
        }
        .product-main-slider .slick-prev {
            left: 12px;
        }
        .product-main-slider .slick-next {
            right: 12px;
        }
        .product-main-slider .slick-prev:before,
        .product-main-slider .slick-next:before {
            content: none;
        }

        .product-thumb-slider .slick-slide {
            opacity: 0.6;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform: scale(0.92);
        }
        .product-thumb-slider .slick-current {
            opacity: 1;
            transform: scale(1);
        }
        .product-thumb-slider .slick-current .slick-thumb-item {
            border-color: #EF4444;
            box-shadow: 0 0 0 1.5px #EF4444;
        }
        .product-thumb-slider .slick-current .slick-thumb-overlay {
            background-color: transparent !important;
        }
        .product-thumb-slider .slick-track {
             display: flex;
             align-items: center;
        }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;
