"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { updateProfile } from "@/actions/update-profile";
import { useActionErrorHandler } from "@/lib/action-error";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validation/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name },
  });

  const { execute, isPending } = useAction(updateProfile, {
    onSuccess: () => toast.success("Perfil atualizado."),
    onError: useActionErrorHandler("Não foi possível atualizar o perfil."),
  });

  function onSubmit(values: UpdateProfileInput) {
    execute(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="profile-name">Nome</FieldLabel>
          <Input
            id="profile-name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-email">E-mail</FieldLabel>
          <Input id="profile-email" type="email" value={email} disabled readOnly />
          <FieldDescription>O e-mail não pode ser alterado.</FieldDescription>
        </Field>

        <Button type="submit" disabled={isPending} className="w-fit">
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </FieldGroup>
    </form>
  );
}
