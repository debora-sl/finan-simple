# Implementation Plan: Dashboard — relatórios por mês

**Branch**: `010-dashboard-monthly-reports` | **Date**: 2026-08-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/010-dashboard-monthly-reports/spec.md`

## Summary

Adicionar um **seletor de mês** compartilhado ao Dashboard e à página de Despesas. O recorte por
mês usa `dueDate` como referência e é propagado às agregações (total, pago, pendente, distribuição
por categoria) e à listagem de despesas. O estado do recorte vive na **URL** (`?month=YYYY-MM` ou
`?month=all`), permitindo que os Server Components leiam `searchParams`, refaçam a busca via camada
`data/` e re-renderizem sem recarregar a página manualmente. O padrão inicial é o **mês atual**;
"Todos os meses" reproduz o comportamento agregado anterior (incluindo despesas sem `dueDate`). O
card do cofrinho e o modelo de dados permanecem inalterados.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16 (App Router, Server Components)

**Primary Dependencies**: Next.js 16, Prisma 7, shadcn/ui (`Select`), Better Auth, next-safe-action,
lucide-react, recharts (já usado no `CategoryBreakdown`)

**Storage**: PostgreSQL via Prisma 7. Modelo `Expense` com `dueDate DateTime? @db.Date` e índice
`@@index([householdId, dueDate])` já existente — suporta o filtro por intervalo de mês. **Sem migration.**

**Testing**: Validação manual via quickstart (o projeto não possui suíte de testes automatizados);
ESLint DEVE passar sem erros.

**Target Platform**: Aplicação web (Next.js) renderizada no servidor; navegador moderno.

**Project Type**: Web application (Next.js App Router monolítico — `app/`, `components/`, `data/`, `lib/`).

**Performance Goals**: Troca de mês atualiza os números sem reload manual da página (SC-007); o filtro
por mês usa o índice `[householdId, dueDate]`, evitando full scans.

**Constraints**: Sem chamadas diretas ao Prisma em componentes (Princípio II); apenas componentes
shadcn/ui e tokens de tema; medidas em `rem`; ícones `lucide-react`; nenhum comentário no código.

**Scale/Scope**: Duas telas afetadas (Dashboard, Despesas), 1 componente novo compartilhado, 1 helper
puro em `lib/`, extensões em 2 arquivos de `data/`. Nenhuma nova entidade persistida.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Conformidade no plano |
|-----------|-----------------------|
| I. shadcn/ui e Design Tokens | Seletor usa `Select` do shadcn/ui já presente (`components/ui/select.tsx`); ícone via `lucide-react`; medidas em `rem`; cores por tokens. **PASS** |
| II. Camada de Dados Isolada | `getAvailableMonths` e o filtro por mês vivem em `data/expenses.ts` e `data/dashboard.ts`; componentes/páginas nunca chamam Prisma. **PASS** |
| III. Server Actions Seguras | Feature é **read-only**; nenhuma mutação → nenhuma Server Action nova. Não aplicável. **PASS (N/A)** |
| IV. Clean Code / TS / DRY | Lógica de recorte centralizada em `lib/report-period.ts` e reutilizada nas duas telas; nomes descritivos; kebab-case; sem comentários. **PASS** |
| V. Docs via MCP / Next docs | `searchParams` (Promise) confirmado no guia `node_modules/next/dist/docs`; Context7 usado para APIs de `Select`/navegação quando necessário. **PASS** |
| Escopo por residência | Toda leitura recebe `householdId` de `getActiveHousehold()`; nenhum dado cruza residências (FR-016). **PASS** |

Nenhuma violação. Complexity Tracking não necessário.

## Project Structure

### Documentation (this feature)

```text
specs/010-dashboard-monthly-reports/
├── plan.md              # Este arquivo
├── research.md          # Phase 0 — decisões técnicas
├── data-model.md        # Phase 1 — entidades derivadas e tipos
├── quickstart.md        # Phase 1 — roteiro de validação manual
├── contracts/
│   ├── data-layer.md    # Contratos das funções de data/
│   └── month-selector.md # Contrato de UI do seletor compartilhado
└── checklists/          # (pré-existente)
```

### Source Code (repository root)

```text
lib/
├── report-period.ts          # NOVO — parse/resolve do recorte (all | month) + label pt-BR
└── active-household.ts        # (existente) fornece householdId

data/
├── dashboard.ts               # MODIFICADO — getDashboardSummary(householdId, period?)
└── expenses.ts                # MODIFICADO — getExpenses(householdId, period?) + getAvailableMonths(householdId)

components/
├── shared/
│   └── month-selector.tsx     # NOVO — client Select que escreve ?month= na URL
├── dashboard/
│   ├── summary-cards.tsx      # (inalterado)
│   └── category-breakdown.tsx # (inalterado — já recebe dados recortados)
└── expenses/
    └── expense-table.tsx      # (inalterado — recebe lista já filtrada)

app/(app)/
├── dashboard/page.tsx         # MODIFICADO — lê searchParams, resolve period, renderiza seletor
└── expenses/page.tsx          # MODIFICADO — lê searchParams, resolve period, renderiza seletor
```

**Structure Decision**: Web application Next.js já estabelecida. O estado do recorte é mantido na
**URL** (`?month=`), não em estado de cliente, para que os Server Components possam buscar os dados
recortados pela camada `data/` e re-renderizar sem reload (SC-007). A lógica de recorte é um helper
puro em `lib/` reutilizado pelas duas páginas e pela camada de dados (DRY, FR-013).

## Complexity Tracking

> Sem violações constitucionais — seção não aplicável.
