import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const getSessionData = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export const verifySession = cache(async () => {
  const session = await getSessionData();

  if (!session) {
    redirect("/");
  }

  return { userId: session.user.id };
});

export const getCurrentUser = cache(async () => {
  await verifySession();
  const session = await getSessionData();

  return {
    id: session!.user.id,
    name: session!.user.name,
    email: session!.user.email,
  };
});
