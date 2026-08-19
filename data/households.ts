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
    role: membership.role as "ADMIN" | "MEMBER",
  }));
}

export async function getActiveHouseholdId(userId: string): Promise<string | null> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { activeHouseholdId: true },
  });

  return user.activeHouseholdId;
}

export async function getHouseholdForUserWithRole(userId: string, householdId: string) {
  const membership = await prisma.membership.findUnique({
    where: { userId_householdId: { userId, householdId } },
    include: { household: true },
  });

  if (!membership) {
    return null;
  }

  return {
    id: membership.household.id,
    name: membership.household.name,
    role: membership.role as "ADMIN" | "MEMBER",
  };
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

export async function deleteHouseholdById(householdId: string) {
  await prisma.$transaction(async (tx) => {
    const affectedUsers = await tx.user.findMany({
      where: { activeHouseholdId: householdId },
      select: { id: true },
    });

    await tx.household.delete({ where: { id: householdId } });

    for (const user of affectedUsers) {
      const nextMembership = await tx.membership.findFirst({
        where: { userId: user.id },
        orderBy: { joinedAt: "asc" },
      });

      if (nextMembership) {
        await tx.user.update({
          where: { id: user.id },
          data: { activeHouseholdId: nextMembership.householdId },
        });
      }
    }
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
