"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { amountToCents } from "@/lib/money";
import { parseCalendarDate } from "@/lib/date";
import { updateExpenseSchema } from "@/lib/validation/expense";
import { getActiveHousehold } from "@/lib/active-household";

export const updateExpense = protectedActionClient
  .inputSchema(updateExpenseSchema)
  .action(async ({ parsedInput }) => {
    const { householdId } = await getActiveHousehold();

    const expense = await prisma.expense.findFirst({
      where: { id: parsedInput.id, householdId },
    });

    if (!expense) {
      throw new Error("Despesa não encontrada.");
    }

    if (parsedInput.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: parsedInput.categoryId, householdId },
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
        dueDate:
          parsedInput.hasNoDueDate || !parsedInput.dueDate
            ? null
            : parseCalendarDate(parsedInput.dueDate),
        paidDate: parsedInput.paidDate
          ? parseCalendarDate(parsedInput.paidDate)
          : null,
        categoryId: parsedInput.categoryId ?? null,
      },
    });

    revalidatePath("/expenses");
    revalidatePath("/dashboard");

    return updated;
  });
