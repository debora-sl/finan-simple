"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { deleteExpenseSchema } from "@/lib/validation/expense";

export const deleteExpense = protectedActionClient
  .inputSchema(deleteExpenseSchema)
  .action(async ({ parsedInput, ctx }) => {
    const expense = await prisma.expense.findFirst({
      where: { id: parsedInput.id, userId: ctx.user.id },
    });

    if (!expense) {
      throw new Error("Despesa não encontrada.");
    }

    await prisma.expense.delete({ where: { id: expense.id } });

    revalidatePath("/expenses");
  });
