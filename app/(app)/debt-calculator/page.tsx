import { Calculator } from "lucide-react";

import { getActiveHousehold } from "@/lib/active-household";
import { resolveReportPeriod, periodToValue } from "@/lib/report-period";
import { formatCentsAsCurrency } from "@/lib/money";
import { getAvailableMonths } from "@/data/expenses";
import { getDashboardSummary } from "@/data/dashboard";
import { getMonthlyPayers } from "@/data/payers";
import { MonthSelector } from "@/components/shared/month-selector";
import { DebtCalculatorForm } from "@/components/debt-calculator/debt-calculator-form";
import { Card, CardContent } from "@/components/ui/card";

type DebtCalculatorPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DebtCalculatorPage({ searchParams }: DebtCalculatorPageProps) {
  const { householdId } = await getActiveHousehold();
  const months = await getAvailableMonths(householdId);

  const header = (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Calculador de Dívidas
      </h1>
      <p className="text-sm text-muted-foreground">
        Divida o total de despesas do mês entre os pagantes.
      </p>
    </div>
  );

  if (months.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
          <Calculator className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Nenhum mês disponível</p>
          <p className="text-sm text-muted-foreground">
            Registre despesas com data de vencimento para calcular o valor por pagante.
          </p>
        </div>
      </div>
    );
  }

  const monthParam = (await searchParams).month;
  const rawPeriod = resolveReportPeriod(monthParam);
  const period = rawPeriod.kind === "month" ? rawPeriod : resolveReportPeriod(undefined);

  if (period.kind !== "month") {
    throw new Error("Calculador de Dívidas requer um mês selecionado");
  }

  const [summary, payersCount] = await Promise.all([
    getDashboardSummary(householdId, period),
    getMonthlyPayers(householdId, period.year, period.month),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {header}
        <MonthSelector months={months} value={periodToValue(period)} includeAllOption={false} />
      </div>

      <Card className="max-w-xl">
        <CardContent className="flex flex-col gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Total do mês</p>
            <p className="cf-money text-2xl font-semibold text-foreground">
              {formatCentsAsCurrency(summary.totalInCents)}
            </p>
          </div>

          <DebtCalculatorForm
            year={period.year}
            month={period.month}
            totalInCents={summary.totalInCents}
            payersCount={payersCount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
