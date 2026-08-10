"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { mapAuthError } from "@/lib/auth-errors";

export function useActionErrorHandler(fallbackMessage = "Algo deu errado. Tente novamente.") {
  const router = useRouter();

  return ({ error }: { error: { serverError?: string } }) => {
    if (error.serverError === "SESSION_EXPIRED") {
      toast.error(mapAuthError("SESSION_EXPIRED"));
      router.push("/");
      return;
    }

    toast.error(error.serverError ?? fallbackMessage);
  };
}
