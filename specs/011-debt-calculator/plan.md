# Implementation Plan: Calculador de Dívidas + card "Total Pagantes" no Dashboard

**Branch**: `011-debt-calculator` | **Date**: 2026-08-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-debt-calculator/spec.md`

## Summary

Entregar, numa spec única, duas partes acopladas que compartilham o mesmo armazenamento (número de
pagantes por residência + mês):

1. **Calculador de Dívidas**: nova página (`/debt-calculator`) com item de menu próprio, onde o
   usuário escolhe um mês entre os que têm despesas, vê o total daquele mês (mesma regra de recorte
   por `dueDate` da spec 010) e informa quantos pagantes dividem a conta, obtendo imediatamente o
   valor por pagante (total ÷ pagantes, arredondado ao centavo). O número informado é persistido.
2. **Card "Total Pagantes" no Dashboard**: exibe o número inteiro de pagantes salvo para o mês
   selecionado no Dashboard, com estado vazio ("—") quando não houver.

Abordagem técnica: novo model Prisma `MonthlyPayers` (único por `householdId + year + month`, cascade
na remoção da residência), funções na camada `data/`, uma Server Action protegida com
`next-safe-action`, reuso da lógica de meses/período (`lib/report-period.ts`,
`getAvailableMonths`) e da agregação de total do Dashboard (`getDashboardSummary`).

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16 (App Router)

**Primary Dependencies**: Next.js 16, Prisma 7, shadcn/ui (base-ui), next-safe-action 8,
react-hook-form + zod, lucide-react, Better Auth

**Storage**: PostgreSQL via Prisma 7 (novo model `MonthlyPayers`)

**Testing**: Validação manual via `quickstart.md` (projeto não possui suíte automatizada)

**Target Platform**: Web app (SSR/RSC) — navegadores modernos

**Project Type**: Web application (Next.js App Router monolito)

**Performance Goals**: Cálculo e persistência interativos (< 300 ms percebidos); leitura do card do
Dashboard sem regressão perceptível nas queries existentes

**Constraints**: Cores só via tokens de `app/globals.css`; medidas em `rem`; ícones `lucide-react`;
Prisma só em `data/`; Server Actions só via `next-safe-action` com `protectedActionClient` e
`.inputSchema`; sem comentários no código; ESLint sem erros; kebab-case em arquivos/pastas

**Scale/Scope**: 1 model novo, 1 migration, 1 função de dados nova (+reuso), 1 Server Action,
1 schema de validação, 1 página nova, ~2 componentes novos, extensão de 2 componentes existentes
(`SummaryCards`, `MonthSelector`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Conformidade no design |
|-----------|------------------------|
| **I. shadcn/ui + Design Tokens** | Página usa `Card`, `Input`, `Field`, `Button`, `Select` já existentes; card do Dashboard reusa o `SummaryTile`/`Card`. Cores via tokens; medidas em `rem`; ícone `lucide-react` (`Users`/`Calculator`). Sem componentes do zero. ✅ |
| **II. Camada de Dados Isolada** | Todo acesso ao novo model em `data/payers.ts`; total do mês via `getDashboardSummary` (já em `data/`). Nenhum `prisma` em componente. ✅ |
| **III. Server Actions Seguras** | `actions/set-monthly-payers.ts` com `protectedActionClient`, `.inputSchema`, checagem de residência ativa (autorização por membership). Cliente usa `useAction`. Base: `create-expense.ts`/`update-savings.ts`. ✅ |
| **IV. Clean Code / TS** | kebab-case, nomes descritivos (`payersCount`, `valuePerPayerInCents`), DRY (reuso de período e agregação), sem comentários, ESLint limpo. ✅ |
| **V. Docs/Código via MCP** | Context7 para APIs de Prisma 7/Next 16/next-safe-action quando necessário; ler guia relevante em `node_modules/next/dist/docs/` antes de código de Next. Serena para retrieval/edição. ✅ |

**Resultado**: PASS. Nenhuma violação; Complexity Tracking vazio.

## Project Structure

### Documentation (this feature)

```text
specs/011-debt-calculator/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── set-monthly-payers.md
├── checklists/
│   └── requirements.md  # (já existente)
└── spec.md
```

### Source Code (repository root)

```text
prisma/
├── schema.prisma                         # + model MonthlyPayers, relação em Household
└── migrations/
    └── <timestamp>_add_monthly_payers/   # nova migration

lib/
├── report-period.ts                      # reuso (período/mês)
├── money.ts                              # reuso (centsToAmount/format)
└── validation/
    └── payers.ts                         # novo schema zod (setMonthlyPayersSchema)

data/
├── payers.ts                             # novo: getMonthlyPayers / setMonthlyPayers
├── dashboard.ts                          # reuso (total do mês)
└── expenses.ts                           # reuso (getAvailableMonths)

actions/
└── set-monthly-payers.ts                 # nova Server Action protegida

app/(app)/
├── debt-calculator/
│   └── page.tsx                          # nova página (RSC) — carrega meses/total/pagantes salvos
└── dashboard/
    └── page.tsx                          # + busca pagantes do mês e passa ao SummaryCards

components/
├── debt-calculator/
│   └── debt-calculator-form.tsx          # client: input pagantes + valor por pagante reativo
├── dashboard/
│   └── summary-cards.tsx                 # + card "Total Pagantes" (contagem/estado vazio)
├── shared/
│   └── month-selector.tsx               # + prop opcional para ocultar "Todos os meses"
└── layout/
    └── app-sidebar.tsx                   # + item de menu "Calculador de Dívidas"
```

**Structure Decision**: Web application (Next.js App Router). A feature segue estritamente o padrão
em camadas já vigente: RSC nas páginas para carregar dados via `data/`, componentes client apenas
para interatividade (input de pagantes + cálculo reativo), Server Action para persistência. Reuso
máximo de `lib/report-period.ts`, `getAvailableMonths` e `getDashboardSummary` evita duplicar a
regra de recorte por mês.

## Complexity Tracking

> Nenhuma violação da constituição. Seção intencionalmente vazia.
