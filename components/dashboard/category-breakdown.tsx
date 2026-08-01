"use client";

import { Cell, Pie, PieChart } from "recharts";

import { formatCentsAsCurrency } from "@/lib/money";
import { pickCategoryColor } from "@/components/categories/category-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type CategoryTotal = {
  categoryId: string | null;
  categoryName: string;
  totalInCents: number;
};

export function CategoryBreakdown({
  totalInCents,
  byCategory,
}: {
  totalInCents: number;
  byCategory: CategoryTotal[];
}) {
  const data = byCategory.map((item) => ({
    key: item.categoryId ?? "sem-categoria",
    name: item.categoryName,
    value: item.totalInCents,
    color: `var(--cat-${pickCategoryColor(item.categoryId ?? item.categoryName)})`,
  }));

  const chartConfig = Object.fromEntries(
    data.map((item) => [item.key, { label: item.name, color: item.color }])
  ) satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas por categoria</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative mx-auto aspect-square w-full max-w-56">
          <ChartContainer config={chartConfig} className="aspect-square">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="65%"
                outerRadius="100%"
                strokeWidth={4}
              >
                {data.map((item) => (
                  <Cell key={item.key} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Despesas</span>
            <span className="cf-money text-lg font-semibold text-foreground">
              {formatCentsAsCurrency(totalInCents)}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {data.map((item) => {
            const percent =
              totalInCents > 0 ? Math.round((item.value / totalInCents) * 100) : 0;

            return (
              <div key={item.key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="text-muted-foreground">
                    {formatCentsAsCurrency(item.value)} · {percent}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
