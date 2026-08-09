"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validation/profile";

export const updateProfile = protectedActionClient
  .inputSchema(updateProfileSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.user.update({
      where: { id: ctx.user.id },
      data: { name: parsedInput.name },
    });

    revalidatePath("/profile");
  });
