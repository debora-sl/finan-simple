"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { createHousehold } from "@/actions/create-household";
import { householdSchema, type HouseholdInput } from "@/lib/validation/household";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export function HouseholdForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HouseholdInput>({
    resolver: zodResolver(householdSchema),
  });

  const { execute, isPending } = useAction(createHousehold, {
    onSuccess: () => {
      toast.success("Residência criada.");
      router.push("/dashboard");
    },
    onError: ({ error }: { error: { serverError?: string } }) => {
      toast.error(error.serverError ?? "Não foi possível criar a residência.");
    },
  });

  function onSubmit(values: HouseholdInput) {
    execute(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="household-name">Nome da residência</FieldLabel>
          <Input
            id="household-name"
            placeholder="Ex: Casa Mãe"
            autoComplete="off"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Criando..." : "Criar residência"}
        </Button>
      </FieldGroup>
    </form>
  );
}
