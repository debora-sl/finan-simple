"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { mapAuthError } from "@/lib/auth-errors";
import { signupSchema, type SignupInput } from "@/lib/validation/auth";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });

  async function onSubmit(values: SignupInput) {
    setIsLoading(true);

    await authClient.signUp.email(
      { name: values.name, email: values.email, password: values.password },
      {
        onSuccess: () => {
          router.push("/expenses");
        },
        onError: (ctx) => {
          if (ctx.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
            setError("email", { message: mapAuthError(ctx.error.code) });
          } else {
            toast.error(mapAuthError(ctx.error.code));
          }
        },
      }
    );

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

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
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FieldDescription>
            Use ao menos 8 caracteres e no máximo 128 caracteres.
          </FieldDescription>
          <PasswordRequirements password={password} />
          <FieldError errors={errors.password ? [errors.password] : undefined} />
        </Field>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Criando conta..." : "Criar conta"}
        </Button>
      </FieldGroup>
    </form>
  );
}
