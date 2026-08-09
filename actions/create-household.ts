"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { createHouseholdSchema } from "@/lib/validation/household";

export const createHousehold = protectedActionClient
  .inputSchema(createHouseholdSchema)
  .action(async ({ parsedInput, ctx }) => {
    const household = await prisma.$transaction(async (tx) => {
      const household = await tx.household.create({
        data: { name: parsedInput.name },
      });

      await tx.membership.create({
        data: { userId: ctx.user.id, householdId: household.id, role: "ADMIN" },
      });

      await tx.user.update({
        where: { id: ctx.user.id },
        data: { activeHouseholdId: household.id },
      });

      return household;
    });

    revalidatePath("/dashboard");
    revalidatePath("/expenses");
    revalidatePath("/categories");
    revalidatePath("/households");

    return { id: household.id };
  });
