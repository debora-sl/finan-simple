import { Tag } from "lucide-react";

import { formatCentsAsCurrency } from "@/lib/money";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EXAMPLE_CATEGORIES = [
  { name: "Moradia", color: "moradia", totalInCents: 180000 },
  { name: "Mercado", color: "mercado", totalInCents: 96000 },
  { name: "Transporte", color: "transporte", totalInCents: 54000 },
  { name: "Saúde", color: "saude", totalInCents: 42000 },
  { name: "Lazer", color: "lazer", totalInCents: 38000 },
];

export function CategoriesPreview() {
  return (
    <section className="flex flex-col gap-6 py-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Categorias para organizar cada despesa
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Crie categorias sob medida para a sua residência e acompanhe para onde o dinheiro está
          indo.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Categorias da residência</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {EXAMPLE_CATEGORIES.map((category) => (
            <div
              key={category.name}
              className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-md"
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--cat-${category.color}) 14%, transparent)`,
                    color: `var(--cat-${category.color})`,
                  }}
                >
                  <Tag className="size-4" />
                </span>
                <span className="text-sm font-medium text-foreground">{category.name}</span>
              </div>
              <span className="cf-money text-sm text-muted-foreground">
                {formatCentsAsCurrency(category.totalInCents)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
