"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { z } from "zod";

import { createExpense } from "@/actions/create-expense";
import { updateExpense } from "@/actions/update-expense";
import { useActionErrorHandler } from "@/lib/action-error";
import { toDateInputValue } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

const NO_CATEGORY = "none";

const calendarDateRegex = /^\d{4}-\d{2}-\d{2}$/;

const expenseFormSchema = z
  .object({
    description: z.string().trim().min(1, "Descrição obrigatória"),
    amount: z.string().trim().min(1, "Valor obrigatório"),
    dueDate: z
      .string()
      .regex(calendarDateRegex, "Data inválida")
      .or(z.literal("")),
    hasNoDueDate: z.boolean(),
    paidDate: z
      .string()
      .regex(calendarDateRegex, "Data inválida")
      .or(z.literal("")),
    categoryId: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasNoDueDate && !data.dueDate) {
      ctx.addIssue({
        code: "custom",
        path: ["dueDate"],
        message:
          "Informe a data de vencimento ou marque 'Sem data de vencimento'.",
      });
    }
  });

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

type Category = { id: string; name: string };

type ExpenseRecord = {
  id: string;
  description: string;
  amountInCents: number;
  dueDate: Date | string | null;
  paidDate: Date | string | null;
  categoryId: string | null;
};

function getLocalToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDefaultValues(expense?: ExpenseRecord): ExpenseFormValues {
  if (!expense) {
    return {
      description: "",
      amount: "",
      dueDate: "",
      hasNoDueDate: false,
      paidDate: "",
      categoryId: NO_CATEGORY,
    };
  }

  return {
    description: expense.description,
    amount: (expense.amountInCents / 100).toFixed(2),
    dueDate: expense.dueDate ? toDateInputValue(new Date(expense.dueDate)) : "",
    hasNoDueDate: !expense.dueDate,
    paidDate: expense.paidDate ? toDateInputValue(new Date(expense.paidDate)) : "",
    categoryId: expense.categoryId ?? NO_CATEGORY,
  };
}

export function ExpenseForm({
  categories,
  expense,
  trigger,
}: {
  categories: Category[];
  expense?: ExpenseRecord;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const isEdit = !!expense;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: toDefaultValues(expense),
  });

  const hasNoDueDate = useWatch({ control, name: "hasNoDueDate" });

  useEffect(() => {
    if (open) {
      reset(toDefaultValues(expense));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const actionOptions = {
    onSuccess: () => {
      toast.success(isEdit ? "Despesa atualizada." : "Despesa criada.");
      setOpen(false);
    },
    onError: useActionErrorHandler("Não foi possível salvar a despesa."),
  };

  const createAction = useAction(createExpense, actionOptions);
  const updateAction = useAction(updateExpense, actionOptions);
  const isPending = isEdit ? updateAction.isPending : createAction.isPending;

  function onSubmit(values: ExpenseFormValues) {
    const payload = {
      description: values.description,
      amount: Number(values.amount.replace(",", ".")),
      dueDate: values.hasNoDueDate ? undefined : values.dueDate,
      hasNoDueDate: values.hasNoDueDate,
      paidDate: values.paidDate || undefined,
      clientToday: values.paidDate ? getLocalToday() : undefined,
      categoryId: values.categoryId === NO_CATEGORY ? undefined : values.categoryId,
    };

    if (isEdit) {
      updateAction.execute({ id: expense.id, ...payload });
    } else {
      createAction.execute(payload);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={trigger} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar despesa" : "Nova despesa"}</SheetTitle>
        </SheetHeader>

        <form
          id="expense-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
        >
          <FieldGroup>
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Descrição</FieldLabel>
              <Input
                id="description"
                placeholder="Ex: Mercado da semana"
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              <FieldError errors={errors.description ? [errors.description] : undefined} />
            </Field>

            <Field data-invalid={!!errors.amount}>
              <FieldLabel htmlFor="amount">Valor</FieldLabel>
              <Input
                id="amount"
                inputMode="decimal"
                placeholder="0,00"
                aria-invalid={!!errors.amount}
                {...register("amount")}
              />
              <FieldError errors={errors.amount ? [errors.amount] : undefined} />
            </Field>

            <Field data-invalid={!!errors.dueDate}>
              <FieldLabel htmlFor="dueDate">Vencimento</FieldLabel>
              <Input
                id="dueDate"
                type="date"
                disabled={hasNoDueDate}
                aria-invalid={!!errors.dueDate}
                {...register("dueDate")}
              />
              <FieldError errors={errors.dueDate ? [errors.dueDate] : undefined} />
            </Field>

            <Field orientation="horizontal">
              <Controller
                control={control}
                name="hasNoDueDate"
                render={({ field }) => (
                  <Checkbox
                    id="hasNoDueDate"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true;
                      field.onChange(isChecked);
                      if (isChecked) {
                        setValue("dueDate", "");
                      }
                    }}
                  />
                )}
              />
              <FieldLabel htmlFor="hasNoDueDate">Sem data de vencimento</FieldLabel>
            </Field>

            <Field data-invalid={!!errors.paidDate}>
              <FieldLabel htmlFor="paidDate">Pagamento</FieldLabel>
              <Input
                id="paidDate"
                type="date"
                aria-invalid={!!errors.paidDate}
                {...register("paidDate")}
              />
              <FieldError errors={errors.paidDate ? [errors.paidDate] : undefined} />
            </Field>

            <Field>
              <FieldLabel htmlFor="categoryId">Categoria</FieldLabel>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    items={[
                      { value: NO_CATEGORY, label: "Sem categoria" },
                      ...categories.map((category) => ({
                        value: category.id,
                        label: category.name,
                      })),
                    ]}
                  >
                    <SelectTrigger id="categoryId" className="w-full">
                      <SelectValue placeholder="Sem categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_CATEGORY}>Sem categoria</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter className="flex-row">
          <SheetClose render={<Button variant="outline" className="flex-1" />}>
            Cancelar
          </SheetClose>
          <Button
            type="submit"
            form="expense-form"
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
