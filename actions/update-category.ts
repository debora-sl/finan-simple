"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { updateCategorySchema } from "@/lib/validation/category";
import { getActiveHousehold } from "@/lib/active-household";

export const updateCategory = protectedActionClient
  .inputSchema(updateCategorySchema)
  .action(async ({ parsedInput }) => {
    const { householdId } = await getActiveHousehold();

    const category = await prisma.category.findFirst({
      where: { id: parsedInput.id, householdId },
    });

    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    try {
      const updated = await prisma.category.update({
        where: { id: category.id },
        data: {
          name: parsedInput.name,
          nameLower: parsedInput.name.toLowerCase(),
        },
      });

      revalidatePath("/categories");
      revalidatePath("/expenses");

      return updated;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("Você já tem uma categoria com esse nome.");
      }

      throw error;
    }
  });
