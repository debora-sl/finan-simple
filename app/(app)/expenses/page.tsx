import { Plus } from "lucide-react";

import { getActiveHousehold } from "@/lib/active-household";
import { getExpenses } from "@/data/expenses";
import { getCategories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { ExpenseTable } from "@/components/expenses/expense-table";

export default async function ExpensesPage() {
  const { householdId } = await getActiveHousehold();
  const [expenses, categories] = await Promise.all([
    getExpenses(householdId),
    getCategories(householdId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
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

      <ExpenseTable expenses={expenses} categories={categories} />
    </div>
  );
}
