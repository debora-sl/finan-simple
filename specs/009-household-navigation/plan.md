# Implementation Plan: Residências — menu, listagem e edição por residência

**Branch**: `009-household-navigation` | **Date**: 2026-08-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/009-household-navigation/spec.md`

## Summary

Reorganiza a navegação de residências. A rota `/households` deixa de ser a tela de edição da
residência ativa e passa a **listar todas as residências** do usuário (nome, papel e indicador de
ativa, com a ativa destacada no topo). A criação de residência migra para o **cabeçalho da
listagem**. Cada item oferece "Definir como ativa" (exceto a ativa) e "Editar". A edição vai para a
nova rota dinâmica `/households/[id]`, que reaproveita o conteúdo atual (nome, membros, convidar,
convites, sair, excluir), porém sempre operando sobre a **residência da rota** e com papel derivado
**daquela** residência. O switcher sai da sidebar e a residência ativa passa a aparecer no **header**.

Abordagem técnica: sem migration (modelo inalterado). Reaproveita as funções de dados e actions
existentes; o único ajuste de contrato é tornar `inviteMember` explícito por `householdId` (hoje usa
a residência ativa). Adiciona uma função de dados de leitura combinada (residência + papel do usuário
pela rota) e uma leitura **tolerante a nulo** do `activeHouseholdId` (sem redirect nem reatribuição),
necessária para o estado vazio da listagem e o rótulo neutro do header (FR-021), já que
`getActiveHousehold()` redireciona quando não há residências. Ajusta a composição de layout (header
recebe nome da residência ativa; sidebar sem switcher).

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16 (App Router, Server Components)

**Primary Dependencies**: Next.js 16, Prisma 7, better-auth, next-safe-action, shadcn/ui, Tailwind,
lucide-react, react-hook-form, zod, sonner

**Storage**: Prisma 7 sobre o schema existente (`Household`, `Membership`, `Invitation`,
`User.activeHouseholdId`) — **sem migration**

**Testing**: Validação manual via quickstart (o projeto não possui suíte automatizada); portão de
qualidade = ESLint sem erros

**Target Platform**: Aplicação web (área logada), desktop e mobile

**Project Type**: Web app single-project (Next.js App Router)

**Performance Goals**: Troca de residência ativa pela listagem em < 15s sem passar pelo menu lateral
(SC-009); atualização de tela sem reload manual (FR-017)

**Constraints**: shadcn/ui + tokens de tema apenas; medidas em `rem`; ícones `lucide-react`; Prisma
só em `data/`; actions protegidas com `next-safe-action` + `.inputSchema` + `protectedActionClient`;
sem comentários no código; kebab-case em arquivos

**Scale/Scope**: Usuário membro de poucas residências; ~2 rotas afetadas, 1 rota nova dinâmica,
1 action alterada, 1 função de dados nova, ajustes em header/sidebar/layout

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Conformidade do plano |
|-----------|-----------------------|
| I. shadcn/ui e Design Tokens | Listagem/edição/header usam Card, Button, Badge, Sheet, Dialog existentes e tokens de tema; ícones via `lucide-react`; medidas em `rem`. Sem componentes do zero — reusa os já existentes de `components/households` e `components/ui`. **PASS** |
| II. Camada de dados isolada | Toda leitura (lista por usuário, detalhe+papel pela rota, membros, convites) via `data/`; nenhum `prisma` em componente. Novas funções `getHouseholdForUserWithRole` e `getActiveHouseholdId` (leitura tolerante a nulo, sem redirect) em `data/households.ts`. **PASS** |
| III. Server Actions Seguras | Reusa `switchActiveHousehold`, `updateHousehold`, `deleteHousehold`, `leaveHousehold`, `removeMember` (já validam por `householdId` explícito) e ajusta `inviteMember` para receber `householdId` e validar ADMIN **naquela** residência. Todas com `protectedActionClient` + `.inputSchema`. **PASS** |
| IV. Clean Code / TS | kebab-case, nomes descritivos, sem comentários, DRY (extrai componente de item de lista e seção de edição). ESLint deve passar. **PASS** |
| V. Docs via MCP / Next docs | Doc de rota dinâmica lida (`params: Promise<{ id }>` + `await params`, Next 16). Context7/Serena para APIs quando necessário na implementação. **PASS** |

**Resultado**: Nenhuma violação. Complexity Tracking não é necessária.

## Project Structure

### Documentation (this feature)

```text
specs/009-household-navigation/
├── plan.md              # Este arquivo
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
│   ├── data-layer.md
│   └── server-actions.md
├── checklists/          # já existente
└── tasks.md             # /speckit-tasks (não criado aqui)
```

### Source Code (repository root)

```text
app/(app)/households/
├── page.tsx                         # ALTERA: passa a ser a LISTAGEM de residências
└── [id]/
    └── page.tsx                     # NOVO: edição por residência (rota [id])

app/(app)/layout.tsx                 # ALTERA: header recebe nome da residência ativa (leitura tolerante a nulo, sem redirect); sidebar sem switcher

components/layout/
├── app-header.tsx                   # ALTERA: exibe residência ativa persistente
├── app-sidebar.tsx                  # ALTERA: remove HouseholdSwitcher (desktop + mobile)
└── household-switcher.tsx           # REMOVE (deixa de ser usado)

components/households/
├── households-list.tsx              # NOVO: lista + item (ativa destacada/topo, ações)
├── set-active-household-button.tsx  # NOVO: ação "Definir como ativa"
├── household-form.tsx               # (existe) reuso na criação
├── household-name-form.tsx          # reuso na edição [id]
├── members-table.tsx               # reuso na edição [id]
├── invite-form.tsx                  # ALTERA: recebe householdId da rota
├── invitations-list.tsx            # reuso na edição [id]
├── leave-household-button.tsx      # reuso na edição [id]
└── delete-household-button.tsx     # reuso na edição [id] (redireciona p/ /households)

data/households.ts                   # ALTERA: + getHouseholdForUserWithRole(userId, householdId) + getActiveHouseholdId(userId)
actions/invite-member.ts             # ALTERA: householdId explícito da rota + valida ADMIN nela
lib/validation/invitation.ts        # ALTERA: inviteMemberSchema ganha householdId
```

**Structure Decision**: Single-project Next.js App Router (grupo de rotas `(app)`). A listagem
permanece em `/households`; a edição vira segmento dinâmico `/households/[id]`. Reaproveita
componentes e actions existentes; mudanças concentradas em composição de UI e no escopo por
`householdId` da rota.

## Complexity Tracking

> Não aplicável — nenhuma violação da constituição.
