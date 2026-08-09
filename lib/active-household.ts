import { cache } from "react";
import { redirect } from "next/navigation";

import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export const getActiveHousehold = cache(async () => {
  const { userId } = await verifySession();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { activeHouseholdId: true },
  });

  if (user.activeHouseholdId) {
    const membership = await prisma.membership.findUnique({
      where: { userId_householdId: { userId, householdId: user.activeHouseholdId } },
    });

    if (membership) {
      return { userId, householdId: membership.householdId, role: membership.role as "ADMIN" | "MEMBER" };
    }
  }

  const fallback = await prisma.membership.findFirst({
    where: { userId },
    orderBy: { joinedAt: "asc" },
  });

  if (!fallback) {
    redirect("/households/new");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { activeHouseholdId: fallback.householdId },
  });

  return { userId, householdId: fallback.householdId, role: fallback.role as "ADMIN" | "MEMBER" };
});
