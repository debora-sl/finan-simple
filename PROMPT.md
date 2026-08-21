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

## Spec 011 — Calculador de Dívidas + card "Total Pagantes" no Dashboard (Média)

Entrega, numa **spec única**, duas partes acopladas: (1) uma nova página **Calculador de Dívidas** onde o
usuário escolhe um mês, vê o total de despesas daquele mês e informa quantos **pagantes** vão dividir a
conta, obtendo o valor por pagante; e (2) um card **Total Pagantes** no Dashboard que exibe o número de
pagantes informado para o mês selecionado. As duas partes compartilham o mesmo armazenamento (o número de
pagantes por mês), por isso vão juntas: o Calculador **grava** o dado e o card do Dashboard **lê**.

Exemplo do fluxo: em Julho o total de despesas é R$ 1.000,00; o usuário informa 3 pagantes → o Calculador
mostra R$ 333,33 por pagante e guarda "3 pagantes em Julho"; o card do Dashboard, com Julho selecionado,
mostra "3".

Contexto atual (já verificado):

- **Não existe conceito de pagante** em `Expense` (`prisma/schema.prisma`): o model só tem `description`,
  `amountInCents`, `dueDate`/`paidDate` (`DateTime? @db.Date`, nullable), `categoryId`, `householdId`.
- Já existe `getAvailableMonths(householdId)` em `data/expenses.ts` (agrupa `dueDate` por mês) e
  `lib/report-period.ts` com `toMonthValue` / `formatMonthLabel` — reaproveitar para o seletor e o recorte.
- `getDashboardSummary(householdId, period)` em `data/dashboard.ts` já agrega o total por mês via `dueDate`
  (recorte `{ gte, lt }`) — reaproveitar a lógica para obter o total do mês no Calculador.
- `formatCentsAsCurrency` em `lib/money.ts` para exibir valores em R$.
- `SummaryCards` (`components/dashboard/summary-cards.tsx`) hoje **só** renderiza valores monetários
  (`formatCentsAsCurrency`) — não sabe exibir uma contagem inteira.
- Menu em `components/layout/app-sidebar.tsx` (array `NAV_ITEMS`); ícones via `lucide-react`.

O que a spec precisa definir:

- **Persistência dos pagantes por mês (exige migration)**: novo model no Prisma para guardar o número de
  pagantes por residência e mês (ex.: `MonthlyPayers { id, householdId, year, month, payersCount, ... }` com
  `@@unique([householdId, year, month])` e `onDelete: Cascade` na residência). Definir a migration.
- **Gravação via Server Action**: criar/atualizar o número de pagantes do mês com `next-safe-action` +
  `protectedActionClient` (usando `.inputSchema`), na pasta `actions/`, autorizando pela residência ativa
  do usuário (só membros da residência podem gravar). `revalidatePath` das rotas afetadas.
- **Leitura via `data/`**: funções que retornam (a) o total de despesas do mês selecionado e (b) o número de
  pagantes gravado para aquele mês (ex.: `getMonthlyPayersCount(householdId, period)`), sem chamar Prisma de
  componente.
- **Nova página + item no menu**: rota nova (ex.: `/debt-calculator`) e entrada em `NAV_ITEMS` com ícone
  `lucide-react` (ex.: `Calculator`). Seletor de mês reutilizando os meses disponíveis; ao escolher o mês,
  mostrar o total do mês e um campo para o número de pagantes (N inteiro ≥ 1).
- **Cálculo do valor por pagante**: valor por pagante = total ÷ N. Definir e documentar o **arredondamento**
  (ex.: `Math.round` em centavos) e o tratamento do **resto** (recomendação: exibir apenas o valor por
  pagante, sem "acerto de sobra").
- **Card no Dashboard**: adaptar `SummaryCards` para suportar um **tile de contagem** (número inteiro, sem
  R$), sem quebrar os cards monetários atuais. Ícone `lucide-react` (ex.: `Users`). O card **varia com o mês
  selecionado** no Dashboard (spec 010); quando não houver pagantes informado para o mês, definir o estado
  (ex.: "—" ou "não informado").
- **Despesas sem `dueDate`**: decidir se entram num bucket "Sem data" ou ficam fora do Calculador e do card —
  documentar (coerente com a decisão da spec 010).
- **Estados vazios**: mensagem quando a residência não tem despesas com mês, e quando o número de pagantes
  ainda não foi informado.

Restrições e padrões: usar **apenas** componentes shadcn/ui e tokens de tema (`app/globals.css`); medidas em
`rem`; ícones `lucide-react`; Prisma só em `data/`; mutações via Server Actions conforme acima; ESLint limpo.

Fora de escopo: exibir "Total Pagantes" na tela de Despesas (decidido manter só no Calculador + Dashboard);
comparação entre meses/série temporal; exportação de relatório; rateio desigual entre pagantes; edição de
pagantes fora do Calculador.
