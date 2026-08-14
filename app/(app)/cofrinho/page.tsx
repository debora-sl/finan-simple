import { getActiveHousehold } from "@/lib/active-household";
import { getHouseholdSavings } from "@/data/savings";
import { formatCentsAsCurrency } from "@/lib/money";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavingsForm } from "@/components/savings/savings-form";

export default async function CofrinhoPage() {
  const { householdId } = await getActiveHousehold();
  const savingsInCents = await getHouseholdSavings(householdId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Cofrinho
        </h1>
        <p className="text-sm text-muted-foreground">
          Valor guardado pela residência.
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{formatCentsAsCurrency(savingsInCents)}</CardTitle>
        </CardHeader>
        <CardContent>
          <SavingsForm savingsInCents={savingsInCents} />
        </CardContent>
      </Card>
    </div>
  );
}
