"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Calculator } from "lucide-react";
import type { z } from "zod";

import { setMonthlyPayers } from "@/actions/set-monthly-payers";
import { useActionErrorHandler } from "@/lib/action-error";
import { formatCentsAsCurrency } from "@/lib/money";
import { setMonthlyPayersSchema } from "@/lib/validation/payers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const payersCountSchema = setMonthlyPayersSchema.pick({ payersCount: true });

type PayersCountFormInput = z.input<typeof payersCountSchema>;
type PayersCountFormOutput = z.infer<typeof payersCountSchema>;

type DebtCalculatorFormProps = {
  year: number;
  month: number;
  totalInCents: number;
  payersCount: number | null;
};

export function DebtCalculatorForm({
  year,
  month,
  totalInCents,
  payersCount,
}: DebtCalculatorFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PayersCountFormInput, unknown, PayersCountFormOutput>({
    resolver: zodResolver(payersCountSchema),
    defaultValues: { payersCount: payersCount ?? undefined },
  });

  const { execute, isPending } = useAction(setMonthlyPayers, {
    onSuccess: () => toast.success("Número de pagantes salvo."),
    onError: useActionErrorHandler("Não foi possível salvar o número de pagantes."),
  });

  function onSubmit(values: PayersCountFormOutput) {
    execute({ year, month, payersCount: values.payersCount });
  }

  const payersCountValue = useWatch({ control, name: "payersCount" });
  const parsedPayersCount = Number(payersCountValue);
  const hasValidPayersCount =
    payersCountValue !== "" &&
    payersCountValue !== undefined &&
    payersCountValue !== null &&
    Number.isInteger(parsedPayersCount) &&
    parsedPayersCount >= 1;

  const valuePerPayerInCents = hasValidPayersCount
    ? Math.round(totalInCents / parsedPayersCount)
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="flex items-end gap-3">
        <Field data-invalid={!!errors.payersCount} className="flex-1">
          <FieldLabel htmlFor="payersCount">Número de pagantes</FieldLabel>
          <Input
            id="payersCount"
            type="number"
            step="1"
            min="1"
            inputMode="numeric"
            placeholder="Ex.: 3"
            aria-invalid={!!errors.payersCount}
            {...register("payersCount")}
          />
          <FieldError errors={errors.payersCount ? [errors.payersCount] : undefined} />
        </Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/40 p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-action-soft text-action-soft-foreground">
          <Calculator className="size-5" />
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm text-muted-foreground">Valor por pagante</p>
          <p className="cf-money text-xl font-semibold text-foreground">
            {valuePerPayerInCents !== null ? formatCentsAsCurrency(valuePerPayerInCents) : "—"}
          </p>
        </div>
      </div>
    </form>
  );
}
