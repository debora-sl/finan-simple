import { Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import { categoryColorVar, resolveCategoryColor } from "@/lib/category-colors";

export function CategoryIcon({
  id,
  color,
  className,
}: {
  id: string;
  color?: string | null;
  className?: string;
}) {
  const slug = resolveCategoryColor({ id, color });

  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-md",
        className
      )}
      style={{
        backgroundColor: `color-mix(in srgb, ${categoryColorVar(slug)} 14%, transparent)`,
        color: categoryColorVar(slug),
      }}
    >
      <Tag className="size-4" />
    </span>
  );
}
