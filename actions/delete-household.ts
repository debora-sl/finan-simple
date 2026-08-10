"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { deleteHouseholdSchema } from "@/lib/validation/household";
import { deleteHouseholdById, getHouseholdById, getMembership } from "@/data/households";

export const deleteHousehold = protectedActionClient
  .inputSchema(deleteHouseholdSchema)
  .action(async ({ parsedInput, ctx }) => {
    const household = await getHouseholdById(parsedInput.householdId);

    if (!household) {
      throw new Error("Residência não encontrada.");
    }

    const membership = await getMembership(ctx.user.id, parsedInput.householdId);

    if (membership?.role !== "ADMIN") {
      throw new Error("Apenas o Administrador pode excluir a residência.");
    }

    await deleteHouseholdById(parsedInput.householdId);

    revalidatePath("/dashboard");
    revalidatePath("/expenses");
    revalidatePath("/categories");
    revalidatePath("/households");
  });
