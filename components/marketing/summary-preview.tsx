import { CheckCircle2, Clock, Wallet } from "lucide-react";

import { formatCentsAsCurrency } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type Tone = "action" | "positive" | "warning";

const TONE_CLASSES: Record<Tone, string> = {
  action: "bg-action-soft text-action-soft-foreground",
  positive: "bg-positive-soft text-positive-foreground",
  warning: "bg-warning-soft text-warning-foreground",
};

const EXAMPLE_TILES = [
  { label: "Total", valueInCents: 482000, tone: "action" as Tone, icon: Wallet },
  { label: "Pago", valueInCents: 316000, tone: "positive" as Tone, icon: CheckCircle2 },
  { label: "Pendente", valueInCents: 166000, tone: "warning" as Tone, icon: Clock },
];

export function SummaryPreview() {
  return (
    <section className="flex flex-col gap-6 py-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Um resumo claro de cada mês
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Veja de relance o total, o que já foi pago e o que ainda está pendente na residência.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {EXAMPLE_TILES.map(({ label, valueInCents, tone, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4">
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-lg",
                  TONE_CLASSES[tone]
                )}
              >
                <Icon className="size-5" />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="cf-money text-xl font-semibold text-foreground">
                  {formatCentsAsCurrency(valueInCents)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
