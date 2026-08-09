import { prisma } from "@/lib/prisma";

export function getCategories(householdId: string) {
  return prisma.category.findMany({
    where: { householdId },
    orderBy: { name: "asc" },
  });
}

export function getCategoryById(householdId: string, id: string) {
  return prisma.category.findFirst({
    where: { id, householdId },
  });
}
