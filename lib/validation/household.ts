import { z } from "zod";

export const householdSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(60, "Nome deve ter no máximo 60 caracteres"),
});

export type HouseholdInput = z.infer<typeof householdSchema>;

export const createHouseholdSchema = householdSchema;

export const updateHouseholdSchema = householdSchema.extend({
  id: z.string().min(1),
});

export type UpdateHouseholdInput = z.infer<typeof updateHouseholdSchema>;

export const switchHouseholdSchema = z.object({
  householdId: z.string().min(1),
});
