import { prisma } from "@/lib/prisma";

export function getExpenses(userId: string) {
  return prisma.expense.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
  });
}

export function getExpenseById(userId: string, id: string) {
  return prisma.expense.findFirst({
    where: { id, userId },
    include: { category: true },
  });
}
