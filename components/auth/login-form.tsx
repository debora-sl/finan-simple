"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { mapAuthError } from "@/lib/auth-errors";
import { checkEmailExists } from "@/actions/check-email-exists";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginInput) {
    setIsLoading(true);

    const emailCheck = await checkEmailExists({ email: values.email });

    if (emailCheck?.data?.exists === false) {
      toast.error("Não encontramos uma conta com este e-mail. Que tal criar uma?");
      setIsLoading(false);
      return;
    }

    await authClient.signIn.email(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          router.push("/expenses");
        },
        onError: (ctx) => {
          toast.error(ctx.error.status === 403 ? mapAuthError(403) : "Senha incorreta.");
        },
      }
    );

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError errors={errors.email ? [errors.email] : undefined} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FieldError errors={errors.password ? [errors.password] : undefined} />
        </Field>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </FieldGroup>
    </form>
  );
}
