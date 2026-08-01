import { prisma } from "@/lib/prisma";

export function getCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export function getCategoryById(userId: string, id: string) {
  return prisma.category.findFirst({
    where: { id, userId },
  });
}
