import { prisma } from "@/lib/prisma";

export function getExpenses(householdId: string) {
  return prisma.expense.findMany({
    where: { householdId },
    include: { category: true },
    orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }],
  });
}

export function getExpenseById(householdId: string, id: string) {
  return prisma.expense.findFirst({
    where: { id, householdId },
    include: { category: true },
  });
}
