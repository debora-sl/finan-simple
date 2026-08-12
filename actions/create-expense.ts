"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { amountToCents } from "@/lib/money";
import { parseCalendarDate } from "@/lib/date";
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
        dueDate:
          parsedInput.hasNoDueDate || !parsedInput.dueDate
            ? null
            : parseCalendarDate(parsedInput.dueDate),
        paidDate: parsedInput.paidDate
          ? parseCalendarDate(parsedInput.paidDate)
          : null,
        categoryId: parsedInput.categoryId ?? null,
        householdId,
      },
    });

    revalidatePath("/expenses");
    revalidatePath("/dashboard");

    return expense;
  });
