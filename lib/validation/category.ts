import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(60, "Nome deve ter no máximo 60 caracteres"),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const createCategorySchema = categorySchema;

export const updateCategorySchema = categorySchema.extend({
  id: z.string().min(1),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const deleteCategorySchema = z.object({
  id: z.string().min(1),
});
