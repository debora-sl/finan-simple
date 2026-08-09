"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { updateHousehold } from "@/actions/update-household";
import { updateHouseholdSchema, type UpdateHouseholdInput } from "@/lib/validation/household";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export function HouseholdNameForm({ id, name }: { id: string; name: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateHouseholdInput>({
    resolver: zodResolver(updateHouseholdSchema),
    defaultValues: { id, name },
  });

  const { execute, isPending } = useAction(updateHousehold, {
    onSuccess: () => toast.success("Nome da residência atualizado."),
    onError: ({ error }: { error: { serverError?: string } }) => {
      toast.error(error.serverError ?? "Não foi possível atualizar a residência.");
    },
  });

  function onSubmit(values: UpdateHouseholdInput) {
    execute(values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex items-start gap-3"
    >
      <input type="hidden" {...register("id")} />
      <Field data-invalid={!!errors.name} className="flex-1">
        <FieldLabel htmlFor="household-name">Nome da residência</FieldLabel>
        <Input
          id="household-name"
          autoComplete="off"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        <FieldError errors={errors.name ? [errors.name] : undefined} />
      </Field>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
