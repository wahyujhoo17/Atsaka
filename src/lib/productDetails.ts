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
