---

description: "Task list for Gestão de Despesas com Autenticação"

---

# Tasks: Gestão de Despesas com Autenticação

**Input**: Design documents from `specs/001-expense-management/` (plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md)

**Prerequisites**: `plan.md` ✅, `spec.md` ✅, `research.md` ✅, `data-model.md` ✅, `contracts/` ✅ (`auth.md`, `expenses.md`, `categories.md`, `dashboard.md`)

**Tests**: Não solicitados no spec/plan. Validação funcional é manual via `quickstart.md` (constituição não ratifica framework de teste automatizado nesta versão). Nenhuma tarefa de teste automatizado é gerada.

**Organização**: Tarefas agrupadas por user story (US1–US5, prioridades do `spec.md`) para permitir implementação e teste independentes de cada uma.

**Design System**: `design/` é referência visual, nunca importado por `app/`/`components/` — ver `design/USO-NO-PROJETO.md` e a seção "Design System / UI" do `plan.md`. Cada tarefa de UI cita o `.prompt.md`/`.jsx` de referência; componentes são **reconstruídos com shadcn/ui + tokens de `app/globals.css`**, nunca copiados.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência pendente)
- **[Story]**: US1–US5, mapeando ao `spec.md`
- Caminhos de arquivo exatos em cada descrição

## Path Conventions

Aplicação única (Next.js App Router, sem separação backend/frontend) — ver "Project Structure" em `plan.md`: `app/`, `components/`, `data/`, `actions/`, `lib/`, `prisma/`, `proxy.ts` na raiz do repositório.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialização do projeto — dependências e shadcn/ui ainda não existem (`app/` só tem `layout.tsx`, `page.tsx`, `globals.css`).

- [X] T001 Instalar dependências via pnpm: `better-auth`, `prisma` (dev) + `@prisma/client`, `next-safe-action`, `zod`, `react-hook-form`, `@hookform/resolvers`, `lucide-react`, `recharts` (para o `chart` do shadcn)
- [X] T002 [P] Inicializar shadcn/ui (`pnpm dlx shadcn@latest init`) e gerar os componentes: `button`, `input`, `label`, `form`, `card`, `table`, `select`, `sheet`, `dialog`, `switch`, `badge`, `sonner`, `chart`, `progress` (base do `CategoryBar` — ver mapeamento DS→shadcn no `plan.md`) — confirmar que consomem os tokens já existentes em `app/globals.css` (não sobrescrever)
- [X] T003 [P] Criar `.env` e `.env.example` com `DATABASE_URL="file:./dev.db"`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL="http://localhost:3000"`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Schema de dados, autenticação, DAL, cliente de Server Actions e utilitários compartilhados — bloqueia todas as user stories.

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase estar completa.

- [ ] T004 Criar `prisma/schema.prisma` (provider `sqlite`) com os modelos `User`, `Category`, `Session`, `Account`, `Verification` conforme `data-model.md` (campos, `@unique`). Em `Category`, incluir a coluna derivada `nameLower` e o índice único composto `@@unique([userId, nameLower])` que garante a unicidade **case-insensitive** de nome por usuário exigida por FR-011 (índice sobre `name` seria case-sensitive no SQLite)
- [ ] T004a Adicionar modelo `Expense` a `prisma/schema.prisma` (`amountInCents Int`, `categoryId` opcional com `onDelete: SetNull`, `userId` com `onDelete: Cascade`, índices `(userId, date)` e `(userId, categoryId)`) — depende de T004
- [ ] T005 Rodar `pnpm prisma generate` e `pnpm prisma migrate dev --name init` — depende de T004a
- [ ] T006 [P] Criar `lib/prisma.ts` (singleton do `PrismaClient`, padrão global em dev) — depende de T005
- [ ] T007 Criar `lib/auth.ts` (`betterAuth` com `prismaAdapter(prisma, { provider: "sqlite" })` e `emailAndPassword: { enabled: true }`) — depende de T006
- [ ] T008 [P] Criar `lib/auth-client.ts` (`createAuthClient` de `better-auth/react`, expondo `signIn`, `signUp`, `signOut`, `useSession`) — depende de T007
- [ ] T009 Criar `app/api/auth/[...all]/route.ts` (exports `GET`/`POST` via `toNextJsHandler(auth)`) — depende de T007
- [ ] T010 Criar `lib/dal.ts` (`verifySession()` com `cache` do React, redireciona a `/login` sem sessão; `getCurrentUser()` retornando DTO sem campos sensíveis) — depende de T007
- [ ] T011 Criar `lib/action-client.ts` (`actionClient` base + `protectedActionClient` com middleware que injeta `ctx.user` a partir de `verifySession()`/`getCurrentUser()`, lançando erro sem sessão) — depende de T010
- [ ] T012 Criar `proxy.ts` na raiz do projeto (checagem otimista por cookie: `(app)` sem cookie → `/login`; `/login`/`/signup` com cookie → `/dashboard`; `matcher` excluindo `api`, `_next/static`, `_next/image`) — depende de T007
- [ ] T013 [P] Criar `lib/money.ts` (`amountToCents`/`centsToAmount`, formatação BRL via `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`) — sem dependências
- [ ] T014 Verificar `app/layout.tsx` (footer já renderizado? não duplicar) e adicionar `<Toaster />` (shadcn `sonner`) ao root layout. Estabelecer o **padrão único de superfície de erro/validação (FR-018)**: todo componente que consome uma action via `useAction` trata `onError`/`serverError`/`validationErrors` exibindo `toast.error` com a mensagem retornada, e `onSuccess` com feedback de sucesso — erros de campo específicos permanecem inline no `Form`. Esse padrão é referência obrigatória para T028/T029, T036/T037, T041 — depende de T002

**Checkpoint**: Fundação pronta — autenticação, acesso a dados e Server Actions protegidas disponíveis para todas as user stories.

---

## Phase 3: User Story 1 - Autenticação de Usuário (Priority: P1) 🎯 MVP

**Goal**: Visitante cria conta (nome, e-mail, senha) e usuários cadastrados entram/saem da conta, com acesso restrito à área autenticada.

**Independent Test**: Criar conta nova, sair, entrar novamente com as mesmas credenciais; confirmar acesso à área autenticada e rejeição de credenciais inválidas.

**Referência visual**: DS não tem telas de login/cadastro dedicadas — montar com `design/components/core/Input.prompt.md`, `Button.prompt.md`, `Card.prompt.md`; navegação autenticada com `design/ui_kits/dashboard/Sidebar.jsx` e `Topbar.jsx`.

### Implementation for User Story 1

- [ ] T015 [P] [US1] Criar `lib/validation/auth.ts` (schemas Zod: signup `{ name: min(2), email, password: min(8) }`; login `{ email, password }`)
- [ ] T016 [P] [US1] Criar `components/auth/signup-form.tsx` (client; shadcn `Form` + `react-hook-form` + resolver Zod de T015; chama `authClient.signUp.email`; erro de e-mail duplicado exibido no formulário — FR-002, Cenário US1.3)
- [ ] T017 [P] [US1] Criar `components/auth/login-form.tsx` (client; chama `authClient.signIn.email`; erro genérico sem indicar campo — Cenário US1.4)
- [ ] T018 [US1] Criar `app/(auth)/layout.tsx` (layout público, composição com `Card` do shadcn, referência `design/components/core/Card.prompt.md`)
- [ ] T019 [US1] Criar `app/(auth)/signup/page.tsx` (renderiza `SignupForm`) — depende de T016, T018
- [ ] T020 [US1] Criar `app/(auth)/login/page.tsx` (renderiza `LoginForm`) — depende de T017, T018
- [ ] T021 [US1] Criar `app/(app)/layout.tsx` (layout autenticado: `verifySession()`, navegação via `Sidebar`/`Topbar` reconstruídos com shadcn a partir de `design/ui_kits/dashboard/Sidebar.jsx` e `Topbar.jsx`, botão de sair chamando `authClient.signOut` — FR-004, Cenário US1.5) — depende de T010
- [ ] T022 [US1] Atualizar `app/page.tsx` para redirecionar a `/dashboard` (com sessão) ou `/login` (sem sessão) — depende de T010

**Checkpoint**: US1 completa e testável de forma independente (cadastro, login, logout, bloqueio de rota sem sessão via `proxy.ts` + DAL).

---

## Phase 4: User Story 2 - Registro e Gestão de Despesas (Priority: P1)

**Goal**: Usuário autenticado cria, lista, edita e remove despesas (descrição, valor, data, categoria opcional).

**Independent Test**: Criar uma despesa autenticado e verificar que aparece somente na lista desse usuário.

**Referência visual**: lista → `design/components/finance/TransactionRow.prompt.md`; formulário → `design/ui_kits/dashboard/AddTransactionModal.jsx` e `design/components/finance/BillItem.prompt.md`; layout da tela → `design/ui_kits/dashboard/DashboardScreen.jsx` (seção de transações).

### Implementation for User Story 2

- [ ] T023 [P] [US2] Criar `lib/validation/expense.ts` (Zod: `description` min1/max200, `amount` positive/multipleOf(0.01), `date`, `categoryId` opcional) — depende de T013
- [ ] T024 [P] [US2] Criar `data/expenses.ts` (`getExpenses(userId)` ordenado por `date` desc com `category` incluída; `getExpenseById(userId, id)`) — depende de T006
- [ ] T025 [US2] Criar `actions/create-expense.ts` (`protectedActionClient`, `.inputSchema`, converte `amount`→`amountInCents` via `lib/money.ts`, valida posse de `categoryId` se informado, `isPaid = false`) — depende de T011, T023, T024
- [ ] T026 [US2] Criar `actions/update-expense.ts` (mesma validação de posse da despesa e da categoria) — depende de T025
- [ ] T027 [US2] Criar `actions/delete-expense.ts` (remove só se `expense.userId === ctx.user.id`) — depende de T025
- [ ] T028 [P] [US2] Criar `components/expenses/expense-form.tsx` (client; `Sheet`/`Dialog` do shadcn — não recriar botão de fechar do `Sheet`; `Form` + `react-hook-form`; `useAction` para create/update com o padrão de erro/sucesso de T014 — FR-018; referência `design/ui_kits/dashboard/AddTransactionModal.jsx`)
- [ ] T029 [P] [US2] Criar `components/expenses/expense-table.tsx` (shadcn `Table`; referência `design/components/finance/TransactionRow.prompt.md`; ações de editar/remover via `useAction` com o padrão de erro/sucesso de T014 — FR-018)
- [ ] T030 [US2] Criar `app/(app)/expenses/page.tsx` (Server Component; busca `getExpenses` via DAL; renderiza `ExpenseTable` + gatilho do `ExpenseForm`; referência `design/ui_kits/dashboard/DashboardScreen.jsx`) — depende de T024, T028, T029

**Checkpoint**: US1 + US2 funcionam de forma independente (despesas sem categoria ainda são suportadas; seletor de categoria populado em US3).

---

## Phase 5: User Story 3 - Categorias de Despesas (Priority: P2)

**Goal**: Usuário cria categorias e as associa às despesas.

**Independent Test**: Criar categoria, associá-la a uma despesa, confirmar que a despesa exibe a categoria escolhida.

**Referência visual**: `design/components/finance/CategoryBar.prompt.md`, `CategoryIcon.prompt.md` (mapa fixo das 9 categorias, `--cat-*`); seleção em formulário → `design/components/core/Select.prompt.md`.

### Implementation for User Story 3

- [ ] T031 [P] [US3] Criar `lib/validation/category.ts` (Zod: `name` trim/min1/max60)
- [ ] T032 [P] [US3] Criar `data/categories.ts` (`getCategories(userId)` ordenado por `name`; `getCategoryById(userId, id)`) — depende de T006
- [ ] T033 [US3] Criar `actions/create-category.ts` (deriva `nameLower = name.trim().toLowerCase()` e persiste; unicidade case-insensitive garantida por `@@unique([userId, nameLower])`; captura `P2002` do Prisma e retorna erro claro de nome duplicado — FR-011, FR-018) — depende de T011, T031, T032
- [ ] T034 [US3] Criar `actions/update-category.ts` (mesma checagem de posse; recalcula `nameLower` ao renomear; mesma captura de duplicidade `P2002` com erro claro — FR-011, FR-018) — depende de T033
- [ ] T035 [US3] Criar `actions/delete-category.ts` (remove; despesas associadas ficam com `categoryId = null` via `onDelete: SetNull` — FR-014) — depende de T033
- [ ] T036 [P] [US3] Criar `components/categories/category-form.tsx` (client; `Dialog`/`Form` shadcn; `useAction` com o padrão de erro/sucesso de T014, incluindo a mensagem de nome duplicado de T033/T034 — FR-011, FR-018)
- [ ] T037 [P] [US3] Criar `components/categories/category-list.tsx` (referência `design/components/finance/CategoryBar.prompt.md` e `CategoryIcon.prompt.md`)
- [ ] T038 [US3] Criar `app/(app)/categories/page.tsx` (Server Component; busca `getCategories`; renderiza `CategoryList` + `CategoryForm`) — depende de T032, T036, T037
- [ ] T039 [US3] Integrar `Select` de categoria (shadcn, referência `design/components/core/Select.prompt.md`) em `components/expenses/expense-form.tsx`, populado por `getCategories` — depende de T028, T032

**Checkpoint**: US1 + US2 + US3 funcionam de forma independente (despesas podem ser associadas a categorias do próprio usuário).

---

## Phase 6: User Story 4 - Marcar Despesas como Pagas (Priority: P2)

**Goal**: Usuário alterna cada despesa entre paga/não paga.

**Independent Test**: Marcar despesa como paga, verificar reflexo na lista, reverter para não paga.

**Referência visual**: toggle em `design/components/finance/TransactionRow.prompt.md` e `design/components/core/Switch.prompt.md`; distinção visual via `design/components/core/Badge.prompt.md`.

### Implementation for User Story 4

- [ ] T040 [US4] Criar `actions/toggle-expense-paid.ts` (`inputSchema { id, isPaid }`; altera só se a despesa pertence a `ctx.user.id`) — depende de T011, T024
- [ ] T041 [US4] Atualizar `components/expenses/expense-table.tsx` com `Switch`/`Badge` do shadcn para alternar e exibir pago/pendente via `useAction(toggleExpensePaid)`, seguindo o padrão de erro/sucesso de T014 — FR-018 — depende de T029, T040

**Checkpoint**: US1–US4 funcionam de forma independente.

---

## Phase 7: User Story 5 - Visualização da Dashboard (Priority: P3)

**Goal**: Dashboard com total, pago/pendente e distribuição por categoria de todo o histórico do usuário.

**Independent Test**: Registrar despesas em categorias distintas com estados de pagamento variados; conferir que totais e agrupamentos exibidos correspondem aos dados.

**Referência visual**: layout → `design/ui_kits/dashboard/DashboardScreen.jsx`; cards → `design/components/finance/SummaryCard.prompt.md`; distribuição → `design/components/finance/CategoryDonut.prompt.md` e `CategoryBar.prompt.md`.

### Implementation for User Story 5

- [ ] T042 [P] [US5] Criar `data/dashboard.ts` (`getDashboardSummary(userId)`: `aggregate`/`groupBy` no Prisma sobre `amountInCents`, retorno `{ hasExpenses, totalInCents, paidInCents, pendingInCents, byCategory }` conforme `contracts/dashboard.md`, bucket "Sem categoria" para `categoryId = null`) — depende de T006
- [ ] T043 [P] [US5] Criar `components/dashboard/summary-cards.tsx` (shadcn `Card`; referência `design/components/finance/SummaryCard.prompt.md`; formata valores via `lib/money.ts`)
- [ ] T044 [P] [US5] Criar `components/dashboard/category-breakdown.tsx` (shadcn `chart`/recharts para donut + `CategoryBar`; referência `design/components/finance/CategoryDonut.prompt.md` e `CategoryBar.prompt.md`)
- [ ] T045 [US5] Criar `app/(app)/dashboard/page.tsx` (Server Component; busca `getDashboardSummary`; estado vazio informativo quando `!hasExpenses` — FR-017; referência `design/ui_kits/dashboard/DashboardScreen.jsx`) — depende de T042, T043, T044

**Checkpoint**: Todas as user stories (US1–US5) funcionam de forma independente.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Portões de qualidade e validação final.

- [ ] T046 [P] Rodar `pnpm lint` e corrigir todos os erros (Constituição, Princípio IV)
- [ ] T047 Rodar `pnpm build` e corrigir erros de tipo/compilação
- [ ] T048 Validar manualmente todos os cenários de `quickstart.md` (US1–US5), incluindo o teste de isolamento entre duas contas (SC-003/SC-004) e a superfície de erro/validação em ações recusadas — e-mail duplicado, valor inválido, nome de categoria duplicado (case-insensitive) — exibindo mensagem clara ao usuário (FR-018)
- [ ] T049 [P] Conferir que `design/` não é importado por nenhum arquivo em `app/` ou `components/` (checagem de grep) e que nenhuma cor hard-coded foi introduzida fora dos tokens de `app/globals.css`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — pode iniciar imediatamente
- **Foundational (Phase 2)**: depende do Setup — BLOQUEIA todas as user stories
- **User Stories (Phase 3–7)**: todas dependem da conclusão do Foundational
  - US1 (P1) e US2 (P1) podem prosseguir em paralelo entre si após o Foundational
  - US3 (P2) depende apenas do Foundational, mas T039 integra com o `expense-form.tsx` de US2 (T028) — logo US3 deve ser concluída após US2 estar pronta para essa integração específica
  - US4 (P2) depende de `data/expenses.ts` (T024, de US2) e da tabela de despesas (T029, de US2)
  - US5 (P3) depende apenas do Foundational (schema de Expense/Category já existente)
- **Polish (Phase 8)**: depende de todas as user stories desejadas estarem completas

### User Story Dependencies

- **US1 (P1)**: sem dependência de outras stories
- **US2 (P1)**: sem dependência funcional de US1, mas roda atrás do proxy/DAL (Foundational); a tela `(app)/expenses` só é alcançável após US1 fornecer login
- **US3 (P2)**: depende de US2 para a integração do `Select` de categoria no formulário de despesa (T039); leitura/gestão de categorias em si é independente
- **US4 (P2)**: depende de US2 (tabela e leitura de despesas)
- **US5 (P3)**: depende do schema de Expense/Category (Foundational); testável de forma mais completa após US2–US4, mas a função de agregação em si não depende do código dessas stories

### Within Each User Story

- Validação (Zod) e leitura (`data/`) antes das Server Actions
- Server Actions antes dos componentes que as consomem via `useAction`
- Componentes antes da página que os compõe
- Story completa antes de avançar para a próxima prioridade

### Parallel Opportunities

- T002 e T003 (Setup) em paralelo
- T006, T008, T013 (Foundational) em paralelo entre si (arquivos independentes)
- T015, T016, T017 (US1) em paralelo
- T023, T024 (US2) em paralelo; T028, T029 (US2) em paralelo
- T031, T032 (US3) em paralelo; T036, T037 (US3) em paralelo
- T042, T043, T044 (US5) em paralelo
- T046 e T049 (Polish) em paralelo

---

## Parallel Example: User Story 1

```bash
# Validação e formulários em paralelo:
Task: "Criar lib/validation/auth.ts"
Task: "Criar components/auth/signup-form.tsx"
Task: "Criar components/auth/login-form.tsx"
```

## Parallel Example: User Story 2

```bash
# Validação e leitura em paralelo:
Task: "Criar lib/validation/expense.ts"
Task: "Criar data/expenses.ts"

# Componentes de UI em paralelo (após as Server Actions):
Task: "Criar components/expenses/expense-form.tsx"
Task: "Criar components/expenses/expense-table.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO — bloqueia todas as stories)
3. Completar Phase 3: US1 (Autenticação)
4. Completar Phase 4: US2 (Despesas)
5. **PARAR e VALIDAR**: testar US1+US2 de forma independente via `quickstart.md`
6. MVP demonstrável: login + CRUD de despesas

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 → testar independentemente → demo (login funcional)
3. US2 → testar independentemente → demo (MVP: despesas)
4. US3 → testar independentemente → demo (categorias)
5. US4 → testar independentemente → demo (status de pagamento)
6. US5 → testar independentemente → demo (dashboard completa)
7. Cada story agrega valor sem quebrar as anteriores

---

## Notes

- `[P]` = arquivos diferentes, sem dependência pendente
- `[Story]` mapeia a tarefa à user story correspondente para rastreabilidade
- Nenhum framework de teste automatizado é usado nesta versão — validação via `quickstart.md`
- Commit por tarefa ou grupo lógico (mensagens em inglês, conforme convenção do repositório)
- Parar em cada checkpoint para validar a story de forma independente
- Evitar: cópia de `.jsx` de `design/`, cores hard-coded, Prisma fora de `data/`, mutações fora de `actions/` com `protectedActionClient`, `.schema()` (usar sempre `.inputSchema()`)
