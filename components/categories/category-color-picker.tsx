"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  CATEGORY_COLOR_LABELS,
  CATEGORY_COLOR_SLUGS,
  categoryColorVar,
  type CategoryColorSlug,
} from "@/lib/category-colors";

export function CategoryColorPicker({
  value,
  onChange,
}: {
  value?: CategoryColorSlug;
  onChange: (value: CategoryColorSlug | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleGroup
        aria-label="Cor da categoria"
        value={value ? [value] : []}
        onValueChange={([next]) => onChange(next as CategoryColorSlug | undefined)}
      >
        {CATEGORY_COLOR_SLUGS.map((slug) => (
          <ToggleGroupItem
            key={slug}
            value={slug}
            aria-label={CATEGORY_COLOR_LABELS[slug]}
            title={CATEGORY_COLOR_LABELS[slug]}
            className="size-8 rounded-full p-0"
          >
            <span
              className="block size-5 rounded-full"
              style={{ backgroundColor: categoryColorVar(slug) }}
            />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!value}
        onClick={() => onChange(undefined)}
      >
        <X />
        Limpar
      </Button>
    </div>
  );
}
