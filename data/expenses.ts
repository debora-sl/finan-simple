import { prisma } from "@/lib/prisma";
import { toMonthValue, formatMonthLabel, type ReportPeriod } from "@/lib/report-period";

export type AvailableMonth = {
  year: number;
  month: number;
  value: string;
  label: string;
};

export function getExpenses(householdId: string, period?: ReportPeriod) {
  return prisma.expense.findMany({
    where: {
      householdId,
      ...(period?.kind === "month" ? { dueDate: { gte: period.gte, lt: period.lt } } : {}),
    },
    include: { category: true },
    orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }],
  });
}

export async function getAvailableMonths(householdId: string): Promise<AvailableMonth[]> {
  const expenses = await prisma.expense.findMany({
    where: { householdId, dueDate: { not: null } },
    select: { dueDate: true },
  });

  const monthsByValue = new Map<string, AvailableMonth>();

  for (const expense of expenses) {
    const dueDate = expense.dueDate as Date;
    const year = dueDate.getUTCFullYear();
    const month = dueDate.getUTCMonth() + 1;
    const value = toMonthValue(year, month);

    if (!monthsByValue.has(value)) {
      monthsByValue.set(value, { year, month, value, label: formatMonthLabel(year, month) });
    }
  }

  return Array.from(monthsByValue.values()).sort((a, b) => b.value.localeCompare(a.value));
}

export function getExpenseById(householdId: string, id: string) {
  return prisma.expense.findFirst({
    where: { id, householdId },
    include: { category: true },
  });
}
