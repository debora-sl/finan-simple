# Phase 1 — Data Model: Dashboard relatórios por mês

Esta feature **não altera o schema Prisma** e não cria entidades persistidas. Abaixo estão os tipos
derivados/de domínio introduzidos no código.

## Entidade persistida (inalterada) — Expense

Campos relevantes ao recorte (ver `prisma/schema.prisma`):

| Campo | Tipo | Observação |
|-------|------|------------|
| `amountInCents` | `Int` | Base de total/pago/pendente/categoria |
| `paidDate` | `DateTime? @db.Date` | Não nulo ⇒ despesa **paga** |
| `dueDate` | `DateTime? @db.Date` | **Referência do mês**; pode ser nulo |
| `categoryId` | `String?` | Distribuição por categoria; nulo ⇒ "Sem categoria" |
| `householdId` | `String` | Escopo da residência ativa |

Índices usados: `@@index([householdId, dueDate])` (filtro por mês), `@@index([householdId, categoryId])`.

## Tipo de domínio — ReportPeriod (`lib/report-period.ts`)

Representa o recorte selecionado. União discriminada:

```ts
type ReportPeriod =
  | { kind: "all" }
  | { kind: "month"; year: number; month: number; gte: Date; lt: Date };
```

- **Regras**:
  - `kind: "all"` ⇒ sem filtro de `dueDate` (inclui despesas com `dueDate` nulo). FR-005.
  - `kind: "month"` ⇒ filtro `dueDate: { gte, lt }`, intervalo semiaberto `[gte, lt)`; exclui `dueDate` nulo. FR-002/FR-006.
  - `month` é 1–12; `gte`/`lt` construídos com `Date.UTC(year, month - 1, 1)` e `Date.UTC(year, month, 1)`, compatível com `dueDate @db.Date`.
- **Fuso (FR-002)**: o **mês atual** (default) é derivado no **fuso fixo `America/Sao_Paulo`**
  (constante `APP_TIME_ZONE`), via
  `Intl.DateTimeFormat("en-CA", { timeZone: APP_TIME_ZONE, year: "numeric", month: "2-digit" }).formatToParts(new Date())`,
  nunca do fuso do servidor (`getFullYear`/`getMonth`) nem de `getUTC*` crus. Após determinar
  `(year, month)` nesse fuso, os limites `gte`/`lt` são calculados em UTC como acima.
- **Derivação a partir do param da URL** (`resolveReportPeriod(monthParam?: string | string[]): ReportPeriod`):
  - `"all"` ⇒ `{ kind: "all" }`.
  - `"YYYY-MM"` válido ⇒ `{ kind: "month", ... }`.
  - ausente/ inválido ⇒ **mês atual** (default, FR-004), no fuso fixo `America/Sao_Paulo`.
- **Helpers correlatos** (`lib/report-period.ts`): `toMonthValue(year, month) → "YYYY-MM"`,
  `parseMonthValue("YYYY-MM") → { year, month } | null`, `formatMonthLabel(year, month) → "agosto de 2026"`
  e `periodToValue(period) → "all" | "YYYY-MM"` (valor do `Select`/param da URL a partir do `ReportPeriod` resolvido).

## Tipo de domínio — AvailableMonth (`data/expenses.ts`)

Alimenta o seletor; derivado das despesas, não persistido (FR-007).

```ts
type AvailableMonth = { year: number; month: number; value: string; label: string };
```

- `value`: `"YYYY-MM"` (usado como valor do `Select` e do param da URL).
- `label`: "agosto de 2026" (pt-BR, via `Intl`).
- **Origem**: despesas da residência ativa com `dueDate` não nulo, meses distintos, ordenados do mais
  recente para o mais antigo.

## Tipo de retorno — DashboardSummary (inalterado na forma)

`getDashboardSummary(householdId, period?)` mantém o shape atual (`hasExpenses`, `totalInCents`,
`paidInCents`, `pendingInCents`, `byCategory[]`); apenas os números passam a refletir o `period`.
`hasExpenses` reflete a existência de despesas **dentro do recorte** (coerência do estado vazio, FR-011).

## Fora do recorte por mês

- **Cofrinho** (`getHouseholdSavings`): saldo acumulado, **não** recebe `period` (FR-012).
