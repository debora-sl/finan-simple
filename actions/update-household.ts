"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { updateHouseholdSchema } from "@/lib/validation/household";
import { getMembership } from "@/data/households";

export const updateHousehold = protectedActionClient
  .inputSchema(updateHouseholdSchema)
  .action(async ({ parsedInput, ctx }) => {
    const membership = await getMembership(ctx.user.id, parsedInput.id);

    if (membership?.role !== "ADMIN") {
      throw new Error("Apenas o Administrador pode editar a residência.");
    }

    await prisma.household.update({
      where: { id: parsedInput.id },
      data: { name: parsedInput.name },
    });

    revalidatePath("/households");
  });
