"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { changePassword } from "@/actions/change-password";
import { useActionErrorHandler } from "@/lib/action-error";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validation/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export function PasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const { execute, isPending } = useAction(changePassword, {
    onSuccess: () => {
      toast.success("Senha alterada.");
      reset();
    },
    onError: useActionErrorHandler("Não foi possível alterar a senha."),
  });

  function onSubmit(values: ChangePasswordInput) {
    execute(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.currentPassword}>
          <FieldLabel htmlFor="current-password">Senha atual</FieldLabel>
          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.currentPassword}
            {...register("currentPassword")}
          />
          <FieldError errors={errors.currentPassword ? [errors.currentPassword] : undefined} />
        </Field>

        <Field data-invalid={!!errors.newPassword}>
          <FieldLabel htmlFor="new-password">Nova senha</FieldLabel>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            {...register("newPassword")}
          />
          <FieldError errors={errors.newPassword ? [errors.newPassword] : undefined} />
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirm-password">Confirmar nova senha</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          <FieldError errors={errors.confirmPassword ? [errors.confirmPassword] : undefined} />
        </Field>

        <Button type="submit" disabled={isPending} className="w-fit">
          {isPending ? "Alterando..." : "Alterar senha"}
        </Button>
      </FieldGroup>
    </form>
  );
}
