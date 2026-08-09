"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { toggleExpensePaidSchema } from "@/lib/validation/expense";
import { getActiveHousehold } from "@/lib/active-household";

export const toggleExpensePaid = protectedActionClient
  .inputSchema(toggleExpensePaidSchema)
  .action(async ({ parsedInput }) => {
    const { householdId } = await getActiveHousehold();

    const expense = await prisma.expense.findFirst({
      where: { id: parsedInput.id, householdId },
    });

    if (!expense) {
      throw new Error("Despesa não encontrada.");
    }

    const updated = await prisma.expense.update({
      where: { id: expense.id },
      data: { isPaid: parsedInput.isPaid },
    });

    revalidatePath("/expenses");
    revalidatePath("/dashboard");

    return updated;
  });
