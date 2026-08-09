import { prisma } from "@/lib/prisma";

export async function getHouseholdsForUser(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: { household: true },
    orderBy: { joinedAt: "asc" },
  });

  return memberships.map((membership) => ({
    id: membership.household.id,
    name: membership.household.name,
    role: membership.role,
  }));
}

export function getHouseholdById(householdId: string) {
  return prisma.household.findUnique({
    where: { id: householdId },
  });
}

export function getMembership(userId: string, householdId: string) {
  return prisma.membership.findUnique({
    where: { userId_householdId: { userId, householdId } },
  });
}

export async function handleAdminDeparture(householdId: string, leavingUserId: string) {
  await prisma.$transaction(async (tx) => {
    const membership = await tx.membership.findUnique({
      where: { userId_householdId: { userId: leavingUserId, householdId } },
    });

    if (!membership) {
      return;
    }

    if (membership.role !== "ADMIN") {
      await tx.membership.delete({ where: { id: membership.id } });
      return;
    }

    const nextAdmin = await tx.membership.findFirst({
      where: { householdId, userId: { not: leavingUserId } },
      orderBy: { joinedAt: "asc" },
    });

    if (!nextAdmin) {
      await tx.household.delete({ where: { id: householdId } });
      return;
    }

    await tx.membership.update({
      where: { id: nextAdmin.id },
      data: { role: "ADMIN" },
    });

    await tx.membership.delete({ where: { id: membership.id } });
  });
}
