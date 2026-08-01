"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { amountToCents } from "@/lib/money";
import { updateExpenseSchema } from "@/lib/validation/expense";

export const updateExpense = protectedActionClient
  .inputSchema(updateExpenseSchema)
  .action(async ({ parsedInput, ctx }) => {
    const expense = await prisma.expense.findFirst({
      where: { id: parsedInput.id, userId: ctx.user.id },
    });

    if (!expense) {
      throw new Error("Despesa não encontrada.");
    }

    if (parsedInput.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: parsedInput.categoryId, userId: ctx.user.id },
      });

      if (!category) {
        throw new Error("Categoria não encontrada.");
      }
    }

    const updated = await prisma.expense.update({
      where: { id: expense.id },
      data: {
        description: parsedInput.description,
        amountInCents: amountToCents(parsedInput.amount),
        date: parsedInput.date,
        categoryId: parsedInput.categoryId ?? null,
      },
    });

    revalidatePath("/expenses");

    return updated;
  });
