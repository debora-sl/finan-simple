import { Plus } from "lucide-react";

import { getActiveHousehold } from "@/lib/active-household";
import { resolveReportPeriod, periodToValue } from "@/lib/report-period";
import { getExpenses, getAvailableMonths } from "@/data/expenses";
import { getCategories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { MonthSelector } from "@/components/shared/month-selector";

type ExpensesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ExpensesPage({ searchParams }: ExpensesPageProps) {
  const { householdId } = await getActiveHousehold();
  const period = resolveReportPeriod((await searchParams).month);
  const [expenses, categories, months] = await Promise.all([
    getExpenses(householdId, period),
    getCategories(householdId),
    getAvailableMonths(householdId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Despesas
          </h1>
          <p className="text-sm text-muted-foreground">
            Registre e acompanhe suas despesas.
          </p>
        </div>
        <ExpenseForm
          categories={categories}
          trigger={
            <Button>
              <Plus />
              Adicionar despesa
            </Button>
          }
        />
      </div>

      <MonthSelector months={months} value={periodToValue(period)} />

      <ExpenseTable expenses={expenses} categories={categories} />
    </div>
  );
}
