import { z } from "zod";

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/lib/validation/password-policy";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome obrigatório")
    .max(60, "Nome deve ter no máximo 60 caracteres"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual"),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "A nova senha deve ter no mínimo 8 caracteres")
      .max(PASSWORD_MAX_LENGTH, "A nova senha deve ter no máximo 128 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "A nova senha deve ser diferente da atual",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Informe sua senha"),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
