import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    return e.message || "Algo deu errado. Tente novamente.";
  },
});

export const protectedActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Não autorizado.");
  }

  return next({ ctx: { user: { id: session.user.id } } });
});
