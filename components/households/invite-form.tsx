"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { inviteMember } from "@/actions/invite-member";
import { useActionErrorHandler } from "@/lib/action-error";
import { inviteMemberSchema, type InviteMemberInput } from "@/lib/validation/invitation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export function InviteForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
  });

  const { execute, isPending } = useAction(inviteMember, {
    onSuccess: () => {
      toast.success("Convite enviado.");
      reset();
    },
    onError: useActionErrorHandler("Não foi possível enviar o convite."),
  });

  function onSubmit(values: InviteMemberInput) {
    execute(values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex items-start gap-3"
    >
      <Field data-invalid={!!errors.email} className="flex-1">
        <FieldLabel htmlFor="invite-email">Convidar por e-mail</FieldLabel>
        <Input
          id="invite-email"
          type="email"
          placeholder="nome@email.com"
          autoComplete="off"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <FieldError errors={errors.email ? [errors.email] : undefined} />
      </Field>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Enviando..." : "Convidar"}
      </Button>
    </form>
  );
}
