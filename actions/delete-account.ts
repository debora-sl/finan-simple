"use server";

import { headers } from "next/headers";
import { APIError } from "better-auth/api";

import { protectedActionClient } from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { mapAuthError } from "@/lib/auth-errors";
import { deleteAccountSchema } from "@/lib/validation/profile";

export const deleteAccount = protectedActionClient
  .inputSchema(deleteAccountSchema)
  .action(async ({ parsedInput }) => {
    try {
      await auth.api.deleteUser({
        body: { password: parsedInput.password },
        headers: await headers(),
      });
    } catch (error) {
      if (error instanceof APIError) {
        if (error.body?.code === "INVALID_PASSWORD") {
          throw new Error("Senha incorreta.");
        }

        throw new Error(mapAuthError(error.body?.code));
      }

      throw error;
    }
  });
