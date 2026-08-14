import { prisma } from "@/lib/prisma";

export type DashboardSummary = {
  hasExpenses: boolean;
  totalInCents: number;
  paidInCents: number;
  pendingInCents: number;
  byCategory: Array<{
    categoryId: string | null;
    categoryName: string;
    categoryColor: string | null;
    totalInCents: number;
  }>;
};

export async function getDashboardSummary(householdId: string): Promise<DashboardSummary> {
  const [totalAgg, paidAgg, byCategoryGroups, categories] = await Promise.all([
    prisma.expense.aggregate({
      where: { householdId },
      _sum: { amountInCents: true },
      _count: true,
    }),
    prisma.expense.aggregate({
      where: { householdId, paidDate: { not: null } },
      _sum: { amountInCents: true },
    }),
    prisma.expense.groupBy({
      by: ["categoryId"],
      where: { householdId },
      _sum: { amountInCents: true },
    }),
    prisma.category.findMany({
      where: { householdId },
      select: { id: true, name: true, color: true },
    }),
  ]);

  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const totalInCents = totalAgg._sum.amountInCents ?? 0;
  const paidInCents = paidAgg._sum.amountInCents ?? 0;

  const byCategory = byCategoryGroups
    .map((group) => {
      const category = group.categoryId ? categoriesById.get(group.categoryId) : undefined;

      return {
        categoryId: group.categoryId,
        categoryName: category?.name ?? "Sem categoria",
        categoryColor: category?.color ?? null,
        totalInCents: group._sum.amountInCents ?? 0,
      };
    })
    .sort((a, b) => b.totalInCents - a.totalInCents);

  return {
    hasExpenses: totalAgg._count > 0,
    totalInCents,
    paidInCents,
    pendingInCents: totalInCents - paidInCents,
    byCategory,
  };
}
