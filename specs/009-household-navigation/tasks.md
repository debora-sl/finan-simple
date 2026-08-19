---
description: "Task list for feature 009 — Residências: menu, listagem e edição por residência"
---

# Tasks: Residências — menu, listagem e edição por residência

**Input**: Design documents from `/specs/009-household-navigation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/data-layer.md, contracts/server-actions.md, quickstart.md

**Tests**: Não solicitados. O projeto não possui suíte automatizada; o portão de qualidade é `pnpm lint` sem erros + validação manual via quickstart.md. Nenhuma tarefa de teste é gerada.

**Organization**: Tarefas agrupadas por user story para implementação e teste independentes. Todas as user stories P1 (US1, US2, US3) mais US4 (P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências pendentes)
- **[Story]**: US1, US2, US3, US4
- Caminhos de arquivo exatos incluídos em cada tarefa

## Path Conventions

Single-project Next.js App Router (grupo de rotas `(app)`). Rotas em `app/(app)/`, UI em `components/`, dados em `data/`, actions em `actions/`, validação em `lib/validation/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparação e leitura de convenções obrigatórias antes de escrever código.

- [X] T001 Ler o guia de rotas dinâmicas do Next.js 16 em `node_modules/next/dist/docs/` (convenção `params: Promise<{ id: string }>` + `await params`) antes de criar o segmento `[id]`, conforme AGENTS.md e research.md §1.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura que precede múltiplas user stories.

**⚠️ CRITICAL**: Deve ser concluída antes de US1 (listagem, header e link de criação) e US3 (rota de edição), pois ambas envolvem o namespace `/households/*` e a leitura tolerante a nulo da residência ativa.

- [X] T002 Verificar e resolver a colisão de rotas entre `app/(onboarding)/households/new/page.tsx` (segmento estático `new`) e o novo segmento dinâmico `app/(app)/households/[id]/page.tsx`: confirmar que `/households/new` continua servindo o fluxo de criação sem conflitar com `/households/[id]` (rodar `pnpm build`/`pnpm lint` para detectar erro de rotas paralelas). Documentar a decisão de que "Criar nova residência" na listagem aponta para `/households/new` (research.md §6). **Contingência**: se o `pnpm build` acusar conflito de rotas paralelas entre os grupos, a ação corretiva é ajustar o segmento de criação (ex.: mover `/households/new` para um caminho não colidente ou consolidá-lo no grupo `(app)`), documentando a decisão adotada.
- [X] T002A [P] Adicionar `getActiveHouseholdId(userId: string): Promise<string | null>` em `data/households.ts`: lê `user.activeHouseholdId` diretamente (sem redirect nem reatribuição automática), retornando `null` quando ausente (contracts/data-layer.md). Serve para a listagem (T004) e o header (T014) determinarem a residência ativa **tolerando ausência** (FR-021), sem acionar `getActiveHousehold()` (`lib/active-household.ts`), que redireciona para `/households/new` quando não há residências e impediria o estado vazio e o rótulo neutro.

**Checkpoint**: Namespace de rotas de residência estável e leitura tolerante a nulo da residência ativa disponível — user stories podem começar.

---

## Phase 3: User Story 1 - Listar todas as residências do usuário (Priority: P1) 🎯 MVP

**Goal**: A rota `/households` passa a listar todas as residências do usuário (nome + papel + indicador de ativa), com a ativa destacada no topo e as demais em ordem alfabética; o botão "Criar nova residência" fica no cabeçalho da página; estado vazio com CTA quando não há residências.

**Independent Test**: Com um usuário membro de ≥ 2 residências, abrir "Residência" e confirmar que todas aparecem com nome e papel (Admin/Membro), a ativa destacada e no topo com indicador "Ativa", as demais em A→Z, e o botão "Criar nova residência" presente no cabeçalho. Com uma única residência, ela aparece sem fricção. Sem nenhuma residência, aparece o estado vazio com CTA.

### Implementation for User Story 1

- [X] T003 [P] [US1] Criar `components/households/households-list.tsx` (Server ou Client conforme necessidade de apresentação): recebe `households: Array<{ id; name; role }>` e `activeHouseholdId: string | null`; renderiza cada residência num `Card` com nome, `Badge` de papel (Admin/Membro) e `Badge` "Ativa" para a ativa; a ativa vem destacada e no topo, as demais ordenadas alfabeticamente por nome (A→Z) — como `getHouseholdsForUser` entrega a lista em ordem `joinedAt`, a ordenação alfabética das não-ativas é aplicada **na apresentação** (FR-003); cada item tem link "Editar" para `/households/[id]` (usar `lucide-react`, tokens de tema, medidas em `rem`). Reservar o slot da ação "Definir como ativa" para US2 (T006).
- [X] T004 [US1] Reescrever `app/(app)/households/page.tsx` para: obter `userId` via sessão (`getCurrentUser`/`verifySession`) e o `activeHouseholdId` (possivelmente `null`) via `getActiveHouseholdId(userId)` (T002A) — **sem** usar `getActiveHousehold()`, que redirecionaria o usuário sem residências e impediria o estado vazio; obter a lista via `getHouseholdsForUser(userId)` (data layer, sem Prisma no componente); derivar a residência ativa cruzando `activeHouseholdId` com a lista; renderizar cabeçalho com título + link "Criar nova residência" apontando para `/households/new`; renderizar `HouseholdsList`; exibir estado vazio com CTA "Criar nova residência" (FR-021) quando a lista estiver vazia. Remover da página o conteúdo antigo de edição (nome/membros/convites/sair/excluir), que migra para a rota `[id]` (US3). Depende de T002A.

**Checkpoint**: `/households` lista todas as residências e permite criar nova pelo cabeçalho — testável isoladamente (US2/US3 ainda podem coexistir com o switcher atual).

---

## Phase 4: User Story 2 - Trocar a residência ativa a partir da listagem (Priority: P1)

**Goal**: Cada residência não ativa da listagem oferece "Definir como ativa"; ao acionar, o contexto ativo muda e a lista/header refletem a mudança sem reload manual; a residência ativa não oferece a ação.

**Independent Test**: Com duas residências, acionar "Definir como ativa" na não ativa e confirmar que o contexto muda (lista reordena/redestaca) e que a ação some para a que virou ativa; a ativa exibe só o indicador.

### Implementation for User Story 2

- [X] T005 [P] [US2] Criar `components/households/set-active-household-button.tsx` (Client Component): recebe `householdId`; usa `useAction(switchActiveHousehold)` (reuso, sem alteração de contrato) com `onSuccess: () => router.refresh()` e `onError` via `useActionErrorHandler`; botão com rótulo acessível "Definir como ativa" e `disabled` durante `isPending` (padrão do antigo `household-switcher.tsx`).
- [X] T006 [US2] Integrar `SetActiveHouseholdButton` em `components/households/households-list.tsx`: renderizar a ação apenas para itens cujo `id !== activeHouseholdId` (FR-004); garantir que, após a troca, o `router.refresh()` reordene e redestaque a lista (FR-005/FR-017).

**Checkpoint**: Troca de residência ativa funciona pela listagem — US1 + US2 testáveis juntas.

---

## Phase 5: User Story 3 - Editar uma residência específica pela sua página (Priority: P1)

**Goal**: Nova rota `/households/[id]` reúne nome, membros, convidar, convites, sair e zona de perigo, sempre operando sobre a residência da rota, com papel derivado dessa residência; acesso negado se não for membro; exclusão redireciona para `/households`.

**Independent Test**: Abrir a edição de uma residência que **não** é a ativa; como ADMIN, alterar nome/gerenciar convites/excluir atuam só naquela residência; como MEMBRO, ações de admin não aparecem mas "Sair" sim; id inexistente / não-membro → acesso negado.

### Implementation for User Story 3

- [X] T007 [P] [US3] Adicionar `getHouseholdForUserWithRole(userId: string, householdId: string): Promise<{ id; name; role: "ADMIN" | "MEMBER" } | null>` em `data/households.ts`: **uma única** consulta `membership` por `userId_householdId` com `include: { household }` (reaproveitando o padrão de `getMembership`/`getHouseholdById` em vez de duplicar as duas leituras); mapeia para o shape acima e retorna `null` se não existir (guard de acesso — contracts/data-layer.md, FR-014).
- [X] T008 [P] [US3] Alterar `inviteMemberSchema` em `lib/validation/invitation.ts` para incluir `householdId: z.string().min(1)` (contracts/server-actions.md).
- [X] T009 [US3] Alterar `actions/invite-member.ts` para ler `householdId` do input (`.inputSchema`, `protectedActionClient`) e validar `Membership(user, householdId).role === "ADMIN"` **daquela** residência (não da ativa); preservar as demais validações (e-mail próprio, usuário inexistente, já membro, convite pendente/recusado) usando o `householdId` do input; `revalidatePath("/households")` + `revalidatePath("/households/[id]")` (FR-011/FR-012/FR-015). Depende de T008.
- [X] T010 [P] [US3] Alterar `components/households/invite-form.tsx` para receber a prop `householdId` e incluí-la no `execute({ householdId, email })`. Depende de T008.
- [X] T011 [US3] Alterar `components/households/delete-household-button.tsx` e `components/households/leave-household-button.tsx` para redirecionar via `router.push("/households")` (hoje `/dashboard`) no `onSuccess` (FR-016, research.md §8).
- [X] T012 [US3] Criar `app/(app)/households/[id]/page.tsx` (Server Component async): `const { id } = await params`; obter `userId` via sessão e `getHouseholdForUserWithRole(userId, id)` — se `null`, chamar `notFound()` (FR-014/SC-005); derivar `isAdmin` do `role` da rota; carregar `getMembers(id)` e `getHouseholdInvitations(id)` (data layer); reusar `HouseholdNameForm` (admin), `MembersTable`, `InviteForm` (passando `householdId={id}`), `InvitationsList` (admin), `LeaveHouseholdButton` (householdId={id}) e `DeleteHouseholdButton` (householdId={id}); mesma composição de `Card`s do antigo `households/page.tsx`, porém escopada por `id`. Depende de T007, T009, T010, T011.

**Checkpoint**: Edição por residência funciona desacoplada da ativa — US1 + US2 + US3 entregam o núcleo P1.

---

## Phase 6: User Story 4 - Saber qual residência está ativa pelo header (Priority: P2)

**Goal**: O header exibe a residência ativa de forma persistente em todas as telas (rótulo neutro "Nenhuma residência" quando não há ativa); o switcher é removido da sidebar (desktop + mobile), mantendo o item de menu "Residência".

**Independent Test**: Navegar por Dashboard/Despesas/Categorias/Cofrinho e confirmar que o header mostra sempre a residência ativa e reflete a troca feita na listagem; inspecionar sidebar desktop e mobile e confirmar ausência do switcher e do "Criar nova residência", com o item "Residência" presente.

### Implementation for User Story 4

- [X] T013 [P] [US4] Alterar `components/layout/app-header.tsx` para receber `householdName?: string | null` e exibir a residência ativa de forma persistente (rótulo neutro "Nenhuma residência" quando ausente — FR-021), preservando saudação/menu mobile existentes; usar tokens de tema e `rem`.
- [X] T014 [US4] Alterar `app/(app)/layout.tsx` para obter `userId` via `getCurrentUser` e o `activeHouseholdId` (possivelmente `null`) via `getActiveHouseholdId(userId)` (T002A) — **sem** depender do redirect de `getActiveHousehold()` —, derivar o nome da residência ativa cruzando esse id com a lista de `getHouseholdsForUser` e passá-lo ao `AppHeader`; parar de repassar `households`/`activeHouseholdId` ao sidebar/mobile nav (switcher removido); tolerar `activeHouseholdId` ausente/`null`, exibindo o rótulo neutro no header (FR-021). Depende de T002A, T013, T015.
- [X] T015 [US4] Alterar `components/layout/app-sidebar.tsx` para remover `HouseholdSwitcher` de `SidebarContent` (desktop e mobile) e suas props `households`/`activeHouseholdId` em `AppSidebar`/`AppSidebarMobileNav`, mantendo o item de menu "Residência" (FR-008).
- [X] T016 [P] [US4] Remover o arquivo `components/layout/household-switcher.tsx` (deixa de ser usado). Depende de T015.

**Checkpoint**: Header mostra a residência ativa em todas as telas e a sidebar não tem mais switcher — reorganização completa sem regressão.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Portão de qualidade e validação end-to-end.

- [X] T017 [P] Rodar `pnpm lint` e corrigir todos os erros de ESLint nos arquivos alterados/criados (portão de qualidade do projeto).
- [X] T018 Executar a validação manual do `specs/009-household-navigation/quickstart.md` (cenários 1–8 + regressão SC-008): listagem, troca ativa, edição por rota, header, convite/remoção por rota, exclusão, acesso negado e sidebar sem switcher.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências.
- **Foundational (Phase 2)**: depende do Setup; T002 (namespace de rotas) e T002A (leitura tolerante a nulo da residência ativa) BLOQUEIAM US1 (listagem/header/link de criação — T004) e US3 (rota `[id]`). T002 e T002A são independentes entre si ([P]).
- **US1 (Phase 3)**: depende do Foundational (T002 + T002A).
- **US2 (Phase 4)**: depende de US1 (integra a ação de troca na `households-list`).
- **US3 (Phase 5)**: depende do Foundational; independente de US1/US2 (rota própria).
- **US4 (Phase 6)**: depende do Foundational; recomendado por último entre as stories porque o switcher só deve ser removido depois que US1 (criar) e US2 (trocar) oferecem os pontos substitutos, evitando regressão.
- **Polish (Phase 7)**: depende de todas as stories desejadas.

### User Story Dependencies

- **US1 (P1)**: base da reorganização — sem dependência de outras stories.
- **US2 (P1)**: depende da lista de US1 (T003/T006 tocam o mesmo componente).
- **US3 (P1)**: independente — nova rota e camada de dados/actions próprias.
- **US4 (P2)**: independente em teste, mas sequenciada por último para não remover o switcher antes dos substitutos.

### Within Each User Story

- US2: T005 (botão) pode ser criado em paralelo; T006 integra na lista (após T005 e T003).
- US3: T007/T008/T010 em paralelo; T009 depois de T008; T012 depois de T007/T009/T010/T011.
- US4: T013 e T016 marcados [P]; T015 antes de T016 e T014; T014 fecha a composição.

### Parallel Opportunities

- **US3**: `getHouseholdForUserWithRole` (T007), schema `inviteMemberSchema` (T008) e `invite-form` (T010) são arquivos distintos — podem ir em paralelo.
- **US4**: `app-header.tsx` (T013) e remoção de `household-switcher.tsx` (T016) são independentes entre si.
- Entre stories: US3 pode ser desenvolvida em paralelo com US1/US2 por outra pessoa (arquivos distintos).

---

## Parallel Example: User Story 3

```bash
# Podem começar juntas (arquivos diferentes):
Task: "T007 [US3] getHouseholdForUserWithRole em data/households.ts"
Task: "T008 [US3] householdId em lib/validation/invitation.ts"
Task: "T010 [US3] prop householdId em components/households/invite-form.tsx"
# Depois: T009 (usa T008), então T012 (usa T007/T009/T010/T011)
```

---

## Implementation Strategy

### MVP First (P1: US1 → US2 → US3)

1. Phase 1 (Setup) + Phase 2 (Foundational).
2. US1 — listagem em `/households` com criação no cabeçalho. **STOP e valide** (lista, papel, ativa no topo, estado vazio).
3. US2 — "Definir como ativa" na listagem. Valide troca de contexto sem reload.
4. US3 — edição por `/households/[id]` escopada por rota, com guard de acesso. Valide admin/membro/negado.
5. MVP entregue com paridade de gestão desacoplada da ativa.

### Incremental Delivery

1. Foundational pronto → US1 (MVP de listagem) → US2 (troca) → US3 (edição por rota) → US4 (header + remoção do switcher) → Polish.
2. Cada incremento é testável e não regride o anterior (o switcher permanece funcional até US4).

### Notes

- [P] = arquivos diferentes, sem dependência pendente.
- Prisma só em `data/`; actions com `protectedActionClient` + `.inputSchema`; shadcn/ui + tokens de tema; `rem`; ícones `lucide-react`; sem comentários; kebab-case.
- Atenção ao namespace `/households/*`: `/households/new` (grupo onboarding) vs `/households/[id]` (grupo app) — validado em T002.
- Header/estado vazio dependem de `activeHouseholdId` possivelmente nulo (FR-021) — tolerar ausência de residência ativa. A leitura tolerante a nulo é `getActiveHouseholdId(userId)` (T002A), distinta de `getActiveHousehold()`, que redireciona quando não há residências.
