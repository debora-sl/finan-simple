# Implementation Plan: Gestão de Residências (Households)

**Branch**: `003-household-management` | **Date**: 2026-08-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-household-management/spec.md`

## Summary

Reorganizar o sistema financeiro para que todo dado (despesas e categorias) pertença a uma
**Residência (Household)** em vez de a um usuário. Cada residência tem exatamente um Administrador
e zero ou mais Membros, geridos por convites por e-mail. Um usuário pode pertencer a várias
residências e alterna entre elas por um seletor de "casa ativa". A abordagem técnica reaproveita
os padrões existentes do projeto: funções de leitura em `data/`, Server Actions com
`next-safe-action` em `actions/`, e integra a vinculação automática de convites ao fluxo do Better
Auth via `databaseHooks`. Inclui migração dos dados existentes (`userId` → `householdId`) e uma
landing estática para visitantes não autenticados.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2 (App Router)

**Primary Dependencies**: Prisma 7 (`@prisma/adapter-better-sqlite3`), Better Auth 1.6,
next-safe-action 8, shadcn/ui + Tailwind 4, zod 4, react-hook-form 7, lucide-react

**Storage**: SQLite via Prisma 7 (`prisma/schema.prisma`)

**Testing**: Sem framework de testes automatizados no projeto; validação via `quickstart.md`
(cenários manuais) e `pnpm lint` / `pnpm build`

**Target Platform**: Aplicação web (Next.js server + browser)

**Project Type**: Web application (App Router monolítico — sem separação frontend/backend)

**Performance Goals**: Troca de casa ativa reflete dados em ≤ 2s (SC-003); operações CRUD com
latência típica de app web interativo

**Constraints**: Isolamento total de dados entre residências (SC-006, 0 acessos indevidos);
exatamente um Administrador por residência em qualquer instante (SC-004); landing sem consultas ao
banco (SC-007)

**Scale/Scope**: Uso familiar — dezenas de residências e membros por usuário; 5 histórias de
usuário, ~23 requisitos funcionais; ~5 novas telas/seções e migração de 2 entidades existentes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Conformidade planejada |
|-----------|------------------------|
| I. shadcn/ui e Design Tokens | Seletor de casa (Select/DropdownMenu), formulários (Dialog/Sheet, Form, Input), listas de membros/convites (Table, Badge), landing (Card) — todos de `components/ui`. Cores só via tokens de `app/globals.css`; medidas em `rem`; ícones `lucide-react`; imagens da landing via `next/image`. Botão de fechar do Sheet não é criado manualmente. |
| II. Camada de Dados Isolada | Todas as leituras (residências do usuário, membros, convites, dashboard/despesas/categorias por `householdId`) em funções de `data/`. Componentes nunca chamam Prisma direto. |
| III. Server Actions Seguras | Todas as mutações em `actions/` com `next-safe-action`, `protectedActionClient`, `.inputSchema`, e checagem de autorização por papel (Administrador vs Membro) e pertencimento à residência. Cliente consome via `useAction`. |
| IV. Clean Code / TS | kebab-case em arquivos/pastas; nomes descritivos; sem comentários; sem duplicação (helper único de resolução de casa ativa e de autorização); ESLint deve passar. |
| V. Docs/Código via MCP | Context7 consultado para `databaseHooks` do Better Auth (integração de convites no signup). Guias em `node_modules/next/dist/docs/` a consultar antes de rotas/middleware novos. |

**Resultado**: PASS. Nenhuma violação; `Complexity Tracking` não é necessário.

Observação de padrão existente: as Server Actions atuais chamam `prisma` diretamente para
escrita (leitura fica em `data/`). O plano mantém essa convenção estabelecida — o Princípio II
regula o acesso a dados a partir de **componentes**, não das actions.

## Project Structure

### Documentation (this feature)

```text
specs/003-household-management/
├── plan.md              # Este arquivo
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md        # Fase 1
├── contracts/           # Fase 1 (contratos de actions + funções de dados)
│   ├── data-functions.md
│   └── server-actions.md
├── checklists/
│   └── requirements.md  # já existente
└── tasks.md             # Fase 2 (/speckit-tasks — NÃO criado por /speckit-plan)
```

### Source Code (repository root)

```text
prisma/
└── schema.prisma                 # + Household, Membership, Invitation; Expense/Category → householdId; User.activeHouseholdId

lib/
├── auth.ts                       # + databaseHooks (create.after: vincula convites; delete.before: sucessão)
├── action-client.ts             # (inalterado) protectedActionClient
├── active-household.ts          # NOVO: resolve casa ativa do usuário; redireciona para criação se nenhuma
└── validation/
    ├── household.ts             # NOVO: schemas de residência
    └── invitation.ts            # NOVO: schemas de convite/membro

data/
├── households.ts                # NOVO: getHouseholdsForUser, getHouseholdById, getMembership
├── memberships.ts               # NOVO: getMembers (com usuário), getPendingInvitations
├── expenses.ts                  # ALTERADO: assinatura userId → householdId
├── categories.ts                # ALTERADO: assinatura userId → householdId
└── dashboard.ts                 # ALTERADO: assinatura userId → householdId

actions/
├── create-household.ts          # NOVO
├── update-household.ts          # NOVO (só Administrador)
├── switch-active-household.ts   # NOVO
├── invite-member.ts             # NOVO (só Administrador)
├── cancel-invitation.ts         # NOVO (só Administrador)
├── accept-invitation.ts         # NOVO
├── remove-member.ts             # NOVO (só Administrador)
├── leave-household.ts           # NOVO (sucessão/remoção)
└── create-expense.ts, ...       # ALTERADO: usar householdId da casa ativa + autorização por residência

app/
├── page.tsx                     # ALTERADO: landing estática se não autenticado; senão redireciona
├── (marketing)/                 # NOVO (opcional): componentes estáticos da landing (US5)
└── (app)/
    ├── layout.tsx               # ALTERADO: resolve casa ativa; passa residências ao sidebar
    ├── households/
    │   ├── new/page.tsx         # NOVO: criar primeira/nova residência (US1)
    │   └── page.tsx             # NOVO: gerir residência ativa — nome, membros, convites (US2/US4)
    ├── dashboard/page.tsx       # ALTERADO: usa householdId
    ├── expenses/page.tsx        # ALTERADO: usa householdId
    └── categories/page.tsx      # ALTERADO: usa householdId

components/
├── layout/
│   ├── app-sidebar.tsx          # ALTERADO: inclui seletor de casa ativa
│   └── household-switcher.tsx   # NOVO: seletor de casa ativa (client)
├── households/                  # NOVO: household-form, members-table, invitations-list, invite-form
└── marketing/                   # NOVO: seções estáticas da landing (US5)
```

**Structure Decision**: Aplicação web monolítica com App Router (estrutura existente). A feature
estende as pastas já convencionadas — `data/`, `actions/`, `lib/`, `app/(app)/`, `components/` —
sem introduzir novos projetos ou camadas, respeitando os Princípios II e III.

## Complexity Tracking

> Nenhuma violação da constituição. Seção não aplicável.
