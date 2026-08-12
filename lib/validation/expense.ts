import { z } from "zod";

const calendarDateRegex = /^\d{4}-\d{2}-\d{2}$/;

const expenseObjectSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Descrição obrigatória")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
  amount: z.coerce
    .number({ error: "Valor obrigatório" })
    .positive("Valor deve ser maior que zero")
    .multipleOf(0.01, "Valor deve ter no máximo 2 casas decimais"),
  dueDate: z.string().regex(calendarDateRegex, "Data inválida").optional(),
  hasNoDueDate: z.boolean().default(false),
  paidDate: z
    .string()
    .regex(calendarDateRegex, "Data inválida")
    .optional()
    .nullable(),
  clientToday: z.string().regex(calendarDateRegex, "Data inválida").optional(),
  categoryId: z.string().trim().min(1).optional(),
});

function withExpenseRefinements<Schema extends typeof expenseObjectSchema>(
  schema: Schema,
) {
  return schema.superRefine((data, ctx) => {
    if (!data.hasNoDueDate && !data.dueDate) {
      ctx.addIssue({
        code: "custom",
        path: ["dueDate"],
        message:
          "Informe a data de vencimento ou marque 'Sem data de vencimento'.",
      });
    }

    if (data.paidDate) {
      if (!data.clientToday) {
        ctx.addIssue({
          code: "custom",
          path: ["paidDate"],
          message:
            "Não foi possível validar a data de pagamento; recarregue a página e tente novamente.",
        });
      } else if (data.paidDate > data.clientToday) {
        ctx.addIssue({
          code: "custom",
          path: ["paidDate"],
          message: "A data de pagamento não pode ser futura.",
        });
      }
    }
  });
}

export const expenseSchema = withExpenseRefinements(expenseObjectSchema);

export type ExpenseInput = z.infer<typeof expenseSchema>;

export const createExpenseSchema = expenseSchema;

export const updateExpenseSchema = withExpenseRefinements(
  expenseObjectSchema.extend({
    id: z.string().min(1),
  }),
);

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

export const deleteExpenseSchema = z.object({
  id: z.string().min(1),
});

export const toggleExpensePaidSchema = z.object({
  id: z.string().min(1),
  isPaid: z.boolean(),
  clientToday: z.string().regex(calendarDateRegex, "Data inválida"),
});
