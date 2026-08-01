"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { amountToCents } from "@/lib/money";
import { createExpenseSchema } from "@/lib/validation/expense";

export const createExpense = protectedActionClient
  .inputSchema(createExpenseSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (parsedInput.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: parsedInput.categoryId, userId: ctx.user.id },
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
        userId: ctx.user.id,
      },
    });

    revalidatePath("/expenses");

    return expense;
  });
