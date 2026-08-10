"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { z } from "zod";

import { createExpense } from "@/actions/create-expense";
import { updateExpense } from "@/actions/update-expense";
import { useActionErrorHandler } from "@/lib/action-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const expenseFormSchema = z.object({
  description: z.string().trim().min(1, "Descrição obrigatória"),
  amount: z.string().trim().min(1, "Valor obrigatório"),
  date: z.string().trim().min(1, "Data obrigatória"),
  categoryId: z.string(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

type Category = { id: string; name: string };

type ExpenseRecord = {
  id: string;
  description: string;
  amountInCents: number;
  date: Date | string;
  categoryId: string | null;
};

function toDefaultValues(expense?: ExpenseRecord): ExpenseFormValues {
  if (!expense) {
    return { description: "", amount: "", date: "", categoryId: NO_CATEGORY };
  }

  return {
    description: expense.description,
    amount: (expense.amountInCents / 100).toFixed(2),
    date: new Date(expense.date).toISOString().slice(0, 10),
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
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: toDefaultValues(expense),
  });

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
      date: new Date(values.date),
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

            <Field data-invalid={!!errors.date}>
              <FieldLabel htmlFor="date">Data</FieldLabel>
              <Input
                id="date"
                type="date"
                aria-invalid={!!errors.date}
                {...register("date")}
              />
              <FieldError errors={errors.date ? [errors.date] : undefined} />
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
