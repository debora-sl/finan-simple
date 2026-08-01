import { LayoutDashboard } from "lucide-react";

import { verifySession } from "@/lib/dal";
import { getDashboardSummary } from "@/data/dashboard";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";

export default async function DashboardPage() {
  const { userId } = await verifySession();
  const summary = await getDashboardSummary(userId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral das suas despesas.
        </p>
      </div>

      {summary.hasExpenses ? (
        <>
          <SummaryCards
            totalInCents={summary.totalInCents}
            paidInCents={summary.paidInCents}
            pendingInCents={summary.pendingInCents}
          />
          <CategoryBreakdown
            totalInCents={summary.totalInCents}
            byCategory={summary.byCategory}
          />
        </>
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
