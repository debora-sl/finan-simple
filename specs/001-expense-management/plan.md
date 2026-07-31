# Implementation Plan: Gestão de Despesas com Autenticação

**Branch**: `001-expense-management` | **Date**: 2026-07-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-expense-management/spec.md`

## Summary

Sistema de gestão de despesas pessoais com autenticação por e-mail e senha. Cada usuário autenticado registra despesas (descrição, valor, data, status de pagamento e categoria opcional), organiza-as em categorias próprias, marca despesas como pagas/pendentes e visualiza uma dashboard consolidada (totais, pago vs. pendente, distribuição por categoria). O isolamento estrito de dados por usuário é o requisito transversal central.

Abordagem técnica: Next.js 16 (App Router) com React 19; Better Auth (e-mail/senha, sessões em banco via adaptador Prisma) para autenticação; Prisma 7 sobre SQLite para persistência; next-safe-action para todas as mutações; shadcn/ui + Tailwind CSS v4 com tokens de tema para a interface. Acesso a dados isolado em `data/`, mutações em `actions/`, verificação de sessão centralizada em uma camada de acesso a dados (`lib/dal.ts`).

## Technical Context

**Language/Version**: TypeScript 5 (strict), React 19.2, Node.js 20+

**Primary Dependencies**: Next.js 16.2 (App Router), Better Auth, Prisma 7 (`@prisma/client`), next-safe-action, Zod, shadcn/ui (Radix + Tailwind CSS v4), lucide-react

**Storage**: SQLite via Prisma 7 (arquivo local `prisma/dev.db`; schema em `prisma/schema.prisma`)

**Testing**: Validação manual via `quickstart.md` (cenários de aceite do spec); nenhum framework de teste automatizado está na stack ratificada nesta versão

**Target Platform**: Aplicação web renderizada no servidor (Next.js), executada em Node.js; navegadores modernos no cliente

**Project Type**: Web application (App Router single-app; sem separação backend/frontend)

**Performance Goals**: Interações de CRUD e carregamento de dashboard percebidos como imediatos para o volume de um usuário individual (dezenas a centenas de despesas); sem metas de throughput multiusuário nesta versão

**Constraints**: Isolamento total de dados por usuário (nenhum vazamento entre contas — SC-003/SC-004); toda medida em `rem`; cores apenas via tokens de `app/globals.css`; nenhum acesso ao Prisma fora de `data/`; toda mutação via Server Action protegida; sem `npm run dev` para validação

**Scale/Scope**: MVP de finança pessoal — 5 histórias de usuário, 3 entidades de domínio (Usuário, Categoria, Despesa) + entidades de autenticação do Better Auth (Session, Account, Verification); ~6 telas (cadastro, login, despesas, categorias, dashboard, layout autenticado)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Avaliação contra a Constituição do finan-simple v1.0.0:

| Princípio | Conformidade do plano |
|-----------|-----------------------|
| **I. Interface com shadcn/ui e Design Tokens** | ✅ shadcn/ui é a única biblioteca de componentes; formulários, tabelas, cards, sheet, dialog e select vêm do shadcn. Cores apenas via tokens de `app/globals.css`, medidas em `rem`, ícones via `lucide-react`, imagens via `next/image`. O botão de fechar do `Sheet` não é criado manualmente. Footer verificado em `layout.tsx` antes de inserir. |
| **II. Camada de Dados Isolada** | ✅ Todo acesso ao Prisma reside em `data/` (ex.: `data/expenses.ts`, `data/categories.ts`, `data/dashboard.ts`). Componentes consomem apenas essas funções; nunca importam `@prisma/client` diretamente. |
| **III. Server Actions Seguras** | ✅ Todas as mutações usam next-safe-action em `actions/`, com `protectedActionClient` (de `lib/action-client.ts`) e `.inputSchema` (nunca `.schema`). Cada action valida autenticação/autorização (posse do recurso pelo usuário). Cliente chama via hook `useAction`. |
| **IV. Clean Code e Convenções de TypeScript** | ✅ TypeScript em tudo; kebab-case para pastas/arquivos; nomes descritivos (`isLoading`, `hasError`); DRY via componentes/funções reutilizáveis; sem comentários no código; ESLint deve passar sem erros antes de concluir. |
| **V. Documentação e Código via MCP** | ⚠️ Context7 indisponível nesta sessão (chave de API inválida — não inicia com `ctx7sk`); mitigado lendo os guias em `node_modules/next/dist/docs/` (autenticação, proxy, server actions). Documentação de Better Auth/Prisma/next-safe-action deve ser confirmada via Context7 na implementação assim que a chave for corrigida. Serena deve ser usado para recuperação/edição semântica de código na fase de implementação. |
| **Stack Tecnológico** | ✅ pnpm, Next.js 16 + React 19, Prisma 7, shadcn/ui + Tailwind, Better Auth, next-safe-action, lucide-react. SQLite é o banco escolhido (compatível com Prisma 7). Nenhuma dependência substitui responsabilidades da stack. |
| **Fluxo e Portões de Qualidade** | ✅ Sem `npm run dev` para validar; ESLint sem erros como portão; funções em `data/` e actions em `actions/` para toda operação de dados/servidor. |

**Resultado do gate**: PASS. Nenhuma violação exige entrada em Complexity Tracking. A indisponibilidade do Context7 é uma limitação de ambiente registrada (não uma violação de princípio); o guia de Next.js foi lido conforme AGENTS.md.

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-management/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Saída da Fase 0 (/speckit-plan)
├── data-model.md        # Saída da Fase 1 (/speckit-plan)
├── quickstart.md        # Saída da Fase 1 (/speckit-plan)
├── contracts/           # Saída da Fase 1 (/speckit-plan)
│   ├── auth.md          # Contrato de autenticação (Better Auth)
│   ├── expenses.md      # Contrato das Server Actions de despesas
│   ├── categories.md    # Contrato das Server Actions de categorias
│   └── dashboard.md     # Contrato de leitura da dashboard
├── checklists/
│   └── requirements.md  # Checklist de qualidade dos requisitos (já existe)
└── tasks.md             # Saída da Fase 2 (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
app/
├── globals.css                     # Tokens de tema (única fonte de cores)
├── layout.tsx                      # Root layout (verificar footer antes de inserir)
├── page.tsx                        # Redireciona para /dashboard ou /login
├── (auth)/
│   ├── layout.tsx                  # Layout público (cadastro/login)
│   ├── login/page.tsx              # Tela de login
│   └── signup/page.tsx             # Tela de cadastro
├── (app)/
│   ├── layout.tsx                  # Layout autenticado (nav + verificação de sessão)
│   ├── dashboard/page.tsx          # Dashboard (totais, pago/pendente, por categoria)
│   ├── expenses/page.tsx           # Lista e gestão de despesas
│   └── categories/page.tsx         # Lista e gestão de categorias
└── api/
    └── auth/[...all]/route.ts      # Handler do Better Auth

components/
├── ui/                             # Componentes do shadcn/ui (gerados)
├── auth/                           # Formulários de login/cadastro (client)
├── expenses/                       # Formulário, tabela, toggle de pagamento
├── categories/                     # Formulário e lista de categorias
└── dashboard/                      # Cards de resumo e visão por categoria

data/                               # ÚNICO ponto de acesso ao Prisma
├── expenses.ts                     # getExpenses, getExpenseById, ...
├── categories.ts                   # getCategories, getCategoryById, ...
└── dashboard.ts                    # getDashboardSummary

actions/                            # Server Actions (next-safe-action)
├── create-expense.ts
├── update-expense.ts
├── delete-expense.ts
├── toggle-expense-paid.ts
├── create-category.ts
├── update-category.ts
└── delete-category.ts

lib/
├── prisma.ts                       # Singleton do PrismaClient
├── auth.ts                         # Configuração do Better Auth (server)
├── auth-client.ts                  # createAuthClient (client)
├── action-client.ts               # actionClient + protectedActionClient
├── dal.ts                          # verifySession / getCurrentUser (cache)
└── validation/                     # Schemas Zod compartilhados

prisma/
├── schema.prisma                   # Modelos (SQLite)
└── dev.db                          # Banco local (gitignored)

proxy.ts                            # Redirecionamento otimista (Next.js 16; ex-middleware)
```

**Structure Decision**: Aplicação única com App Router (não há separação backend/frontend). Route groups `(auth)` e `(app)` separam área pública da autenticada, cada uma com seu `layout.tsx`. A arquitetura reflete diretamente a Constituição: `data/` isola o Prisma (Princípio II), `actions/` concentra mutações seguras (Princípio III), `components/ui/` recebe os componentes do shadcn (Princípio I), e `lib/dal.ts` centraliza a verificação de sessão. O arquivo de redirecionamento no root chama-se `proxy.ts` (renomeação do middleware no Next.js 16) e faz apenas checagens otimistas por cookie — a autorização real acontece na DAL e nas actions.

## Design System / UI

**Fonte de verdade visual**: `design/` (Design System Controle Financeiro). É referência, não código de produção — nada em `app/` ou `components/` importa de `design/`. Detalhe completo da política em [`design/USO-NO-PROJETO.md`](../../design/USO-NO-PROJETO.md).

- **Tokens**: já portados para `app/globals.css` (Tailwind v4 `@theme`, contrato de variáveis do shadcn/ui mapeado para a camada semântica do DS, dark mode via `data-theme="dark"`). Toda tela/componente consome exclusivamente esses tokens; nenhuma cor hard-coded.
- **Telas de referência (layout)**: `design/ui_kits/dashboard/DashboardScreen.jsx` (dashboard desktop), `design/ui_kits/dashboard/Sidebar.jsx` e `Topbar.jsx` (navegação do layout autenticado), `design/ui_kits/dashboard/AddTransactionModal.jsx` (formulário de despesa).
- **Specs de componentes (não copiar `.jsx`; reconstruir com shadcn/ui a partir do `.prompt.md`)**: `design/components/finance/` (`SummaryCard`, `TransactionRow`, `BillItem`, `CategoryBar`, `CategoryDonut`, `CategoryIcon`) e `design/components/core/` (`Button`, `Input`, `Select`, `Switch`, `Badge`, `Card`, `IconButton`, `ProgressBar`, `SegmentedControl`).
- **Escopo da feature 001**: usar apenas o que serve a dashboard, despesas, categorias e autenticação. Ignorar `design/ui_kits/mobile/` e `design/ui_kits/marketing/` (referência para o futuro).

### Mapeamento DS → shadcn/ui

| Componente do DS | Implementação |
|---|---|
| Button, Input, Select, Switch, Badge, Card | shadcn: `button`, `input`, `select`, `switch`, `badge`, `card` |
| SegmentedControl | shadcn `tabs` ou `toggle-group` |
| ProgressBar | shadcn `progress` |
| SummaryCard, TransactionRow, BillItem, CategoryBar | componentes próprios em `components/`, compostos de primitivos shadcn |
| CategoryDonut | shadcn `chart` (recharts) |
| CategoryIcon | `lucide-react` + o mapa fixo das 9 categorias (`--cat-*`) |

## Complexity Tracking

> Nenhuma violação de constituição a justificar. Seção não aplicável.

A única exceção registrada é ambiental, não arquitetural: o MCP do Context7 está indisponível nesta sessão (chave de API inválida). Mitigação adotada: leitura dos guias oficiais em `node_modules/next/dist/docs/` para as partes específicas de versão do Next.js 16 (autenticação, `proxy`, server actions). A documentação de Better Auth, Prisma 7 e next-safe-action deve ser confirmada via Context7 durante a implementação assim que a chave válida (`ctx7sk...`) estiver configurada.
