import Link from "next/link";
import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SetActiveHouseholdButton } from "@/components/households/set-active-household-button";

type HouseholdSummary = {
  id: string;
  name: string;
  role: "ADMIN" | "MEMBER";
};

const ROLE_LABEL: Record<HouseholdSummary["role"], string> = {
  ADMIN: "Admin",
  MEMBER: "Membro",
};

export function HouseholdsList({
  households,
  activeHouseholdId,
}: {
  households: HouseholdSummary[];
  activeHouseholdId: string | null;
}) {
  const active = households.find((household) => household.id === activeHouseholdId);
  const others = households
    .filter((household) => household.id !== activeHouseholdId)
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const orderedHouseholds = active ? [active, ...others] : others;

  return (
    <div className="flex flex-col gap-3">
      {orderedHouseholds.map((household) => {
        const isActive = household.id === activeHouseholdId;

        return (
          <Card key={household.id}>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">
                {household.name}
                {isActive && <Badge>Ativa</Badge>}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">{ROLE_LABEL[household.role]}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2">
              {!isActive && <SetActiveHouseholdButton householdId={household.id} />}
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={`/households/${household.id}`} />}
              >
                <Pencil />
                Editar
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
