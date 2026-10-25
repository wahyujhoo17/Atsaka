import {
  Award,
  BadgeCheck,
  CheckCircle2,
  Feather,
  FlaskConical,
  Gauge,
  LucideIcon,
  PackageCheck,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";

// Extra content for the product detail page, stored in products.details (JSONB)
export interface ProductDetails {
  // Short line under the product name; falls back to the description's first sentence
  tagline?: string;
  // Certification / warranty strip, icons from contentIcons
  badges?: { icon: string; label: string }[];
  // "Mengapa memilih …" cards
  reasons?: { title: string; description: string; image: string }[];
}

export const toProductDetails = (details: unknown): ProductDetails => {
  const value = (details && typeof details === "object" ? details : {}) as ProductDetails;
  return {
    tagline: value.tagline || "",
    badges: Array.isArray(value.badges) ? value.badges : [],
    reasons: Array.isArray(value.reasons) ? value.reasons : [],
  };
};

export const firstSentence = (text: string) => {
  const sentence = text.replace(/\s+/g, " ").trim().split(/(?<=\.)\s/)[0] || "";
  return sentence.length > 160 ? `${sentence.slice(0, 157).trimEnd()}…` : sentence;
};

// Feature list items are free text, so pick an icon from keywords
const featureIconRules: [RegExp, LucideIcon][] = [
  [/tkdn|lokal/i, Award],
  [/sni|uji|lab/i, FlaskConical],
  [/oem|honda|matching/i, BadgeCheck],
  [/garansi|warranty/i, ShieldCheck],
  [/sparepart|suku cadang/i, PackageCheck],
  [/ringan|ringkas|portable|jinjing/i, Feather],
  [/rpm|tekanan|pressure|performa/i, Gauge],
  [/engine|mesin|hp\b/i, Zap],
  [/servis|perawatan/i, Wrench],
];

export const getFeatureIcon = (text: string): LucideIcon =>
  featureIconRules.find(([pattern]) => pattern.test(text))?.[1] || CheckCircle2;
