"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "@/lib/validation/category";
import { getActiveHousehold } from "@/lib/active-household";

export const createCategory = protectedActionClient
  .inputSchema(createCategorySchema)
  .action(async ({ parsedInput }) => {
    const { householdId } = await getActiveHousehold();

    try {
      const category = await prisma.category.create({
        data: {
          name: parsedInput.name,
          nameLower: parsedInput.name.toLowerCase(),
          householdId,
          color: parsedInput.color ?? null,
        },
      });

      revalidatePath("/categories");
      revalidatePath("/expenses");
      revalidatePath("/dashboard");

      return category;
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
