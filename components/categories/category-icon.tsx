import { Tag } from "lucide-react";

import { cn } from "@/lib/utils";

const CATEGORY_COLORS = [
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

export function pickCategoryColor(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length];
}

export function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const color = pickCategoryColor(id);

  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-md",
        className
      )}
      style={{
        backgroundColor: `color-mix(in srgb, var(--cat-${color}) 14%, transparent)`,
        color: `var(--cat-${color})`,
      }}
    >
      <Tag className="size-4" />
    </span>
  );
}
