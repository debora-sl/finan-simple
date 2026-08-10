"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { Plus } from "lucide-react";

import { switchActiveHousehold } from "@/actions/switch-active-household";
import { useActionErrorHandler } from "@/lib/action-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CREATE_NEW = "__create-new__";

type HouseholdSummary = { id: string; name: string; role: string };

export function HouseholdSwitcher({
  households,
  activeHouseholdId,
}: {
  households: HouseholdSummary[];
  activeHouseholdId: string;
}) {
  const router = useRouter();

  const { execute, isPending } = useAction(switchActiveHousehold, {
    onSuccess: () => {
      router.refresh();
    },
    onError: useActionErrorHandler("Não foi possível trocar de residência."),
  });

  function handleValueChange(value: string | null) {
    if (value === CREATE_NEW) {
      router.push("/households/new");
      return;
    }

    if (value && value !== activeHouseholdId) {
      execute({ householdId: value });
    }
  }

  return (
    <Select
      value={activeHouseholdId}
      onValueChange={handleValueChange}
      disabled={isPending}
      items={[
        ...households.map((household) => ({ value: household.id, label: household.name })),
        { value: CREATE_NEW, label: "Criar nova residência" },
      ]}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {households.map((household) => (
          <SelectItem key={household.id} value={household.id}>
            {household.name}
          </SelectItem>
        ))}
        <SelectSeparator />
        <SelectItem value={CREATE_NEW}>
          <Plus className="size-4" />
          Criar nova residência
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
