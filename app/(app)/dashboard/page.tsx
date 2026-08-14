import { LayoutDashboard } from "lucide-react";

import { getActiveHousehold } from "@/lib/active-household";
import { getDashboardSummary } from "@/data/dashboard";
import { getHouseholdSavings } from "@/data/savings";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";

export default async function DashboardPage() {
  const { householdId } = await getActiveHousehold();
  const [summary, savingsInCents] = await Promise.all([
    getDashboardSummary(householdId),
    getHouseholdSavings(householdId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral das suas despesas.
        </p>
      </div>

      <SummaryCards
        totalInCents={summary.totalInCents}
        paidInCents={summary.paidInCents}
        pendingInCents={summary.pendingInCents}
        savingsInCents={savingsInCents}
      />

      {summary.hasExpenses ? (
        <CategoryBreakdown
          totalInCents={summary.totalInCents}
          byCategory={summary.byCategory}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
          <LayoutDashboard className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Nenhuma despesa registrada</p>
          <p className="text-sm text-muted-foreground">
            Registre despesas para ver totais e a distribuição por categoria.
          </p>
        </div>
      )}
    </div>
  );
}
