import { flattenSpecs, highlightedSpecs, SpecificationsData } from "../lib/specGroups";

// Homepage content editable from the admin panel ("Homepage" tab).
// Headlines support *text* to highlight that part (red) and line breaks with Enter.

export interface IconItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProductCardContent {
  name: string;
  subtitle: string;
  image: string;
  link: string;
  specs: { label: string; value: string }[];
}

export interface HomepageContent {
  whatsappNumber: string;
  hero: {
    visible: boolean;
    backgroundImage: string;
    headline: string;
    subheadline: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    autoplaySeconds: number;
    // Product placement on desktop, in % of the background image (so it stays on the spotlight)
    productBottom: number;
    productHeight: number;
    productLeft: number;
    // Background crop: zoom factor and the vertical point (in %) it zooms around
    bgZoom: number;
    bgFocusY: number;
    // Same switch as solutions: "database" reads the Products table, "manual" uses `slides`
    productSource: "database" | "manual";
    productSlugs: string[];
    slides: ProductCardContent[];
  };
  certification: {
    visible: boolean;
    headline: string;
    image: string;
    badges: { icon: string; label: string }[];
  };
  features: {
    visible: boolean;
    headline: string;
    subheadline: string;
    items: IconItem[];
  };
  applications: {
    visible: boolean;
    headline: string;
    items: (IconItem & { image: string })[];
  };
  partners: {
    visible: boolean;
    headline: string;
    // showName: put the name next to the logo (for square/round emblems)
    items: { name: string; logo: string; showName?: boolean }[];
  };
  solutions: {
    visible: boolean;
    headline: string;
    subheadline: string;
    // "database": one shortcut per product category that has products; "manual": `categories`
    categorySource: "database" | "manual";
    categories: { title: string; description: string; link: string }[];
    // "database": cards come from the Products table (productSlugs, or every pompa product when empty)
    // "manual": cards come from `products` below
    productSource: "database" | "manual";
    productSlugs: string[];
    // Cards per slider page on desktop (tablet shows 2, phone 1)
    cardsPerView: number;
    products: ProductCardContent[];
  };
  cta: {
    visible: boolean;
    headline: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
    secondaryLink: string;
  };
}

const DEFAULT_PRODUCTS: ProductCardContent[] = [
  {
    name: "Rikuga",
    subtitle: "Mini Portable High-Pressure Fire Pump",
    image: "/img/products/home/rikuga.webp",
    link: "/products/rikuga-gxh50",
    specs: [
      { label: "Berat", value: "9,5 kg" },
      { label: "Debit Air", value: "192,2 LPM" },
      { label: "Max Pressure", value: "5,2 Bar" },
      { label: "Straight Stream Reach", value: "32 meter" },
      { label: "Engine Power", value: "2,5 HP" },
    ],
  },
  {
    name: "Kaigun Pro",
    subtitle: "Portable High-Pressure Fire Floating Pump",
    image: "/img/products/home/kaigun-pro.webp",
    link: "/products/honda-gxv160",
    specs: [
      { label: "Berat", value: "32,6 kg" },
      { label: "Debit Air", value: "- LPM" },
      { label: "Max Pressure", value: "5,0 Bar" },
      { label: "Straight Stream Reach", value: "30 meter" },
      { label: "Engine Power", value: "4,3 HP" },
    ],
  },
  {
    name: "ATS GX430",
    subtitle: "",
    image: "/img/products/home/ats-gx430.webp",
    link: "/products/ats-gx430",
    specs: [
      { label: "Berat", value: "60 kg" },
      { label: "Debit Air", value: "520 LPM" },
      { label: "Max Pressure", value: "5,8 Bar" },
      { label: "Straight Stream Reach", value: "45 meter" },
      { label: "Engine Power", value: "13 HP" },
    ],
  },
  {
    name: "ATS GX690",
    subtitle: "",
    image: "/img/products/home/ats-gx690.webp",
    link: "/products/atsaka-engine-ats-gx690",
    specs: [
      { label: "Berat", value: "85 kg" },
      { label: "Debit Air", value: "1021 LPM" },
      { label: "Max Pressure", value: "8 Bar" },
      { label: "Straight Stream Reach", value: "45 meter" },
      { label: "Engine Power", value: "25 HP" },
    ],
  },
];

// Products-table slugs shown on the homepage by default, in order
const HOMEPAGE_PRODUCT_SLUGS = ["rikuga-gxh50", "honda-gxv160", "ats-gx430", "atsaka-engine-ats-gx690"];

export const defaultHomepageContent: HomepageContent = {
  whatsappNumber: "628176454312",
  hero: {
    visible: true,
    backgroundImage: "/img/bgonly.jpeg",
    headline: "*AT*ASI BER*SA*MA *KA*MI",
    subheadline:
      "Alat pemadam karhutla lokal berstandar global, dirancang untuk efektivitas nyata di lapangan.",
    primaryCtaLabel: "Jelajahi Produk",
    secondaryCtaLabel: "Konsultasi Sekarang",
    autoplaySeconds: 7,
    // Matches the floor spotlight in /img/bgonly.jpeg (ellipse centre ~50% x, ~64% y)
    productBottom: 33,
    productHeight: 32,
    productLeft: 50,
    // Zooming 1.4x around 44% moves the spotlight from ~64% down to ~72% of the frame
    bgZoom: 1.4,
    bgFocusY: 44,
    productSource: "database",
    productSlugs: HOMEPAGE_PRODUCT_SLUGS,
    slides: DEFAULT_PRODUCTS,
  },
  certification: {
    visible: true,
    headline: "Teruji. Tersertifikasi.\nTerpercaya.\n*100%* made in Indonesia",
    image: "/img/products/home/ats-gx690.webp",
    badges: [
      { icon: "award", label: "Bersertifikat\nTKDN" },
      { icon: "shield-check", label: "Lulus Uji Damkar\nBersertifikat SNI" },
      { icon: "badge-check", label: "OEM Honda\nTested" },
    ],
  },
  features: {
    visible: true,
    headline: "Dirancang untuk *Performa Nyata*",
    subheadline:
      "Setiap detail dirancang untuk menghadapi tantangan operasional di lapangan mulai dari mobilitas hingga kemudahan penggunaan.",
    items: [
      {
        icon: "zap",
        title: "Respons Lebih Cepat",
        description: "Ringkas dan mudah dibawa untuk mempercepat mobilisasi ke lokasi operasi.",
      },
      {
        icon: "gauge",
        title: "Performa Andal",
        description: "Memberikan tekanan dan aliran air yang optimal saat dibutuhkan.",
      },
      {
        icon: "mountain",
        title: "Siap di Berbagai Medan",
        description: "Dirancang untuk mendukung operasi di berbagai kondisi lapangan.",
      },
      {
        icon: "wrench",
        title: "Dukungan Purna Jual",
        description:
          "Garansi, layanan servis, dan ketersediaan suku cadang untuk mendukung operasional jangka panjang.",
      },
    ],
  },
  applications: {
    visible: true,
    headline: "Satu Solusi. Beragam Aplikasi.",
    items: [
      {
        icon: "trees",
        title: "Kebakaran Hutan",
        description: "Pemadaman cepat di area terpencil.",
        image:
          "https://images.pexels.com/photos/51951/forest-fire-fire-smoke-conservation-51951.jpeg?auto=compress&w=800",
      },
      {
        icon: "siren",
        title: "Operasi Damkar",
        description: "Respons cepat untuk kondisi darurat.",
        image: "/img/atsaka-operasi.png",
      },
      {
        icon: "waves",
        title: "Penanggulangan Banjir",
        description: "Distribusi air untuk situasi darurat.",
        image: "",
      },
      {
        icon: "factory",
        title: "Operasi Industri",
        description: "Suplai air untuk kebutuhan operasional.",
        image: "/img/atsaka-manufaktur.png",
      },
    ],
  },
  partners: {
    visible: true,
    headline: "Dipercaya oleh Instansi dan Industri di Seluruh Indonesia",
    items: [
      { name: "APP Sinarmas", logo: "" },
      { name: "KPN Corp", logo: "" },
      { name: "Dinas Lingkungan Hidup dan Kehutanan", logo: "" },
      { name: "BPBD", logo: "" },
      { name: "April Group", logo: "" },
      { name: "Manggala Agni", logo: "" },
    ],
  },
  solutions: {
    visible: true,
    headline: "Solusi untuk Setiap Kebutuhan Operasional",
    subheadline:
      "Mendukung kebutuhan pemadaman melalui lini pompa dan perlengkapan yang saling melengkapi.",
    categorySource: "database",
    categories: [
      { title: "Pompa Mini", description: "Pompa ringkas untuk mobilisasi cepat", link: "/products?category=pompa-mini" },
      { title: "Pompa Middle", description: "Performa optimal untuk berbagai operasi", link: "/products?category=pompa-middle" },
      { title: "Pompa Master", description: "Kapasitas tinggi untuk kebutuhan intensif", link: "/products?category=pompa-master" },
      { title: "Pompa Floating", description: "Pengambilan air langsung dari sumber terbuka", link: "/products?category=pompa-floating" },
      { title: "Kelengkapan Pemadam", description: "Melengkapi kebutuhan operasi pemadaman", link: "/products?category=aksesoris" },
    ],
    productSource: "database",
    productSlugs: HOMEPAGE_PRODUCT_SLUGS,
    cardsPerView: 3,
    products: DEFAULT_PRODUCTS,
  },
  cta: {
    visible: true,
    headline: "*AT*ASI BER*SA*MA *KA*MI.",
    description:
      "Dari kebakaran hutan hingga kebutuhan operasional industri, kami siap membantu menemukan solusi yang tepat untuk Anda.",
    primaryLabel: "Konsultasi Sekarang",
    secondaryLabel: "Jelajahi Produk",
    secondaryLink: "/products",
  },
};

// Saved content may predate newly added fields, so fill gaps from the defaults per section
export const mergeHomepageContent = (saved: Partial<HomepageContent> | null): HomepageContent => {
  if (!saved) return defaultHomepageContent;
  const merged = { ...defaultHomepageContent, ...saved } as HomepageContent;
  (Object.keys(defaultHomepageContent) as (keyof HomepageContent)[]).forEach((key) => {
    const fallback = defaultHomepageContent[key];
    if (typeof fallback === "object") {
      (merged as unknown as Record<string, unknown>)[key] = { ...fallback, ...(saved[key] as object) };
    }
  });
  return merged;
};

export interface DbProduct {
  name: string;
  slug: string;
  category: string;
  imageUrl?: string | null;
  imageUrls?: string[];
  specifications?: SpecificationsData;
  subtitle?: string | null;
}

// Without starred specs, guess the closest technical specs by label
const SPEC_FALLBACKS: [string, RegExp][] = [
  ["Berat", /weight|berat/i],
  ["Debit Air", /^flow rate$|debit/i],
  ["Max Pressure", /tekanan|pressure|shut off/i],
  ["Straight Stream Reach", /reach|jangkauan|performance/i],
  ["Engine Power", /power|hp/i],
];

const fallbackSpecs = (specifications: SpecificationsData) => {
  const items = flattenSpecs(specifications);
  return SPEC_FALLBACKS.flatMap(([label, pattern]) => {
    const item = items.find((spec) => pattern.test(spec.label));
    return item ? [{ label, value: item.value }] : [];
  });
};

// Converts a Products-table row into the card shape used on the homepage
export const productToCard = (product: DbProduct): ProductCardContent => ({
  name: product.name,
  subtitle: product.subtitle || "",
  image: product.imageUrl || product.imageUrls?.[0] || "",
  link: `/products/${product.slug}`,
  specs: (() => {
    // Starred rows from the product's technical specs, otherwise a best guess
    const starred = highlightedSpecs(product.specifications).map(({ label, value }) => ({ label, value }));
    return starred.length > 0 ? starred : fallbackSpecs(product.specifications);
  })(),
});

// Picks the cards: the chosen slugs in order, otherwise every pompa product (or every product)
export const selectDbProductCards = (products: DbProduct[], slugs: string[]): ProductCardContent[] => {
  if (slugs.length > 0) {
    return slugs
      .map((slug) => products.find((product) => product.slug === slug))
      .filter((product): product is DbProduct => !!product)
      .map(productToCard);
  }
  // "pompa" and its sub-categories (pompa-mini, pompa-master, ...)
  const pumps = products.filter((product) => /^pompa(-|$)/.test(product.category?.toLowerCase() || ""));
  return (pumps.length > 0 ? pumps : products).map(productToCard);
};

export const whatsappLink = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
