# Implementation Plan: Datas de Vencimento e Pagamento em Despesas

**Branch**: `005-expense-dates` | **Date**: 2026-08-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-expense-dates/spec.md`

## Summary

Evoluir a entidade Despesa para distinguir dois momentos no tempo — **Data de Vencimento** (opcional, via "Sem data de vencimento") e **Data do Pagamento** (opcional, cuja presença determina o estado "pago") — e corrigir o bug de deslocamento de um dia (timezone/UTC) que faz a data aparecer um dia antes na listagem.

Abordagem técnica: tratar datas de despesa como **datas de calendário puras** (granularidade de dia, sem horário nem fuso). No banco, usar o tipo `date` do Postgres via Prisma `@db.Date`; no código, centralizar conversão/formatação em um utilitário (`lib/date.ts`) que sempre interpreta e exibe as datas em UTC, eliminando o deslocamento na origem e evitando reintroduzi-lo nos novos campos. Substituir o marcador `isPaid` pela presença de `paidDate`. Migração de dados converte a coluna `date` legada em `dueDate` preservando o dia pretendido.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16 (App Router, Server Actions)

**Primary Dependencies**: Prisma 7 (`^7.9.1`), next-safe-action, zod, react-hook-form + `@hookform/resolvers`, shadcn/ui, lucide-react, Better Auth, sonner

**Storage**: PostgreSQL (Neon) via Prisma; migrações versionadas em `prisma/migrations/`

**Testing**: Validação manual via `quickstart.md` (o projeto não possui suíte automatizada); `pnpm lint` como portão obrigatório

**Target Platform**: Aplicação web (Next.js) renderizada em navegador; servidor Node

**Project Type**: Web application (Next.js App Router, single project)

**Performance Goals**: N/A (volume doméstico; sem metas específicas de throughput)

**Constraints**: Datas DEVEM ser exibidas exatamente como informadas em qualquer fuso (FR-007); `rem`, tokens de tema, ícones `lucide-react`, Prisma restrito a `data/`, mutações via Server Actions protegidas

**Scale/Scope**: Poucas dezenas de despesas por residência; escopo desta feature ≈ 1 model Prisma + 1 migração + 4 actions + 2 componentes + 2 funções de dados + 1 util

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Conformidade do plano |
|-----------|-----------------------|
| I. Interface com shadcn/ui e Design Tokens | Reusa `Input[type=date]`, `Checkbox` ("Sem data de vencimento"), `Switch` (status pago) e `Table` do shadcn/ui; sem cores hard-coded; medidas em `rem`; ícones `lucide-react`. Nenhum componente do zero. |
| II. Camada de Dados Isolada | Todo acesso a dados permanece em `data/expenses.ts` e `data/dashboard.ts`; componentes não chamam Prisma. |
| III. Server Actions Seguras | Alterações em `actions/create-expense.ts`, `actions/update-expense.ts`, `actions/toggle-expense-paid.ts` mantêm `protectedActionClient`, `.inputSchema`, `useAction` e checagem de residência (FR-010). |
| IV. Clean Code e TypeScript | Utilitário `lib/date.ts` (DRY) evita duplicar conversões; nomes descritivos (`dueDate`, `paidDate`, `hasNoDueDate`); kebab-case; sem comentários; ESLint deve passar. |
| V. Documentação e Código via MCP | Consultar Context7 para Prisma 7 (`@db.Date`, migrate) e Next.js 16; ler guias em `node_modules/next/dist/docs/` antes de tocar em código Next; usar Serena para edição semântica. |

**Resultado**: PASS — nenhuma violação; a seção Complexity Tracking permanece vazia.

## Project Structure

### Documentation (this feature)

```text
specs/005-expense-dates/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/           # Fase 1 (/speckit-plan)
│   ├── expense-schema.md
│   └── expense-actions.md
├── checklists/
│   └── requirements.md  # já existente
└── tasks.md             # Fase 2 (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
prisma/
├── schema.prisma                         # Expense: date→dueDate (nullable, @db.Date); +paidDate; −isPaid
└── migrations/
    └── <timestamp>_expense_dates/        # rename+cast date→dueDate; add paidDate; drop isPaid; ajustar índice

lib/
├── date.ts                               # NOVO util: parseCalendarDate / formatCalendarDate / toDateInputValue
└── validation/
    └── expense.ts                        # dueDate opcional + hasNoDueDate; paidDate ≤ hoje; regras de refine

data/
├── expenses.ts                           # orderBy date→dueDate; selects já incluem novos campos
└── dashboard.ts                          # paidAgg: isPaid:true → paidDate:{ not: null }

actions/
├── create-expense.ts                     # grava dueDate/paidDate a partir do input validado
├── update-expense.ts                     # idem para edição
└── toggle-expense-paid.ts                # define paidDate = clientToday (dia local do usuário) | null em vez de isPaid

components/expenses/
├── expense-form.tsx                      # campo Vencimento + "Sem data de vencimento" + campo Pagamento
└── expense-table.tsx                     # coluna Vencimento ("Sem vencimento"); status/pagamento via paidDate
```

**Structure Decision**: Web app single-project Next.js já estabelecido. Nenhuma pasta nova além da migração; o único arquivo novo é `lib/date.ts`, criado para concentrar a lógica de data e cumprir DRY. Não há script `update-agent-context` no projeto; a orientação de agente vive em `CLAUDE.md`/`AGENTS.md` e permanece válida.

## Complexity Tracking

> Nenhuma violação da Constituição a justificar. Seção intencionalmente vazia.
