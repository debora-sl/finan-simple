"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

import { switchActiveHousehold } from "@/actions/switch-active-household";
import { useActionErrorHandler } from "@/lib/action-error";
import { Button } from "@/components/ui/button";

export function SetActiveHouseholdButton({ householdId }: { householdId: string }) {
  const router = useRouter();

  const { execute, isPending } = useAction(switchActiveHousehold, {
    onSuccess: () => {
      router.refresh();
    },
    onError: useActionErrorHandler("Não foi possível trocar de residência."),
  });

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => execute({ householdId })}
    >
      Definir como ativa
    </Button>
  );
}
