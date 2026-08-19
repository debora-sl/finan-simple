# Prompt para o `/speckit-specify`

> Cole o bloco abaixo como argumento do `/speckit-specify` e siga o fluxo completo do Spec Kit
> (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`) em PR próprio.
> Este arquivo contém **apenas a spec ativa** (uma por vez). As próximas da fila e o detalhamento completo
> ficam em `docs/proximos-passos-melhorias.md`.
>
> Restrições da constituição (`CLAUDE.md` / `AGENTS.md`) valem para toda spec: shadcn/ui como única lib de
> componentes; cores só via tokens de `app/globals.css`; medidas em `rem`; ícones `lucide-react`; Prisma
> só em `data/`; mutações via Server Actions (`next-safe-action` + `protectedActionClient`, com `.inputSchema`);
> ESLint limpo; não rodar `npm run dev`.

---

## Spec 010 — Dashboard: relatórios por mês (Média)

Adiciona ao Dashboard a opção de **filtrar/mostrar os relatórios por mês**. Hoje o Dashboard
(`app/(app)/dashboard/page.tsx`) sempre agrega **todas** as despesas da residência ativa, sem recorte
temporal. Esta spec introduz um seletor de mês que recorta total, pago, pendente e distribuição por
categoria por `dueDate`, e — como sugestão dobrada — aplica o mesmo recorte na página de Despesas para
manter a experiência consistente nos dois lugares.

Contexto atual (já verificado):

- `data/dashboard.ts` (`getDashboardSummary(householdId)`) agrega total, pago, pendente e distribuição por
  categoria de **todas** as despesas, sem filtro de data.
- A despesa (`Expense` em `prisma/schema.prisma`) tem `dueDate` e `paidDate` como `DateTime? @db.Date` (ambos
  **nullable**), com índice `@@index([householdId, dueDate])`. Datas de despesa vieram da spec 005.
- A UI usa `SummaryCards` e `CategoryBreakdown`; o cofrinho (`getHouseholdSavings`) é saldo acumulado, não
  mensal.
- A página de Despesas (`app/(app)/expenses/page.tsx` + `data/expenses.ts`) também lista tudo sem recorte de
  mês.

O que a spec precisa definir:

- **Seletor de mês**: controle (shadcn `Select` ou similar) que lista os meses disponíveis e escolhe o mês do
  relatório. Definir o campo de referência (`dueDate` como mês da despesa) e o padrão inicial (mês atual ou
  "Todos"). Decidir o tratamento de despesas **sem `dueDate`** (bucket "Sem data" / fora do recorte) e
  documentar. Usar apenas componentes shadcn/ui e tokens de tema; medidas em `rem`; ícones `lucide-react`.
- **Meses disponíveis via `data/`**: expor em `data/dashboard.ts` a lista de meses com despesas na residência
  (para popular o seletor), sem chamar Prisma de componente.
- **Agregação por mês**: `getDashboardSummary` passa a aceitar o mês/intervalo e filtra total, pago, pendente e
  distribuição por categoria por esse recorte, sem quebrar os consumidores atuais. Refletir em `SummaryCards` e
  `CategoryBreakdown`.
- **Estados vazios**: manter o "nenhuma despesa" já existente, agora coerente com o mês selecionado.
- **Cofrinho**: decidir explicitamente se o card é afetado pelo mês (recomendação: **não**, por ser saldo
  acumulado).
- **Consistência com Despesas (sugestão dobrada)**: aplicar o **mesmo filtro de mês na página de Despesas**,
  reutilizando o seletor e a lógica de recorte, para o usuário ter a mesma experiência nos dois lugares.

Fora de escopo: comparação entre meses/série temporal; exportação de relatório; migration; filtro por intervalo
customizado (só recorte por mês).
