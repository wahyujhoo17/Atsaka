// Product specifications are stored as ordered groups: [{ title, items: [{ label, value }] }].
// Older products store a flat { label: value } object; both shapes are accepted everywhere.

export interface SpecItem {
  label: string;
  value: string;
  // Starred rows are shown on product cards and the homepage hero
  highlight?: boolean;
}

export interface SpecGroup {
  title: string;
  items: SpecItem[];
}

export type SpecificationsData = SpecGroup[] | Record<string, string> | null | undefined;

export const toSpecGroups = (specs: unknown): SpecGroup[] => {
  if (Array.isArray(specs)) {
    return specs.map((group) => ({
      title: String(group?.title ?? ""),
      items: Array.isArray(group?.items)
        ? group.items.map((item: Partial<SpecItem>) => ({
            label: String(item?.label ?? ""),
            value: String(item?.value ?? ""),
            ...(item?.highlight ? { highlight: true } : {}),
          }))
        : [],
    }));
  }
  if (specs && typeof specs === "object") {
    const items = Object.entries(specs).map(([label, value]) => ({ label, value: String(value) }));
    return items.length > 0 ? [{ title: "", items }] : [];
  }
  return [];
};

export const flattenSpecs = (specs: unknown): SpecItem[] => toSpecGroups(specs).flatMap((group) => group.items);

// Drops empty rows and groups before saving
export const cleanSpecGroups = (groups: SpecGroup[]): SpecGroup[] =>
  groups
    .map((group) => ({
      title: group.title.trim(),
      items: group.items
        .map((item) => ({
          label: item.label.trim(),
          value: item.value.trim(),
          ...(item.highlight ? { highlight: true } : {}),
        }))
        .filter((item) => item.label && item.value),
    }))
    .filter((group) => group.items.length > 0);

export const MAX_HIGHLIGHTS = 5;

// The starred rows, in table order, for cards and the hero
export const highlightedSpecs = (specs: unknown): SpecItem[] =>
  flattenSpecs(specs)
    .filter((item) => item.highlight && item.label && item.value)
    .slice(0, MAX_HIGHLIGHTS);
