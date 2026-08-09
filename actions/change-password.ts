"use server";

import { headers } from "next/headers";
import { APIError } from "better-auth/api";

import { protectedActionClient } from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validation/profile";

export const changePassword = protectedActionClient
  .inputSchema(changePasswordSchema)
  .action(async ({ parsedInput }) => {
    try {
      await auth.api.changePassword({
        body: {
          currentPassword: parsedInput.currentPassword,
          newPassword: parsedInput.newPassword,
          revokeOtherSessions: true,
        },
        headers: await headers(),
      });
    } catch (error) {
      if (error instanceof APIError) {
        if (error.body?.code === "INVALID_PASSWORD") {
          throw new Error("Senha atual incorreta.");
        }

        throw new Error("Não foi possível alterar a senha.");
      }

      throw error;
    }
  });
