---
description: "Task list for Melhorias de Experiência e Visual Antes do Deploy"
---

# Tasks: Melhorias de Experiência e Visual Antes do Deploy

**Input**: Design documents from `/specs/004-pre-deploy-refinements/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Não solicitados. O projeto não possui suíte automatizada; a validação é manual via `quickstart.md` + `pnpm lint` (portão obrigatório). Nenhuma tarefa de teste é gerada.

**Organization**: Tarefas agrupadas por história de usuário (US1–US7) para implementação e validação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual história pertence (US1–US7)
- Todo caminho de arquivo é relativo à raiz do repositório

## Path Conventions

Aplicação Next.js App Router monolítica. Pastas convencionais na raiz: `prisma/`, `lib/`, `data/`, `actions/`, `components/`, `app/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparação e leitura de documentação obrigatória antes de escrever código

- [X] T001 Ler os guias relevantes em `node_modules/next/dist/docs/` (App Router `layout.tsx`, Server Components e Server Actions) e consultar via Context7 (`/better-auth/better-auth`) `user.deleteUser`, `databaseHooks` e códigos de erro de sign-in, conforme `AGENTS.md` e Princípio V, antes de implementar as fases seguintes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Alteração de modelo de dados que bloqueia US1 (autor do convite / status REJECTED) e US2 (limpeza de convites-autor no `beforeDelete`)

**⚠️ CRITICAL**: Nenhuma história pode começar antes desta fase concluir

- [X] T002 Alterar o modelo `Invitation` em `prisma/schema.prisma`: adicionar `invitedById String?` e a relação `invitedBy User? @relation("InvitationAuthor", fields: [invitedById], references: [id], onDelete: SetNull)`; adicionar o lado inverso `authoredInvitations Invitation[] @relation("InvitationAuthor")` em `User`; preservar `@@unique([householdId, email])` e `@@index([email, status])` (status permanece `String`, agora com valor `REJECTED`)
- [X] T003 Gerar e aplicar a migração Prisma (`pnpm prisma migrate dev`) e regenerar o cliente (`pnpm prisma generate`); convites históricos ficam com `invitedById = NULL` (sem backfill)

**Checkpoint**: Esquema e cliente Prisma prontos — histórias de usuário podem iniciar

---

## Phase 3: User Story 1 - Fluxo de convites compreensível de ponta a ponta (Priority: P1) 🎯 MVP

**Goal**: Registrar o autor do convite, suportar o estado "Recusado", exibir status ao admin e apresentar ao convidado uma mensagem amigável com ações Aceitar/Recusar.

**Independent Test**: Criar um convite como ADMIN (status "Enviado" com residência/destinatário); acessar como convidado, ver a mensagem "Olá, você recebeu um convite de {nome} para colaborar com o controle financeiro da residência: {nome}." e recusar; confirmar que o admin passa a ver "Recusado".

### Implementation for User Story 1

- [X] T004 [US1] Ajustar `getPendingInvitationsForEmail(email)` em `data/memberships.ts` para incluir `invitedByName` (join `invitedBy.name`, fallback "um administrador" quando nulo) e `householdName`, montando os dados da mensagem da FR-005
- [X] T005 [US1] Em `data/memberships.ts`, renomear `getPendingInvitations` → `getHouseholdInvitations(householdId)` e **remover o filtro `status: "PENDING"`** para retornar todos os convites (`PENDING`/`ACCEPTED`/`REJECTED`) com `{ id, email, status, createdAt }`, ordenados por `createdAt desc`; atualizar o import e a chamada em `app/(app)/households/page.tsx` (linhas 6 e 24) e ajustar o título do card "Convites pendentes" (linha 77) para "Convites"
- [X] T006 [US1] Ajustar `actions/invite-member.ts`: registrar `invitedById = ctx.user.id` no convite criado; substituir o `upsert` que reabre por regras — bloquear e-mail **sem conta na plataforma** (quando `invitedUser` for nulo, reaproveitando o `prisma.user.findUnique` já existente) com "Não existe uma conta com este e-mail. Peça para a pessoa se cadastrar primeiro." (FR-020 / edge "Convite sem conta", sem gerar convite fantasma), bloquear em `PENDING` ("Já existe um convite pendente para esse e-mail."), bloquear em `REJECTED` ("Este e-mail recusou um convite anterior para esta residência.") sem reabrir (FR-020), criar apenas quando não houver registro; manter guardas de ADMIN, próprio e-mail e membro existente com mensagens pt-BR
- [X] T007 [P] [US1] Criar `actions/reject-invitation.ts` (NOVO) espelhando `actions/accept-invitation.ts` com `protectedActionClient` e `.inputSchema(invitationIdSchema)` de `lib/validation/invitation.ts`: exigir convite existente e `status === "PENDING"`, `invitation.email` igual ao e-mail do usuário logado, atualizar `status → REJECTED`, erros "Convite não encontrado ou não está mais pendente." e "Esse convite não pertence à sua conta.", `revalidatePath("/households")`
- [X] T008 [P] [US1] Verificar/ajustar `actions/cancel-invitation.ts` para só cancelar se `status === "PENDING"`, falhando com "Este convite não está mais pendente." (regra de concorrência da clarificação 2026-08-09)
- [X] T009 [P] [US1] Ajustar `components/households/invitations-list.tsx`: incluir `status` no type `Invitation` e mapear cada valor para um `Badge` do shadcn com rótulo pt-BR ("Enviado" para `PENDING`, "Aceito" para `ACCEPTED`, "Recusado" para `REJECTED`) usando variantes/tokens de tema; exibir o botão de cancelar apenas quando `status === "PENDING"`; garantir que a página passe o campo `status`
- [X] T010 [US1] Refatorar `components/households/incoming-invitations.tsx` para um `Dialog` do shadcn exibindo a mensagem exata da FR-005 (com `invitedByName` e `householdName`) e os botões "Aceitar" (`useAction` de `accept-invitation`) e "Recusar" (`useAction` de `reject-invitation`), com toasts de resultado via sonner
- [X] T011 [US1] Em `app/(app)/layout.tsx`, detectar convites pendentes pelo e-mail do usuário logado (`getPendingInvitationsForEmail`) e renderizar o `Dialog` de `incoming-invitations.tsx` na entrada da área autenticada

**Checkpoint**: US1 totalmente funcional e testável de forma independente

---

## Phase 4: User Story 2 - Excluir a própria conta (Priority: P1)

**Goal**: Permitir exclusão permanente da própria conta com confirmação por senha, aplicando as regras de saída de residência e limpando dados pessoais sem órfãos.

**Independent Test**: No perfil, solicitar exclusão, confirmar com senha; verificar encerramento de sessão, redirecionamento a `/login`, login inoperante, transferência de administração ao membro ativo mais antigo (ou remoção da residência quando único integrante) e ausência de órfãos.

### Implementation for User Story 2

- [X] T012 [US2] Ajustar `lib/auth.ts`: habilitar `user.deleteUser.enabled = true` e estender `databaseHooks.user.delete.before` (que já chama `handleAdminDeparture` por residência) para remover convites pendentes de autoria do usuário — `prisma.invitation.deleteMany({ where: { invitedById: user.id, status: "PENDING" } })`
- [X] T013 [P] [US2] Adicionar `deleteAccountSchema` (`{ password: string }`, mensagens zod em pt-BR) em `lib/validation/profile.ts`
- [X] T014 [US2] Criar `actions/delete-account.ts` (NOVO) com `protectedActionClient` e `.inputSchema(deleteAccountSchema)`: executar `auth.api.deleteUser({ body: { password }, headers: await headers() })`; mapear erros via `lib/auth-errors.ts` ("Senha incorreta." / "Não foi possível excluir a conta.")
- [X] T015 [US2] Criar `components/profile/delete-account-card.tsx` (NOVO): cartão "zona de perigo" que abre um `Dialog` de confirmação explícita solicitando a senha (`useAction` de `delete-account`); em sucesso redirecionar para `/login`; confirmação abandonada não altera nada
- [X] T016 [US2] Incluir `delete-account-card` em `app/(app)/profile/page.tsx`

**Checkpoint**: US1 e US2 funcionam de forma independente

---

## Phase 5: User Story 3 - Excluir uma residência (Priority: P1)

**Goal**: Permitir que o ADMIN exclua permanentemente uma residência com confirmação, removendo dados dependentes em cascata e reajustando a residência ativa dos afetados.

**Independent Test**: Como ADMIN, excluir uma residência após confirmação e verificar que ela some para todos os membros, que despesas/categorias/convites/memberships foram removidos e que `activeHouseholdId` dos afetados foi reajustado (ou levado a `/households/new`); como MEMBER, ação negada.

### Implementation for User Story 3

- [X] T017 [P] [US3] Adicionar `deleteHouseholdSchema` (`{ householdId: string }`, mensagens zod pt-BR) em `lib/validation/household.ts`
- [X] T018 [US3] Adicionar helper de exclusão em `data/households.ts` (transação): identificar usuários com `activeHouseholdId === householdId`, executar `prisma.household.delete({ where: { id } })` (cascatas removem `Membership`/`Invitation`/`Category`/`Expense`) e reajustar `activeHouseholdId` de cada afetado para o membership mais antigo restante ou `null`
- [X] T019 [US3] Criar `actions/delete-household.ts` (NOVO) com `protectedActionClient` e `.inputSchema(deleteHouseholdSchema)`: validar `Membership.role === "ADMIN"` na residência-alvo (padrão de `invite-member.ts`), chamar o helper de `data/households.ts`, erros "Apenas o Administrador pode excluir a residência." e "Residência não encontrada.", `revalidatePath` de `/dashboard`, `/expenses`, `/categories`, `/households`
- [X] T020 [US3] Criar `components/households/delete-household-button.tsx` (NOVO): visível apenas para ADMIN, abre `Dialog` de confirmação explícita (`useAction` de `delete-household`); confirmação abandonada não altera nada
- [X] T021 [US3] Integrar `delete-household-button` na página/área de gestão da residência em `app/(app)/households/`

**Checkpoint**: As três histórias P1 (MVP) funcionam de forma independente

---

## Phase 6: User Story 4 - Mensagens de erro claras e em português (Priority: P2)

**Goal**: Mapear centralmente os códigos do Better Auth para mensagens pt-BR e distinguir "sem conta" de "senha incorreta" no login, com canal (toast x FieldError) e tom padronizados.

**Independent Test**: Reproduzir cada caso mapeado (login sem conta, senha incorreta, e-mail já cadastrado, senha atual incorreta, sessão expirada) e confirmar mensagens específicas em pt-BR, sem texto cru do provedor em inglês.

### Implementation for User Story 4

- [X] T022 [P] [US4] Criar `lib/auth-errors.ts` (NOVO): função pura `mapAuthError(codeOuStatus): string` que mapeia `APIError.body.code` / `error.status` do Better Auth para mensagens pt-BR (fonte única, DRY)
- [X] T023 [P] [US4] Criar `data/users.ts` (NOVO) com `getUserByEmail(email)` para o pré-check de existência de conta no login
- [X] T024 [US4] Ajustar `components/auth/login-form.tsx`: pré-check com `getUserByEmail` — sem conta → "Não encontramos uma conta com este e-mail. Que tal criar uma?"; conta existente com sign-in falho → "Senha incorreta."; `status === 403` → "Sua conta ainda não foi verificada. Verifique seu e-mail para continuar."; usar `mapAuthError` e toast
- [X] T025 [P] [US4] Ajustar `components/auth/signup-form.tsx`: mapear `USER_ALREADY_EXISTS` → "Já existe uma conta com este e-mail." via `mapAuthError`; senha fraca / e-mail inválido como `FieldError` (zod pt-BR)
- [X] T026 [P] [US4] Migrar `actions/change-password.ts` e `components/profile/password-form.tsx` para consumir `mapAuthError` (`INVALID_PASSWORD` → "Senha atual incorreta.") e tratar nova senha inválida/igual à atual
- [X] T027 [US4] Padronizar as mensagens de validação zod em pt-BR nos schemas de `lib/validation/*` e o canal de exibição (FieldError para validação de campo; toast/sonner para falha de submissão) de forma consistente em todo o app (FR-022)
- [X] T028 [US4] Padronizar o tratamento de ações protegidas (FR-021): em `lib/action-client.ts`, fazer o `protectedActionClient` lançar um erro de sessão distinguível (ex.: mensagem sentinela "SESSION_EXPIRED" mapeada por `mapAuthError` para "Sua sessão expirou. Faça login novamente.") em vez de "Não autorizado."; criar um `onError` compartilhado (ex.: `lib/action-error.ts` reutilizando `mapAuthError`) que, ao detectar sessão expirada, exibe o toast e redireciona para `/login`, e que padroniza as mensagens de falta de permissão e registro não encontrado; adotar esse handler nos `useAction` das ações protegidas

**Checkpoint**: US1–US4 funcionam de forma independente

---

## Phase 7: User Story 5 - Saudação personalizada do usuário logado (Priority: P2)

**Goal**: Exibir "Olá, {nome}" consistentemente no topo de todas as telas internas, com fallback seguro para nome vazio.

**Independent Test**: Autenticar e navegar por dashboard/despesas/categorias/residência/perfil, verificando a saudação consistente em posição e formato; usuário com nome vazio não quebra o layout.

### Implementation for User Story 5

- [X] T029 [US5] Criar `components/layout/app-header.tsx` (NOVO) que recebe `name` e exibe "Olá, {nome}" (fallback "Olá!" quando vazio) no topo, incluindo o espaço para o trigger de menu mobile (usado em US7)
- [X] T030 [US5] Renderizar `app-header` no topo em `app/(app)/layout.tsx`, passando o nome do usuário logado

**Checkpoint**: Saudação presente em 100% das telas internas

---

## Phase 8: User Story 6 - Entrada clara para o visitante na página inicial (Priority: P2)

**Goal**: Destacar as CTAs "Entrar"/"Cadastrar" no hero da landing (exemplos estáticos, sem consulta ao banco) e redirecionar usuários autenticados da raiz para o dashboard.

**Independent Test**: Abrir o app deslogado e ver landing com exemplos estáticos e CTAs "Entrar"/"Cadastrar" evidentes no hero; autenticado acessando a raiz é redirecionado a `/dashboard`.

### Implementation for User Story 6

- [X] T031 [P] [US6] Ajustar `components/marketing/hero-section.tsx` para destacar as CTAs "Entrar" e "Cadastrar" na área superior/hero usando `Button` do shadcn e tokens de tema
- [X] T032 [US6] Garantir em `app/page.tsx` o redirect do usuário autenticado para `/dashboard` e confirmar que os previews (`components/marketing/*`) permanecem estáticos sem consulta ao banco

**Checkpoint**: Visitante identifica e aciona CTAs; autenticado é redirecionado

---

## Phase 9: User Story 7 - Design moderno e responsivo em todo o produto (Priority: P3)

**Goal**: Adaptar a navegação lateral para telas pequenas via `Sheet` e aplicar responsividade/consistência de tema em landing e área logada, sem rolagem horizontal indevida.

**Independent Test**: Percorrer landing e telas internas em ≈360px, ≈768px e ≥1024px sem quebras nem rolagem horizontal indevida; em tela pequena a navegação colapsa em `Sheet` com botão de fechar nativo.

### Implementation for User Story 7

- [X] T033 [US7] Ajustar `components/layout/app-sidebar.tsx` para colapsar em um `Sheet` do shadcn em larguras pequenas (não recriar o botão de fechar nativo do `Sheet`), mantendo a navegação lateral em telas maiores
- [X] T034 [US7] Conectar o trigger de menu (botão) do `app-header.tsx` ao `Sheet` da navegação mobile
- [X] T035 [US7] Aplicar utilidades responsivas do Tailwind e tokens de tema em tabelas/cards/gráficos das telas internas (`app/(app)/dashboard`, `expenses`, `categories`, `households`), usando containers com rolagem própria quando necessário e destaque para valores financeiros — sem rolagem horizontal da página (SC-008)
- [X] T036 [P] [US7] Aplicar polimento responsivo e consistência de tema na landing (`components/marketing/*` e `app/page.tsx`) para as larguras representativas

**Checkpoint**: Todas as telas responsivas e visualmente consistentes

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Portão de qualidade e validação final

- [X] T037 Corrigir todos os erros de ESLint (`pnpm lint` sem erros) — portão obrigatório da constituição
- [ ] T038 Executar o roteiro de validação manual de `specs/004-pre-deploy-refinements/quickstart.md` cobrindo US1–US7 e confirmando SC-001 a SC-008 (pendente: requer navegador/servidor local, que a constituição proíbe iniciar via `npm run dev`; validar manualmente antes do deploy)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências
- **Foundational (Phase 2)**: Depende do Setup — BLOQUEIA US1 e US2
- **User Stories (Phases 3–9)**: Dependem da Foundational; podem prosseguir em ordem de prioridade (P1 → P2 → P3) ou em paralelo por autor diferente
- **Polish (Phase 10)**: Depende das histórias desejadas concluídas

### User Story Dependencies

- **US1 (P1)**: Depende de T002–T003 (campo `invitedById` + status `REJECTED`)
- **US2 (P1)**: Depende de T002–T003 (limpeza de convites-autor no `beforeDelete`); T014 consome `lib/auth-errors.ts` (T022) — implementar T022 antes de T014 ou usar mensagem provisória
- **US3 (P1)**: Independente das demais após a Foundational
- **US4 (P2)**: Independente; T022 (`auth-errors`) é reutilizado por T014 (US2) e por T028 (tratamento de sessão expirada em ações protegidas, FR-021)
- **US5 (P2)**: T029 cria `app-header`; T030 edita `app/(app)/layout.tsx` (mesmo arquivo de T011/US1 — coordenar edições)
- **US6 (P2)**: Independente
- **US7 (P3)**: T034 depende de T029 (`app-header`); polimento aplicado sobre telas já entregues

### Arquivos compartilhados entre histórias (coordenar)

- `app/(app)/layout.tsx`: T011 (US1), T030 (US5) — não paralelizar entre si
- `lib/auth-errors.ts`: criado em T022 (US4), consumido em T014 (US2)
- `components/layout/app-header.tsx`: criado em T029 (US5), consumido em T034 (US7)

### Within Each User Story

- Camada `data/` e validação antes das actions
- Actions antes da UI que as consome
- UI antes da integração no `layout`/página

---

## Parallel Example: User Story 1

```bash
# Após T002–T006, estas tarefas tocam arquivos distintos e podem correr em paralelo:
Task: "T007 Criar actions/reject-invitation.ts"
Task: "T008 Verificar actions/cancel-invitation.ts"
Task: "T009 Ajustar components/households/invitations-list.tsx"
```

## Parallel Example: User Story 4

```bash
# Início da US4 — arquivos independentes:
Task: "T022 Criar lib/auth-errors.ts"
Task: "T023 Criar data/users.ts (getUserByEmail)"
Task: "T025 Ajustar components/auth/signup-form.tsx"
Task: "T026 Migrar actions/change-password.ts + password-form.tsx"
```

---

## Implementation Strategy

### MVP First (Histórias P1)

1. Completar Phase 1 (Setup) e Phase 2 (Foundational — CRÍTICO)
2. Implementar US1 → validar de forma independente
3. Implementar US2 e US3 (também P1) → validar
4. **PARAR e VALIDAR**: as três histórias P1 formam o MVP funcional para o deploy

### Incremental Delivery

1. Foundational pronto
2. US1 (convites) → validar → demo
3. US2 (excluir conta) + US3 (excluir residência) → validar → demo
4. US4 (mensagens pt-BR), US5 (saudação), US6 (landing) → validar → demo
5. US7 (responsividade/design) como polimento final
6. Phase 10: `pnpm lint` + roteiro `quickstart.md`

### Parallel Team Strategy

Após a Foundational, com autores diferentes: A → US1, B → US2/US3, C → US4/US5/US6; US7 por último, coordenando os arquivos compartilhados listados acima.

---

## Notes

- [P] = arquivos diferentes, sem dependências entre si
- Constituição: shadcn/ui + tokens de tema, `rem`, `lucide-react`, Prisma isolado em `data/`, actions com `next-safe-action`/`protectedActionClient`/`.inputSchema`, kebab-case, sem comentários, sem `npm run dev` para validar
- Sem tarefas de teste automatizado (não solicitadas); validação via `quickstart.md` + `pnpm lint`
- Commitar após cada tarefa ou grupo lógico
