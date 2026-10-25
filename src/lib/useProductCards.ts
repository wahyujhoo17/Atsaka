import { useEffect, useState } from "react";
import { api } from "./api";
import { DbProduct, ProductCardContent, selectDbProductCards } from "../data/homepageContent";

// Products are fetched once per page load and shared by the hero and the solutions slider
let productsRequest: Promise<DbProduct[]> | null = null;
const loadProducts = () => {
  productsRequest ??= api.getProducts().then((data: DbProduct[]) => data || []);
  productsRequest.catch(() => (productsRequest = null));
  return productsRequest;
};

interface DbCategory {
  slug: string;
  name: string;
  description?: string | null;
}

let categoriesRequest: Promise<DbCategory[]> | null = null;
const loadCategories = () => {
  categoriesRequest ??= api.getCategories().then((data: DbCategory[]) => data || []);
  categoriesRequest.catch(() => (categoriesRequest = null));
  return categoriesRequest;
};

export interface CategoryChip {
  title: string;
  description: string;
  link: string;
}

/**
 * Category shortcuts for the solutions section. "database" lists every category that has
 * at least one product (linking to the filtered Products page); "manual" returns the manual list.
 */
export const useCategoryChips = (
  source: "database" | "manual",
  manualChips: CategoryChip[],
): CategoryChip[] => {
  const [dbChips, setDbChips] = useState<CategoryChip[] | null>(null);
  const useDatabase = source !== "manual";

  useEffect(() => {
    if (!useDatabase) return;
    let cancelled = false;
    Promise.all([loadCategories(), loadProducts()])
      .then(([categories, products]) => {
        const used = new Set(products.map((product) => product.category?.toLowerCase().trim()));
        const chips = categories
          .filter((category) => used.has(category.slug))
          .map((category) => ({
            title: category.name,
            description: category.description || "",
            link: `/products?category=${encodeURIComponent(category.slug)}`,
          }));
        if (!cancelled) setDbChips(chips);
      })
      .catch((error) => {
        console.error("Error fetching categories for homepage:", error);
        if (!cancelled) setDbChips([]);
      });
    return () => {
      cancelled = true;
    };
  }, [useDatabase]);

  if (!useDatabase) return manualChips;
  // While loading show nothing rather than flashing the manual list
  return dbChips ?? [];
};

/**
 * Cards for a homepage section. "database" reads the Products table (falling back to the
 * manual cards when it has nothing to show); "manual" returns the manual cards as-is.
 * Returns null while the database cards are loading.
 */
export const useProductCards = (
  source: "database" | "manual",
  slugs: string[],
  manualCards: ProductCardContent[],
): ProductCardContent[] | null => {
  const [dbCards, setDbCards] = useState<ProductCardContent[] | null>(null);
  const useDatabase = source !== "manual";
  const slugKey = slugs.join(",");

  useEffect(() => {
    if (!useDatabase) return;
    let cancelled = false;
    loadProducts()
      .then((products) => !cancelled && setDbCards(selectDbProductCards(products, slugKey ? slugKey.split(",") : [])))
      .catch((error) => {
        console.error("Error fetching products for homepage:", error);
        if (!cancelled) setDbCards([]);
      });
    return () => {
      cancelled = true;
    };
  }, [useDatabase, slugKey]);

  if (!useDatabase) return manualCards;
  if (dbCards === null) return null;
  return dbCards.length > 0 ? dbCards : manualCards;
};
