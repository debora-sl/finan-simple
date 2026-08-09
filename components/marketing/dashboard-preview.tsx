import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const EXAMPLE_DISTRIBUTION = [
  { name: "Moradia", color: "moradia", percent: 38 },
  { name: "Mercado", color: "mercado", percent: 27 },
  { name: "Transporte", color: "transporte", percent: 15 },
  { name: "Saúde", color: "saude", percent: 12 },
];

export function DashboardPreview() {
  return (
    <section className="flex flex-col gap-6 py-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Um dashboard para acompanhar a residência
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Visualize a distribuição das despesas por categoria e o quanto já foi consumido do mês.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Despesas por categoria</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Progress value={68}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Orçamento do mês utilizado</span>
              <span className="text-muted-foreground">68%</span>
            </div>
          </Progress>

          <div className="flex flex-col gap-3">
            {EXAMPLE_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: `var(--cat-${item.color})` }}
                    />
                    {item.name}
                  </span>
                  <span className="text-muted-foreground">{item.percent}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: `var(--cat-${item.color})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
