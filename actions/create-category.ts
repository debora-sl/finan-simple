"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "@/lib/validation/category";

export const createCategory = protectedActionClient
  .inputSchema(createCategorySchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const category = await prisma.category.create({
        data: {
          name: parsedInput.name,
          nameLower: parsedInput.name.toLowerCase(),
          userId: ctx.user.id,
        },
      });

      revalidatePath("/categories");
      revalidatePath("/expenses");

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
