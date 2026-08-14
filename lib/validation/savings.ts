import { z } from "zod";

export const updateSavingsSchema = z.object({
  amount: z.coerce
    .number({ error: "Valor obrigatório" })
    .min(0, "O valor não pode ser negativo")
    .multipleOf(0.01, "Valor deve ter no máximo 2 casas decimais"),
});

export type UpdateSavingsInput = z.infer<typeof updateSavingsSchema>;
