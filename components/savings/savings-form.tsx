"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { PiggyBank } from "lucide-react";
import type { z } from "zod";

import { updateSavings } from "@/actions/update-savings";
import { useActionErrorHandler } from "@/lib/action-error";
import { centsToAmount } from "@/lib/money";
import { updateSavingsSchema, type UpdateSavingsInput } from "@/lib/validation/savings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type SavingsFormInput = z.input<typeof updateSavingsSchema>;

export function SavingsForm({ savingsInCents }: { savingsInCents: number }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SavingsFormInput, unknown, UpdateSavingsInput>({
    resolver: zodResolver(updateSavingsSchema),
    defaultValues: { amount: centsToAmount(savingsInCents) },
  });

  const { execute, isPending } = useAction(updateSavings, {
    onSuccess: () => toast.success("Valor guardado atualizado."),
    onError: useActionErrorHandler("Não foi possível atualizar o valor guardado."),
  });

  function onSubmit(values: UpdateSavingsInput) {
    execute(values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex items-start gap-3"
    >
      <Field data-invalid={!!errors.amount} className="flex-1">
        <FieldLabel htmlFor="amount">Valor guardado</FieldLabel>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          placeholder="0,00"
          aria-invalid={!!errors.amount}
          {...register("amount")}
        />
        <FieldError errors={errors.amount ? [errors.amount] : undefined} />
      </Field>

      <Button type="submit" disabled={isPending}>
        <PiggyBank />
        {isPending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
