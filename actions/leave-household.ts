"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { switchHouseholdSchema } from "@/lib/validation/household";
import { getMembership, handleAdminDeparture } from "@/data/households";

export const leaveHousehold = protectedActionClient
  .inputSchema(switchHouseholdSchema)
  .action(async ({ parsedInput, ctx }) => {
    const membership = await getMembership(ctx.user.id, parsedInput.householdId);

    if (!membership) {
      throw new Error("Você não pertence a esta residência.");
    }

    await handleAdminDeparture(parsedInput.householdId, ctx.user.id);

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: ctx.user.id },
      select: { activeHouseholdId: true },
    });

    if (user.activeHouseholdId === parsedInput.householdId) {
      const fallback = await prisma.membership.findFirst({
        where: { userId: ctx.user.id },
        orderBy: { joinedAt: "asc" },
      });

      await prisma.user.update({
        where: { id: ctx.user.id },
        data: { activeHouseholdId: fallback?.householdId ?? null },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/expenses");
    revalidatePath("/categories");
    revalidatePath("/households");
  });
