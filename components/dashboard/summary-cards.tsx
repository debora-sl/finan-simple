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

function SummaryTile({
  label,
  valueInCents,
  tone,
  icon: Icon,
}: {
  label: string;
  valueInCents: number;
  tone: Tone;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
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
  );
}

export function SummaryCards({
  totalInCents,
  paidInCents,
  pendingInCents,
}: {
  totalInCents: number;
  paidInCents: number;
  pendingInCents: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <SummaryTile label="Total Despesas" valueInCents={totalInCents} tone="action" icon={Wallet} />
      <SummaryTile label="Pago" valueInCents={paidInCents} tone="positive" icon={CheckCircle2} />
      <SummaryTile label="Pendente" valueInCents={pendingInCents} tone="warning" icon={Clock} />
    </div>
  );
}
