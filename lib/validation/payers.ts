import { z } from "zod";

export const setMonthlyPayersSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  payersCount: z.coerce
    .number({ error: "Informe o número de pagantes" })
    .int("Deve ser um número inteiro")
    .min(1, "Deve haver ao menos 1 pagante"),
});

export type SetMonthlyPayersInput = z.infer<typeof setMonthlyPayersSchema>;
