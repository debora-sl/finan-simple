import { prisma } from "@/lib/prisma";

export async function getMonthlyPayers(
  householdId: string,
  year: number,
  month: number,
): Promise<number | null> {
  const monthlyPayers = await prisma.monthlyPayers.findUnique({
    where: { householdId_year_month: { householdId, year, month } },
    select: { payersCount: true },
  });

  return monthlyPayers?.payersCount ?? null;
}

export async function setMonthlyPayers(
  householdId: string,
  year: number,
  month: number,
  payersCount: number,
): Promise<void> {
  await prisma.monthlyPayers.upsert({
    where: { householdId_year_month: { householdId, year, month } },
    create: { householdId, year, month, payersCount },
    update: { payersCount },
  });
}
