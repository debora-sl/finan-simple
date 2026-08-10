"use server";

import { actionClient } from "@/lib/action-client";
import { checkEmailSchema } from "@/lib/validation/auth";
import { getUserByEmail } from "@/data/users";

export const checkEmailExists = actionClient
  .inputSchema(checkEmailSchema)
  .action(async ({ parsedInput }) => {
    const user = await getUserByEmail(parsedInput.email);

    return { exists: Boolean(user) };
  });
