"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { deleteCategorySchema } from "@/lib/validation/category";

export const deleteCategory = protectedActionClient
  .inputSchema(deleteCategorySchema)
  .action(async ({ parsedInput, ctx }) => {
    const category = await prisma.category.findFirst({
      where: { id: parsedInput.id, userId: ctx.user.id },
    });

    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    await prisma.category.delete({ where: { id: category.id } });

    revalidatePath("/categories");
    revalidatePath("/expenses");
  });
