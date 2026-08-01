import { z } from "zod";

export const expenseSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Descrição obrigatória")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
  amount: z.coerce
    .number({ error: "Valor obrigatório" })
    .positive("Valor deve ser maior que zero")
    .multipleOf(0.01, "Valor deve ter no máximo 2 casas decimais"),
  date: z.coerce.date({ error: "Data inválida" }),
  categoryId: z.string().trim().min(1).optional(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

export const createExpenseSchema = expenseSchema;

export const updateExpenseSchema = expenseSchema.extend({
  id: z.string().min(1),
});

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

export const deleteExpenseSchema = z.object({
  id: z.string().min(1),
});

export const toggleExpensePaidSchema = z.object({
  id: z.string().min(1),
  isPaid: z.boolean(),
});
