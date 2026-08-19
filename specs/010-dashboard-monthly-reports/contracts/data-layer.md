# Contract — Camada de Dados (`data/`)

Todas as funções recebem `householdId` já resolvido por `getActiveHousehold()` e escopam a leitura pela
residência ativa (FR-016). Nenhuma chamada a Prisma fora de `data/` (Princípio II).

## `lib/report-period.ts` (helper puro, não acessa dados)

### `resolveReportPeriod(monthParam?: string | string[]): ReportPeriod`
- **Entrada**: valor cru do query param `month` (`string | string[] | undefined`).
- **Saída**: `ReportPeriod` (ver data-model).
- **Regras**:
  - `undefined`/inválido ⇒ **mês atual**, derivado no **fuso fixo `America/Sao_Paulo`** (constante `APP_TIME_ZONE`) via `Intl.DateTimeFormat(...).formatToParts` (FR-002), nunca do fuso do servidor nem de `getUTC*` crus.
  - `"all"` ⇒ `{ kind: "all" }`.
  - `"YYYY-MM"` ⇒ `{ kind: "month", year, month, gte, lt }` (limites via `Date.UTC`, intervalo `[gte, lt)`).

### `formatMonthLabel(year: number, month: number): string`
- **Saída**: rótulo pt-BR, ex.: `"agosto de 2026"` (via `Intl.DateTimeFormat`).

### `toMonthValue(year: number, month: number): string`
- **Saída**: `"YYYY-MM"` (zero-padded).

### `parseMonthValue(value: string): { year: number; month: number } | null`
- **Saída**: `{ year, month }` a partir de `"YYYY-MM"`; `null` se inválido. Usado pelo seletor para rotular o recorte atual ausente da lista de meses.

### `periodToValue(period: ReportPeriod): string`
- **Saída**: `"all"` ou `"YYYY-MM"` — valor do `Select`/param da URL correspondente ao recorte resolvido.

## `data/expenses.ts`

### `getAvailableMonths(householdId: string): Promise<AvailableMonth[]>`
- **Comportamento**: retorna meses distintos com `dueDate` não nulo na residência, do mais recente ao
  mais antigo (FR-007). Cada item: `{ year, month, value: "YYYY-MM", label }`.
- **Vazio**: residência sem despesas datadas ⇒ `[]` (o seletor adiciona "Todos os meses" e o mês atual na UI).

### `getExpenses(householdId: string, period?: ReportPeriod)` *(modificado)*
- **`period` omitido ou `{ kind: "all" }`**: retorna todas as despesas (inclui `dueDate` nulo) — comportamento atual (FR-014, FR-009).
- **`{ kind: "month" }`**: `where.dueDate = { gte, lt }`; exclui `dueDate` nulo (FR-014).
- **Invariável**: `include: { category: true }`, ordenação por `dueDate` asc (nulls last) preservada.

## `data/dashboard.ts`

### `getDashboardSummary(householdId: string, period?: ReportPeriod): Promise<DashboardSummary>` *(modificado)*
- Aplica o mesmo filtro de `dueDate` a **todas** as agregações: total, pago (`paidDate not null` + filtro
  de mês), pendente (derivado) e `groupBy` por categoria (FR-003, FR-010).
- **`period` omitido/`all`**: sem filtro de data ⇒ números idênticos ao comportamento anterior (SC-008).
- **`{ kind: "month" }`**: `where` base recebe `dueDate: { gte, lt }` em todos os `aggregate`/`groupBy`;
  despesas com `dueDate` nulo ficam de fora (FR-006).
- `hasExpenses`: verdadeiro apenas se houver despesas **no recorte** (FR-011).
- **Não** altera o cofrinho (calculado à parte por `getHouseholdSavings`, FR-012).

## Erros / Autorização
- `householdId` provém de sessão autenticada (`getActiveHousehold` → `verifySession`); funções não recebem
  household arbitrário do cliente. Params inválidos de mês degradam para o padrão (mês atual), sem erro.
