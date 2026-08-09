"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { switchHouseholdSchema } from "@/lib/validation/household";
import { getMembership } from "@/data/households";

export const switchActiveHousehold = protectedActionClient
  .inputSchema(switchHouseholdSchema)
  .action(async ({ parsedInput, ctx }) => {
    const membership = await getMembership(ctx.user.id, parsedInput.householdId);

    if (!membership) {
      throw new Error("Você não pertence a esta residência.");
    }

    await prisma.user.update({
      where: { id: ctx.user.id },
      data: { activeHouseholdId: parsedInput.householdId },
    });

    revalidatePath("/dashboard");
    revalidatePath("/expenses");
    revalidatePath("/categories");
  });
