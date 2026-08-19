import Link from "next/link";
import { Plus } from "lucide-react";

import { getCurrentUser } from "@/lib/dal";
import { getActiveHouseholdId, getHouseholdsForUser } from "@/data/households";
import { HouseholdsList } from "@/components/households/households-list";
import { Button } from "@/components/ui/button";

export default async function HouseholdsPage() {
  const currentUser = await getCurrentUser();

  const [activeHouseholdId, households] = await Promise.all([
    getActiveHouseholdId(currentUser.id),
    getHouseholdsForUser(currentUser.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Residência</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as residências das quais você participa.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/households/new" />}>
          <Plus />
          Criar nova residência
        </Button>
      </div>

      {households.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <div>
            <p className="text-sm font-medium text-foreground">Nenhuma residência encontrada</p>
            <p className="text-sm text-muted-foreground">
              Crie uma residência para começar a organizar suas despesas.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/households/new" />}>
            <Plus />
            Criar nova residência
          </Button>
        </div>
      ) : (
        <HouseholdsList households={households} activeHouseholdId={activeHouseholdId} />
      )}
    </div>
  );
}
