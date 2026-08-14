"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { getActiveHousehold } from "@/lib/active-household";
import { amountToCents } from "@/lib/money";
import { setHouseholdSavings } from "@/data/savings";
import { updateSavingsSchema } from "@/lib/validation/savings";

export const updateSavings = protectedActionClient
  .inputSchema(updateSavingsSchema)
  .action(async ({ parsedInput }) => {
    const { householdId } = await getActiveHousehold();
    const savingsInCents = amountToCents(parsedInput.amount);

    await setHouseholdSavings(householdId, savingsInCents);

    revalidatePath("/cofrinho");
    revalidatePath("/dashboard");

    return { savingsInCents };
  });
