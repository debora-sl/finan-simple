import { z } from "zod";

export const CATEGORY_COLOR_SLUGS = [
  "moradia",
  "mercado",
  "transporte",
  "saude",
  "educacao",
  "lazer",
  "cartao",
  "fixas",
  "outros",
] as const;

export type CategoryColorSlug = (typeof CATEGORY_COLOR_SLUGS)[number];

export const CATEGORY_COLOR_LABELS: Record<CategoryColorSlug, string> = {
  moradia: "Azul",
  mercado: "Verde",
  transporte: "Âmbar",
  saude: "Vermelho",
  educacao: "Roxo",
  lazer: "Rosa",
  cartao: "Ciano",
  fixas: "Verde-água",
  outros: "Cinza",
};

export const categoryColorEnum = z.enum(CATEGORY_COLOR_SLUGS);

export function pickCategoryColor(seed: string): CategoryColorSlug {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return CATEGORY_COLOR_SLUGS[hash % CATEGORY_COLOR_SLUGS.length];
}

export function resolveCategoryColor({
  id,
  color,
}: {
  id: string;
  color?: string | null;
}): CategoryColorSlug {
  if (color && (CATEGORY_COLOR_SLUGS as readonly string[]).includes(color)) {
    return color as CategoryColorSlug;
  }

  return pickCategoryColor(id);
}

export function categoryColorVar(slug: CategoryColorSlug) {
  return `var(--cat-${slug})`;
}
