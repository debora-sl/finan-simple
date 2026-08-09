"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { amountToCents } from "@/lib/money";
import { createExpenseSchema } from "@/lib/validation/expense";
import { getActiveHousehold } from "@/lib/active-household";

export const createExpense = protectedActionClient
  .inputSchema(createExpenseSchema)
  .action(async ({ parsedInput }) => {
    const { householdId } = await getActiveHousehold();

    if (parsedInput.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: parsedInput.categoryId, householdId },
      });

      if (!category) {
        throw new Error("Categoria não encontrada.");
      }
    }

    const expense = await prisma.expense.create({
      data: {
        description: parsedInput.description,
        amountInCents: amountToCents(parsedInput.amount),
        date: parsedInput.date,
        categoryId: parsedInput.categoryId ?? null,
        householdId,
      },
    });

    revalidatePath("/expenses");

    return expense;
  });
