import { z } from "zod";

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/lib/validation/password-policy";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.email("E-mail inválido"),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, "A senha deve ter ao menos 8 caracteres")
    .max(PASSWORD_MAX_LENGTH, "A senha deve ter no máximo 128 caracteres"),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const checkEmailSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("E-mail inválido")),
});
