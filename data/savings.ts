import { prisma } from "@/lib/prisma";

export async function getHouseholdSavings(householdId: string): Promise<number> {
  const household = await prisma.household.findUnique({
    where: { id: householdId },
    select: { savingsInCents: true },
  });

  return household?.savingsInCents ?? 0;
}

export async function setHouseholdSavings(
  householdId: string,
  savingsInCents: number,
): Promise<void> {
  await prisma.household.update({
    where: { id: householdId },
    data: { savingsInCents },
  });
}
