---
description: "Task list — Dashboard: relatórios por mês"
---

# Tasks: Dashboard — relatórios por mês

**Input**: Design documents from `/specs/010-dashboard-monthly-reports/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/data-layer.md, contracts/month-selector.md, quickstart.md

**Tests**: NÃO incluídos. O projeto não possui suíte automatizada; a validação é manual via `quickstart.md` (ver Fase de Polish). ESLint DEVE passar sem erros.

**Organization**: Tarefas agrupadas por user story para permitir implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências pendentes)
- **[Story]**: A qual user story a tarefa pertence (US1, US2)
- Todos os caminhos são relativos à raiz do repositório

## Path Conventions

Aplicação web Next.js (App Router) monolítica: `app/`, `components/`, `data/`, `lib/` na raiz.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparação de contexto. Nenhuma dependência nova é instalada (recharts, shadcn `Select`, next-safe-action e lucide-react já existem).

- [X] T001 Confirmar a assinatura de `searchParams` como `Promise` no Next 16 lendo `node_modules/next/dist/docs/` (file-conventions/page) e revisar os componentes existentes `components/ui/select.tsx`, `data/dashboard.ts`, `data/expenses.ts`, `app/(app)/dashboard/page.tsx` e `app/(app)/expenses/page.tsx` para mapear as assinaturas atuais antes de modificá-las.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura compartilhada por US1 e US2 (helper de recorte, meses disponíveis e o seletor reutilizável). MUST estar completa antes de qualquer user story.

**⚠️ CRITICAL**: Nenhuma user story pode começar até esta fase terminar.

- [X] T002 [P] Criar o helper puro `lib/report-period.ts` exportando o tipo `ReportPeriod` (`{ kind: "all" } | { kind: "month"; year; month; gte; lt }`) e as funções `resolveReportPeriod(monthParam?: string | string[])` (aceitar `string | string[] | undefined`; ausente/inválido ⇒ **mês atual**; `"all"` ⇒ `{ kind: "all" }`; `"YYYY-MM"` ⇒ `{ kind: "month", ... }`), `formatMonthLabel(year, month)` (`Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })`), `toMonthValue(year, month)` (`"YYYY-MM"` zero-padded), `parseMonthValue(value)` (`"YYYY-MM"` ⇒ `{ year, month }` ou `null` se inválido) e `periodToValue(period)` (`"all"` ou `"YYYY-MM"`). **Fuso (FR-002)**: definir a constante `APP_TIME_ZONE = "America/Sao_Paulo"`; o **mês atual** MUST ser derivado nesse fuso fixo via `Intl.DateTimeFormat("en-CA", { timeZone: APP_TIME_ZONE, year: "numeric", month: "2-digit" }).formatToParts(new Date())`, NUNCA do fuso do servidor (`getFullYear`/`getMonth`) nem de `getUTC*` crus; os limites `gte`/`lt` do mês resolvido são construídos com `Date.UTC(year, month - 1, 1)` e `Date.UTC(year, month, 1)`, intervalo semiaberto `[gte, lt)`, compatível com `dueDate @db.Date`. Sem comentários; nomes descritivos; medidas não aplicáveis.
- [X] T003 [P] Estender `data/expenses.ts` com o tipo `AvailableMonth` (`{ year; month; value; label }`) e a função `getAvailableMonths(householdId: string): Promise<AvailableMonth[]>`, que busca despesas com `dueDate` não nulo da residência (`prisma.expense.findMany({ where: { householdId, dueDate: { not: null } }, select: { dueDate: true } })`), reduz para meses distintos, ordena do mais recente ao mais antigo e mapeia cada item com `toMonthValue`/`formatMonthLabel` de `lib/report-period.ts`. Prisma somente nesta camada (Princípio II).
- [X] T004 [US-shared] Criar o Client Component `components/shared/month-selector.tsx` (`"use client"`) com props `{ months: AvailableMonth[]; value: string }`, renderizando o `Select` do shadcn/ui (`components/ui/select.tsx`) com a opção "Todos os meses" (`value="all"`) seguida de uma opção por mês (`label`/`value` de `months`); ao trocar, **preservar os demais query params** com `const searchParams = useSearchParams()` no corpo e, no handler, `const params = new URLSearchParams(searchParams.toString()); params.set("month", next);` então chamar `router.replace(\`${pathname}?${params.toString()}\`, { scroll: false })` via `useRouter`/`usePathname`/`useSearchParams` de `next/navigation`; ícone `CalendarDays` (lucide-react) no trigger; tokens de tema, medidas em `rem`, sem cor hard-coded nem comentários. **Garantir a opção do recorte atual (FR-007 + edge cases)**: quando `value` for um mês (`"YYYY-MM"`) **ausente** de `months`, adicionar no topo da lista de meses uma opção correspondente rotulada via `formatMonthLabel(parseMonthValue(value))` de `lib/report-period.ts`, de modo que o **mês atual** (recorte padrão, mesmo sem despesas) e um **mês selecionado inexistente na residência** (ex.: após troca de residência) sempre tenham um `SelectItem` correspondente e o `Select` nunca fique sem opção selecionada. Depende de T002 e T003.

**Checkpoint**: Helper de recorte, meses disponíveis e seletor prontos — US1 e US2 podem começar.

---

## Phase 3: User Story 1 - Ver o relatório do Dashboard por mês (Priority: P1) 🎯 MVP

**Goal**: O Dashboard passa a recortar total, pago, pendente e a distribuição por categoria pelo mês selecionado (por `dueDate`), iniciando no mês atual, com "Todos os meses" reproduzindo o agregado anterior. O cofrinho permanece inalterado.

**Independent Test**: Com uma residência com despesas em mais de um mês, abrir `/dashboard`, alternar o seletor entre dois meses e confirmar que total, pago, pendente e a distribuição por categoria mudam conforme o mês; "Todos os meses" reproduz os números anteriores e inclui despesas sem `dueDate`; o card do cofrinho não muda.

### Implementation for User Story 1

- [X] T005 [US1] Modificar `getDashboardSummary` em `data/dashboard.ts` para aceitar `period?: ReportPeriod` (de `lib/report-period.ts`), aplicando `where.dueDate = { gte, lt }` a TODAS as agregações (total, pago com `paidDate` não nulo, pendente derivado e `groupBy` por categoria) quando `kind === "month"`; `period` omitido ou `{ kind: "all" }` MUST manter o comportamento atual (sem filtro de data, inclui `dueDate` nulo — FR-009/SC-008). `hasExpenses` reflete a existência de despesas dentro do recorte (FR-011). Não tocar em `getHouseholdSavings` (FR-012).
- [X] T006 [US1] Modificar `app/(app)/dashboard/page.tsx` para receber `searchParams: Promise<{ [key: string]: string | string[] | undefined }>`, resolver `const period = resolveReportPeriod((await searchParams).month)`, obter `const { householdId } = await getActiveHousehold()`, buscar `getAvailableMonths(householdId)` e `getDashboardSummary(householdId, period)`, e renderizar `<MonthSelector months={months} value={periodToValue(period)} />` no topo. Cofrinho segue via `getHouseholdSavings` sem `period`. Componentes `summary-cards.tsx` e `category-breakdown.tsx` permanecem inalterados (recebem dados já recortados).

**Checkpoint**: Dashboard totalmente funcional e testável de forma independente — MVP entregável.

---

## Phase 4: User Story 2 - Filtrar a página de Despesas pelo mesmo mês (Priority: P2)

**Goal**: A página de Despesas reutiliza o mesmo seletor de mês e filtra a lista pela `dueDate` do mês selecionado, iniciando no mês atual; "Todos os meses" mostra todas (inclusive sem `dueDate`).

**Independent Test**: Abrir `/expenses`, confirmar que o seletor inicia no mês atual e a tabela mostra só as despesas desse mês; alternar o mês recarrega a tabela; "Todos os meses" mostra todas, incluindo as sem `dueDate`.

### Implementation for User Story 2

- [X] T007 [US2] Modificar `getExpenses` em `data/expenses.ts` para aceitar `period?: ReportPeriod`; quando `kind === "month"`, aplicar `where.dueDate = { gte, lt }` (exclui `dueDate` nulo — FR-014); `period` omitido ou `{ kind: "all" }` MUST retornar todas as despesas como hoje (inclui `dueDate` nulo). Preservar `include: { category: true }` e a ordenação por `dueDate` asc (nulls last).
- [X] T008 [US2] Modificar `app/(app)/expenses/page.tsx` para receber `searchParams: Promise<{ [key: string]: string | string[] | undefined }>`, resolver `const period = resolveReportPeriod((await searchParams).month)`, obter `householdId` via `getActiveHousehold()`, buscar `getAvailableMonths(householdId)` e `getExpenses(householdId, period)`, e renderizar `<MonthSelector months={months} value={periodToValue(period)} />` no topo. `expense-table.tsx` permanece inalterado (recebe a lista já filtrada).

**Checkpoint**: US1 e US2 funcionam de forma independente, compartilhando o mesmo seletor e helper de recorte.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validação final e conformidade.

- [X] T009 Rodar `pnpm lint` e corrigir todos os erros de ESLint introduzidos (Princípio: sem comentários, `rem`, tokens de tema, sem chamadas Prisma fora de `data/`).
- [ ] T010 Executar o roteiro de `specs/010-dashboard-monthly-reports/quickstart.md` (Cenários 1–9), confirmando SC-001…SC-008, o estado vazio coerente (FR-011) e a troca de residência ativa (edge case). O usuário inicia o servidor — não rodar `npm run dev` para validar.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente.
- **Foundational (Phase 2)**: Depende do Setup — BLOQUEIA todas as user stories.
- **User Stories (Phase 3–4)**: Dependem da Foundational. Depois disso, US1 e US2 são independentes entre si.
- **Polish (Phase 5)**: Depende das user stories desejadas concluídas.

### User Story Dependencies

- **US1 (P1)**: Começa após a Foundational. Sem dependência de US2.
- **US2 (P2)**: Começa após a Foundational. Sem dependência de US1 (reutiliza T004 e T002, ambos foundational).

### Within Each Story

- T005 (data) antes de T006 (page) — a página consome a função modificada.
- T007 (data) antes de T008 (page) — idem.

### Parallel Opportunities

- **Foundational**: T002 e T003 são `[P]` (arquivos diferentes, `lib/report-period.ts` e `data/expenses.ts`). T004 depende de ambos.
- **Entre stories**: após a Foundational, US1 (T005–T006) e US2 (T007–T008) podem ser tocadas em paralelo por pessoas diferentes — arquivos distintos (`data/dashboard.ts`/dashboard page vs. `getExpenses` em `data/expenses.ts`/expenses page). Atenção: `data/expenses.ts` recebe edições em T003 (foundational) e T007 (US2); serializar essas duas.

---

## Parallel Example: Foundational

```bash
# T002 e T003 em paralelo (arquivos diferentes):
Task: "Criar lib/report-period.ts (ReportPeriod + resolveReportPeriod + formatMonthLabel + toMonthValue + periodToValue)"
Task: "Estender data/expenses.ts com AvailableMonth + getAvailableMonths"
# Depois, T004 (month-selector.tsx) que depende de ambos.
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Fase 1: Setup (T001).
2. Fase 2: Foundational (T002–T004) — CRÍTICA, bloqueia as stories.
3. Fase 3: US1 (T005–T006).
4. **PARAR e VALIDAR**: testar o Dashboard isoladamente (quickstart Cenários 1–6, 8).
5. Entregar/demonstrar o MVP.

### Incremental Delivery

1. Setup + Foundational → base pronta.
2. US1 → validar → entregar (MVP: Dashboard por mês).
3. US2 → validar → entregar (Despesas espelham o recorte).
4. Polish (T009–T010) → lint limpo e quickstart completo.

---

## Notes

- `[P]` = arquivos diferentes, sem dependências pendentes.
- `[Story]` mapeia a tarefa à user story para rastreabilidade; `[US-shared]` (T004) serve a ambas e vive na Foundational por ser reutilizável (DRY, FR-013).
- Feature read-only: nenhuma Server Action nova (Princípio III N/A).
- Sem migration: o modelo `Expense` e o índice `@@index([householdId, dueDate])` já suportam o filtro.
- Commit após cada tarefa ou grupo lógico; mensagens em inglês (conventional commits).
