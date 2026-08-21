"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { getActiveHousehold } from "@/lib/active-household";
import { setMonthlyPayers as persistMonthlyPayers } from "@/data/payers";
import { setMonthlyPayersSchema } from "@/lib/validation/payers";

export const setMonthlyPayers = protectedActionClient
  .inputSchema(setMonthlyPayersSchema)
  .action(async ({ parsedInput }) => {
    const { householdId } = await getActiveHousehold();
    const { year, month, payersCount } = parsedInput;

    await persistMonthlyPayers(householdId, year, month, payersCount);

    revalidatePath("/debt-calculator");
    revalidatePath("/dashboard");

    return { payersCount };
  });
