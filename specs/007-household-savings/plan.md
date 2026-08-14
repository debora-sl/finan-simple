# Implementation Plan: Cofrinho (valor guardado pela família)

**Branch**: `007-household-savings` | **Date**: 2026-08-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-household-savings/spec.md`

## Summary

Permitir que cada residência (Household) registre e acompanhe um único valor guardado ("cofrinho"), compartilhado por todos os membros. A abordagem técnica reutiliza os padrões já estabelecidos no projeto: armazenar o total como um campo inteiro em centavos (`savingsInCents`) diretamente no modelo `Household`, expor a leitura por uma função em `data/`, a escrita por uma Server Action protegida (`next-safe-action` + `protectedActionClient`) validada com `.inputSchema`, uma nova tela em `app/(app)/cofrinho/` com um formulário shadcn/ui, um item de navegação no `AppSidebar` e um card de resumo no Dashboard reutilizando o padrão visual de `SummaryCards`.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16 (App Router)

**Primary Dependencies**: Next.js 16, Prisma 7, next-safe-action, react-hook-form + @hookform/resolvers/zod, zod, shadcn/ui, lucide-react, Better Auth, sonner

**Storage**: PostgreSQL via Prisma 7 — novo campo `savingsInCents Int @default(0)` no modelo `Household`

**Testing**: Validação manual via quickstart (o projeto não possui suíte automatizada; `npm run dev` é PROIBIDO por constituição — validação por lint/build e checagem manual)

**Target Platform**: Aplicação web (desktop e mobile), renderização server-first com Server Components + Server Actions

**Project Type**: Web application (Next.js App Router monólito)

**Performance Goals**: Total atualizado e exibido em < 5s após salvar (SC-001); leitura do valor é um `findUnique` simples por householdId

**Constraints**: Cores apenas via tokens de tema (`app/globals.css`); medidas em `rem`; ícones `lucide-react`; Prisma nunca em componentes (apenas `data/`); Server Actions apenas em `actions/` com `protectedActionClient` e `.inputSchema`; sem comentários no código; ESLint deve passar; ler o guia relevante em `node_modules/next/dist/docs/` antes de escrever código Next.js

**Scale/Scope**: Feature pequena — 1 migração de schema, 1 função de leitura, 1 função de dados de escrita, 1 schema de validação, 1 Server Action, 1 página, 1 componente de formulário, 1 card no Dashboard, 1 item de navegação

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Interface com shadcn/ui e Design Tokens**: PASS — a tela e o card reutilizam `Card`, `Input`, `Field`, `Button`, `Sheet` do shadcn/ui e o padrão de `SummaryCards`; cores só via tokens; medidas em `rem`; ícone via `lucide-react` (`PiggyBank`). Nenhum componente criado do zero sem equivalente.
- **II. Camada de Dados Isolada**: PASS — leitura em `data/savings.ts` (`getHouseholdSavings`) e escrita encapsulada em função de dados; nenhum acesso a Prisma em componentes.
- **III. Server Actions Seguras**: PASS — `actions/update-savings.ts` usa `protectedActionClient`, `.inputSchema`, validação de pertencimento à residência ativa via `getActiveHousehold`, seguindo `create-expense.ts`/`update-household.ts` como base.
- **IV. Clean Code e Convenções de TypeScript**: PASS — TypeScript, kebab-case nos arquivos, nomes descritivos, sem comentários, DRY reutilizando `lib/money.ts` e o padrão de `SummaryTile`.
- **V. Documentação e Código via MCP**: PASS — usar Context7 para docs de Next.js 16/Prisma 7/zod quando necessário e ler `node_modules/next/dist/docs/` antes de escrever código Next.js; Serena para navegação/edição semântica.
- **Restrições de Stack**: PASS — nenhuma dependência nova introduzida.

Resultado: **PASS** — nenhuma violação; a seção Complexity Tracking permanece vazia.

## Project Structure

### Documentation (this feature)

```text
specs/007-household-savings/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── update-savings.md
├── checklists/          # Pre-existing (spec quality)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
prisma/
└── schema.prisma                        # + campo savingsInCents em Household (nova migração)

lib/
├── money.ts                             # reutilizado (amountToCents, formatCentsAsCurrency)
└── validation/
    └── savings.ts                       # NOVO — updateSavingsSchema (zod, .inputSchema)

data/
└── savings.ts                           # NOVO — getHouseholdSavings, setHouseholdSavings

actions/
└── update-savings.ts                    # NOVO — Server Action protegida (base: update-household.ts)

app/(app)/
├── cofrinho/
│   └── page.tsx                         # NOVO — Server Component: lê valor e renderiza a tela
└── dashboard/
    └── page.tsx                         # editado — passa savingsInCents ao Dashboard

components/
├── layout/
│   └── app-sidebar.tsx                  # editado — novo NAV_ITEM "Cofrinho" (PiggyBank)
├── savings/
│   └── savings-form.tsx                 # NOVO — client component (react-hook-form + useAction)
└── dashboard/
    └── summary-cards.tsx                # editado — novo card do cofrinho reutilizando SummaryTile (nova prop savingsInCents; grid ajustado para 4 cards)
```

**Structure Decision**: Aplicação web Next.js App Router (monólito). A feature segue a separação já usada no projeto: dados em `data/`, validação em `lib/validation/`, escrita em `actions/`, rotas em `app/(app)/`, UI em `components/<domínio>/`. O valor guardado é modelado como um campo em `Household` (um valor por residência), não como entidade separada, alinhado à assunção de "valor único" do spec.

## Complexity Tracking

> Nenhuma violação da constituição. Seção não aplicável.
