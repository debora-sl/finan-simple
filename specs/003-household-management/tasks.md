---
description: "Task list for Gestão de Residências (Households)"
---

# Tasks: Gestão de Residências (Households)

**Input**: Design documents from `/specs/003-household-management/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: O projeto não possui suíte de testes automatizados (ver plan.md). A validação é manual via `quickstart.md`. Nenhuma tarefa de teste automatizado é gerada.

**Organization**: Tarefas agrupadas por user story para permitir implementação e validação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story à qual a tarefa pertence (US1–US5)
- Todos os caminhos são relativos à raiz do repositório

## Path Conventions

Aplicação web monolítica com App Router (estrutura existente): `app/`, `actions/`, `data/`, `lib/`, `components/`, `prisma/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparação e consulta de documentação antes de qualquer código

- [ ] T001 Consultar os guias de App Router (routing, `redirect`, layouts) em `node_modules/next/dist/docs/` e usar o Context7 para revisar `databaseHooks` do Better Auth (`user.create.after`, `user.delete.before`) antes de implementar o schema e os hooks

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura de dados e helpers compartilhados que TODAS as histórias dependem

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase estar completa

- [ ] T002 Atualizar `prisma/schema.prisma`: adicionar modelos `Household`, `Membership`, `Invitation`; adicionar `User.activeHouseholdId` (nullable, relation "ActiveHousehold", `onDelete: SetNull`) e relação `memberships`; migrar `Expense` e `Category` de `userId` para `householdId` (relação `onDelete: Cascade`), ajustar índices e trocar unique de `Category` para `@@unique([householdId, nameLower])`, conforme data-model.md
- [ ] T003 Criar migração Prisma com passo de dados via `pnpm prisma migrate dev`: criar tabelas, adicionar colunas nullable, criar uma residência padrão "Minha Casa" + `Membership` ADMIN (`joinedAt = user.createdAt`) por usuário existente, repointar suas despesas/categorias, definir `activeHouseholdId`, e então tornar `expense.householdId`/`category.householdId` obrigatórios e remover as colunas `userId`
- [ ] T004 [P] Criar `lib/validation/household.ts` com `createHouseholdSchema`, `updateHouseholdSchema` (`{ id, name }`) e `switchHouseholdSchema` (`{ householdId }`) — `name` string trim 1–60
- [ ] T005 [P] Criar `lib/validation/invitation.ts` com `inviteMemberSchema` (`{ email }` trim lowercase `.email()`), `invitationIdSchema` (`{ invitationId }`) e `removeMemberSchema` (`{ membershipId }`)
- [ ] T006 Criar `data/households.ts` com `getHouseholdsForUser(userId)`, `getHouseholdById(householdId)` e `getMembership(userId, householdId)`
- [ ] T007 Criar `lib/active-household.ts` com `getActiveHousehold()` cacheado (`react.cache`): reusa `verifySession` de `lib/dal.ts`, lê `User.activeHouseholdId`, valida membership, faz fallback para a membership mais antiga e `redirect("/households/new")` quando o usuário não tem residência
- [ ] T008 [P] Alterar `data/expenses.ts`: trocar assinaturas `userId` → `householdId` (`getExpenses(householdId)`, `getExpenseById(householdId, id)`) e os `where`
- [ ] T009 [P] Alterar `data/categories.ts`: trocar assinaturas e filtros `userId` → `householdId` (`getCategories(householdId)` e demais funções)
- [ ] T010 [P] Alterar `data/dashboard.ts`: trocar `getDashboardSummary(userId)` → `getDashboardSummary(householdId)` e todos os `where` internos

**Checkpoint**: Schema, migração, validações, helper de casa ativa e camada de dados prontos — as user stories podem começar

---

## Phase 3: User Story 1 - Primeira residência e isolamento de dados (Priority: P1) 🎯 MVP

**Goal**: Usuário sem residência é direcionado a criar uma, torna-se Administrador, e passa a lançar despesas/categorias vinculadas àquela residência, isoladas de outras.

**Independent Test**: Cadastrar novo usuário → confirmar redirecionamento para `/households/new` → criar "Casa Mãe" → confirmar papel Administrador → criar despesa e categoria vinculadas a "Casa Mãe" → confirmar que outro usuário/residência não as vê.

### Implementation for User Story 1

- [ ] T011 [US1] Criar `actions/create-household.ts` (base: `actions/create-expense.ts`, `protectedActionClient`, `.inputSchema(createHouseholdSchema)`): cria `Household`, `Membership` ADMIN (`joinedAt = now`), define `User.activeHouseholdId`, revalida `/dashboard`, `/expenses`, `/categories`, `/households`; retorna `{ id }`
- [ ] T012 [P] [US1] Criar `components/households/household-form.tsx` (client) usando `Form`/`Input`/`Button` do shadcn e `useAction` para `create-household`
- [ ] T013 [US1] Criar `app/(app)/households/new/page.tsx` renderizando `household-form` (criar primeira/nova residência)
- [ ] T014 [US1] Alterar `app/(app)/layout.tsx` para resolver a casa ativa via `getActiveHousehold()` e repassar as residências do usuário ao sidebar
- [ ] T015 [US1] Alterar `actions/create-expense.ts`: resolver `householdId` via `getActiveHousehold()`, validar pertencimento (membership) e que a categoria referenciada pertence à residência; gravar por `householdId`
- [ ] T016 [P] [US1] Alterar `actions/create-category.ts`: gravar por `householdId` da casa ativa com validação de pertencimento
- [ ] T017 [P] [US1] Alterar `actions/update-expense.ts`, `actions/delete-expense.ts` e `actions/toggle-expense-paid.ts`: autorização por pertencimento à casa ativa (qualquer membro edita registros de outros) em vez de `userId === ctx.user.id`
- [ ] T018 [P] [US1] Alterar `actions/update-category.ts` e `actions/delete-category.ts`: autorização por pertencimento à casa ativa
- [ ] T019 [US1] Alterar `app/(app)/dashboard/page.tsx` para obter `householdId` de `getActiveHousehold()` e chamar `getDashboardSummary(householdId)`
- [ ] T020 [P] [US1] Alterar `app/(app)/expenses/page.tsx` para usar `householdId` de `getActiveHousehold()`
- [ ] T021 [P] [US1] Alterar `app/(app)/categories/page.tsx` para usar `householdId` de `getActiveHousehold()`

**Checkpoint**: MVP funcional — criação de residência, papel de Administrador e isolamento de dados por residência para um único usuário

---

## Phase 4: User Story 2 - Convidar membros e colaborar (Priority: P2)

**Goal**: Administrador convida por e-mail; convidados (existentes ou novos, via signup) viram Membros e colaboram no CRUD; Administrador cancela convites e remove membros.

**Independent Test**: Como Administrador, convidar e-mail já cadastrado (convite PENDING) → aceitar como convidado e ver os dados → convidar e-mail sem conta e cadastrar-se com ele (vínculo automático) → como Membro editar despesa do Administrador → cancelar convite pendente (aceite rejeitado) → remover membro.

### Implementation for User Story 2

- [ ] T022 [P] [US2] Criar `data/memberships.ts` com `getMembers(householdId)` (com nome/email do usuário), `getPendingInvitations(householdId)` e `getPendingInvitationsForEmail(email)` (convites PENDING endereçados ao usuário logado, com nome da residência de origem)
- [ ] T023 [US2] Criar `actions/invite-member.ts` (`role = ADMIN` na casa ativa, `.inputSchema(inviteMemberSchema)`): normaliza e-mail, ignora o próprio e-mail, rejeita e-mail que já é membro ou já tem convite PENDING; cria `Invitation` PENDING; revalida `/households`
- [ ] T024 [P] [US2] Criar `actions/cancel-invitation.ts` (`role = ADMIN` da residência do convite, `.inputSchema(invitationIdSchema)`): `status = CANCELLED` apenas se PENDING; revalida `/households`
- [ ] T025 [P] [US2] Criar `actions/accept-invitation.ts` (`.inputSchema(invitationIdSchema)`, usuário autenticado com e-mail == `Invitation.email` e status PENDING): cria `Membership` MEMBER, `status = ACCEPTED`, define `activeHouseholdId` se nulo, idempotente contra duplicidade; retorna `{ householdId }`; revalida `/households`, `/dashboard`
- [ ] T026 [P] [US2] Criar `actions/remove-member.ts` (`role = ADMIN`, `.inputSchema(removeMemberSchema)`): apaga a `Membership` (não permite remover a si mesmo); ajusta `activeHouseholdId` do removido para fallback/null; revalida `/households`
- [ ] T027 [US2] Adicionar `databaseHooks.user.create.after` em `lib/auth.ts`: busca `Invitation` `{ email: user.email, status: PENDING }`, cria `Membership` MEMBER, marca `ACCEPTED` e define `activeHouseholdId` se nulo (idempotente)
- [ ] T028 [P] [US2] Criar `components/households/invite-form.tsx` (client) com `Form`/`Input` e `useAction` para `invite-member`
- [ ] T029 [P] [US2] Criar `components/households/members-table.tsx` usando `Table`/`Badge`, com ação de remover membro (`useAction` de `remove-member`)
- [ ] T030 [P] [US2] Criar `components/households/invitations-list.tsx` usando `Table`/`Badge`, com ação de cancelar convite (`useAction` de `cancel-invitation`)
- [ ] T030a [P] [US2] Criar `components/households/incoming-invitations.tsx` (client) usando `Card`/`Table`/`Button` do shadcn e `useAction` de `accept-invitation` para listar e aceitar convites PENDING endereçados ao usuário logado (FR-015, US2 AS#2)
- [ ] T031 [US2] Criar `app/(app)/households/page.tsx` (gestão da residência ativa): renderiza `incoming-invitations` (convites recebidos pelo usuário via `getPendingInvitationsForEmail`) e, para o Administrador, `invite-form`, `members-table` e `invitations-list` consumindo `getMembers` e `getPendingInvitations`

**Checkpoint**: Colaboração familiar completa — convites, vínculo automático no signup, edição compartilhada e gestão de membros

---

## Phase 5: User Story 3 - Múltiplas residências e casa ativa (Priority: P2)

**Goal**: Usuário pertence a várias residências e alterna a casa ativa por um seletor; todos os dados refletem a residência selecionada.

**Independent Test**: Com usuário em duas residências, abrir o seletor no sidebar (ambas listadas) → trocar a casa ativa e confirmar que dashboard/despesas/categorias mudam (≤ 2s) → criar despesa na residência A e confirmar que não aparece na B.

### Implementation for User Story 3

- [ ] T032 [US3] Criar `actions/switch-active-household.ts` (`.inputSchema(switchHouseholdSchema)`, valida que o usuário é membro do `householdId`): define `User.activeHouseholdId`; revalida `/dashboard`, `/expenses`, `/categories`
- [ ] T033 [US3] Criar `components/layout/household-switcher.tsx` (client) usando `Select`/`DropdownMenu` do shadcn e `useAction` de `switch-active-household`, recebendo as residências do usuário; incluir uma ação "Criar nova residência" (ícone `lucide-react`) que navega para `/households/new`, atendendo à criação de residências adicionais (FR-007)
- [ ] T034 [US3] Integrar o `household-switcher` em `components/layout/app-sidebar.tsx`, exibindo a casa ativa e a lista repassada pelo layout

**Checkpoint**: Troca de casa ativa funcional com isolamento entre residências

---

## Phase 6: User Story 4 - Papéis, permissões e sucessão de administração (Priority: P3)

**Goal**: Um Administrador por residência; só ADMIN edita nome/gestão; ao sair/cancelar cadastro, administração é transferida ao membro mais antigo ou a residência é removida se ele for o único.

**Independent Test**: Como Membro, tentar editar nome e gerenciar membros (bloqueado) → como ADMIN editar nome (refletido a todos) → como ADMIN com outros membros, sair e confirmar sucessão ao mais antigo → como ADMIN único, sair e confirmar remoção da residência e seus dados.

### Implementation for User Story 4

- [ ] T035 [US4] Adicionar `handleAdminDeparture(householdId, leavingUserId)` em `data/households.ts`: em `prisma.$transaction`, se o que sai é ADMIN e há outro membro ativo promove o de menor `joinedAt` a ADMIN e remove sua membership; se for o único integrante, apaga a residência (cascata)
- [ ] T036 [US4] Criar `actions/update-household.ts` (`role = ADMIN`, `.inputSchema(updateHouseholdSchema)`): atualiza `name`; revalida `/households`
- [ ] T037 [US4] Criar `actions/leave-household.ts` (`.inputSchema(switchHouseholdSchema)`, valida pertencimento): chama `handleAdminDeparture`, ajusta `activeHouseholdId` para fallback; revalida `/dashboard`, `/expenses`, `/categories`, `/households`
- [ ] T038 [US4] Adicionar `databaseHooks.user.delete.before` em `lib/auth.ts`: para cada household do usuário chama `handleAdminDeparture(householdId, user.id)`
- [ ] T039 [US4] Alterar `app/(app)/households/page.tsx`: adicionar formulário de edição de nome (só ADMIN, via `update-household`) e botão "sair da residência" (via `leave-household`, visível a todos os membros). A ocultação dos controles de gestão admin-only já é feita em T031.

**Checkpoint**: Governança e continuidade da residência garantidas (invariante de um único Administrador)

---

## Phase 7: User Story 5 - Página inicial ilustrativa (Priority: P3)

**Goal**: Visitante não autenticado vê landing com exemplos estáticos, sem consultar o banco; autenticado é redirecionado ao dashboard.

**Independent Test**: Acessar `/` sem autenticação → ver exemplos estáticos de dashboard, categorias e resumos com CTA de cadastro → confirmar (Network/logs) que nenhuma consulta ao banco ocorre.

### Implementation for User Story 5

- [ ] T040 [P] [US5] Criar seções estáticas em `components/marketing/` (hero + CTA, exemplo de dashboard, exemplo de categorias, exemplo de resumo) com dados constantes no componente, `Card` do shadcn, tokens de tema, `next/image` para imagens e ícones `lucide-react`
- [ ] T041 [US5] Alterar `app/page.tsx`: renderizar a landing estática (componentes de `components/marketing/`) quando não houver sessão e `redirect("/dashboard")` quando autenticado — sem chamar funções de `data/`

**Checkpoint**: Landing de aquisição pronta, sem acesso ao banco

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Qualidade e validação final

- [ ] T042 Rodar `pnpm lint` e corrigir todos os erros de ESLint
- [ ] T043 Rodar `pnpm build` e resolver erros de tipos/build
- [ ] T044 Executar os cenários de `quickstart.md` (US1–US5) para validação manual das regras e critérios de aceite

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências
- **Foundational (Phase 2)**: depende do Setup — BLOQUEIA todas as user stories
- **User Stories (Phase 3+)**: dependem da Foundational
  - US1 (P1) é o MVP; US2/US3 (P2) e US4/US5 (P3) podem seguir em paralelo após a Foundational
- **Polish (Phase 8)**: depende das stories desejadas concluídas

### User Story Dependencies

- **US1 (P1)**: só depende da Foundational
- **US2 (P2)**: só depende da Foundational (usa `data/households.ts` e helper já foundational)
- **US3 (P2)**: só depende da Foundational (`getHouseholdsForUser` já foundational)
- **US4 (P3)**: depende da Foundational; `handleAdminDeparture` (T035) é pré-requisito de `leave-household` (T037) e do hook (T038). Se US2 não estiver feita, a página de gestão (T039) pode ser criada junto de T031
- **US5 (P3)**: totalmente independente das demais (só toca `app/page.tsx` e `components/marketing/`)

### Within Each User Story

- Actions/funções de dados antes das páginas/componentes que as consomem
- `data/memberships.ts` (T022, incl. `getPendingInvitationsForEmail`) antes de `households/page.tsx` (T031)
- `handleAdminDeparture` (T035) antes de `leave-household` (T037) e do hook (T038)

### Parallel Opportunities

- Foundational: T004, T005, T008, T009, T010 em paralelo (após T002/T003)
- US1: T016, T017, T018, T020, T021 em paralelo; T012 em paralelo com as actions
- US2: T024, T025, T026 em paralelo; T028, T029, T030, T030a em paralelo
- US5: T040 pode rodar em paralelo desde o início (independente da Foundational)
- Times distintos podem tocar US1–US5 em paralelo após a Foundational

---

## Parallel Example: User Story 1

```bash
# Após T011/T015, atualizar as demais actions e páginas em paralelo:
Task: "Alterar actions/create-category.ts para usar householdId da casa ativa"
Task: "Alterar actions/update-expense.ts, delete-expense.ts, toggle-expense-paid.ts"
Task: "Alterar actions/update-category.ts e delete-category.ts"
Task: "Alterar app/(app)/expenses/page.tsx para usar householdId"
Task: "Alterar app/(app)/categories/page.tsx para usar householdId"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: Setup
2. Phase 2: Foundational (CRÍTICO — bloqueia tudo)
3. Phase 3: US1
4. **PARE e VALIDE**: testar US1 isoladamente (criação de residência + isolamento)

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 → validar → MVP
3. US2 (colaboração) → validar
4. US3 (múltiplas residências) → validar
5. US4 (sucessão/permissões) → validar
6. US5 (landing) → validar
7. Polish (lint, build, quickstart)

### Parallel Team Strategy

Após a Foundational: Dev A em US1, Dev B em US2, Dev C em US3; US4/US5 conforme capacidade (US5 é totalmente independente).

---

## Notes

- [P] = arquivos diferentes, sem dependências
- Toda mutação usa `next-safe-action` + `protectedActionClient` + `.inputSchema` (base: `actions/create-expense.ts`)
- Toda leitura fica em `data/`; componentes/páginas nunca chamam Prisma direto
- Cores só via tokens de `app/globals.css`; medidas em `rem`; ícones `lucide-react`; componentes shadcn/ui
- Sem comentários no código; corrigir ESLint; kebab-case em arquivos/pastas
- Não rodar `npm run dev` para validar (proibido pela constituição) — usar `pnpm lint`/`pnpm build` e `quickstart.md`
- Commit após cada tarefa ou grupo lógico
