---
description: "Task list for Cofrinho (valor guardado pela família)"
---

# Tasks: Cofrinho (valor guardado pela família)

**Input**: Design documents from `/specs/007-household-savings/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/update-savings.md, quickstart.md

**Tests**: Não solicitados no spec. O projeto não possui suíte automatizada; a validação é manual via `quickstart.md` + `pnpm lint` / `pnpm build` (`npm run dev` é PROIBIDO pela constituição). Nenhuma task de teste automatizado é gerada.

**Organization**: Tasks agrupadas por user story para permitir implementação e validação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências entre si)
- **[Story]**: User story a que a task pertence (US1, US2)
- Todos os caminhos são relativos à raiz do repositório

## Path Conventions

Aplicação web Next.js 16 (App Router, monólito). Camadas: dados em `data/`, validação em `lib/validation/`, escrita em `actions/`, rotas em `app/(app)/`, UI em `components/<domínio>/`, schema em `prisma/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar o schema e o cliente Prisma para a nova coluna. Bloqueia todas as user stories.

- [X] T001 Ler o guia relevante de Next.js 16 em `node_modules/next/dist/docs/` (Server Actions, `revalidatePath`) e conferir Prisma 7 / zod via Context7 antes de escrever código, conforme AGENTS.md e constituição.
- [X] T002 Adicionar o campo `savingsInCents Int @default(0)` ao modelo `Household` em `prisma/schema.prisma` (ver data-model.md), sem alterar relações existentes.
- [X] T003 Gerar e aplicar a migração aditiva com `pnpm prisma migrate dev --name add_household_savings` e rodar `pnpm prisma generate` para atualizar o Prisma Client.

**Checkpoint**: Coluna `Household.savingsInCents` disponível no banco e no client tipado.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Camada de dados e validação compartilhadas por US1 (escrita) e US2 (leitura). MUST completar antes das user stories.

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [X] T004 [P] Criar `lib/validation/savings.ts` exportando `updateSavingsSchema` (zod): `amount = z.coerce.number({ error: "Valor obrigatório" }).min(0, "O valor não pode ser negativo").multipleOf(0.01, "Valor deve ter no máximo 2 casas decimais")`, seguindo o padrão de `lib/validation/expense.ts` e o contrato em `contracts/update-savings.md`.
- [X] T005 [P] Criar `data/savings.ts` com `getHouseholdSavings(householdId: string): Promise<number>` (retorna `savingsInCents`, 0 por default via `findUnique`) e `setHouseholdSavings(householdId: string, savingsInCents: number): Promise<void>` (`prisma.household.update`), seguindo o padrão de `data/households.ts` e `data/dashboard.ts`. Prisma nunca em componentes.

**Checkpoint**: Funções de dados e schema de validação prontos — US1 e US2 podem começar.

---

## Phase 3: User Story 1 - Registrar e atualizar o valor guardado (Priority: P1) 🎯 MVP

**Goal**: Um membro acessa a opção "Cofrinho" no menu, vê o valor guardado da residência (R$ 0,00 se não cadastrado), informa um valor em reais e salva; o total persiste, é compartilhado por toda a residência e pode ser substituído por edição direta.

**Independent Test**: Acessar "Cofrinho" no menu, informar `150,75`, salvar e confirmar que persiste ao recarregar; alterar para `200,00` e confirmar que o total exibido reflete a substituição; validar que outro membro da mesma residência vê o mesmo valor.

### Implementation for User Story 1

- [X] T006 [US1] Criar a Server Action `actions/update-savings.ts` usando `protectedActionClient` e `.inputSchema(updateSavingsSchema)`: resolve a residência ativa via `getActiveHousehold()`, converte reais→centavos com `amountToCents` (`lib/money.ts`), persiste via `setHouseholdSavings(householdId, savingsInCents)`, chama `revalidatePath("/cofrinho")` e `revalidatePath("/dashboard")`, e retorna `{ savingsInCents }`. A escrita por sobrescrita (`prisma.household.update` em `setHouseholdSavings`) já satisfaz o last-write-wins (FR-013) sem detecção de conflito. Base: `actions/update-household.ts` e `actions/create-expense.ts` (ver `contracts/update-savings.md`).
- [X] T007 [P] [US1] Criar o client component `components/savings/savings-form.tsx` com `react-hook-form` + `@hookform/resolvers/zod` (`updateSavingsSchema`) e o hook `useAction` (next-safe-action) sobre `updateSavings`: campo de valor em reais usando `Field`/`Input`/`Button` do shadcn/ui, valor inicial derivado de `savingsInCents` via `centsToAmount`, exibição de `validationErrors` por campo e toast de sucesso (`sonner`). Sem cores hard-coded; medidas em `rem`; ícone `PiggyBank` (`lucide-react`) quando aplicável.
- [X] T008 [US1] Criar a rota `app/(app)/cofrinho/page.tsx` como Server Component: resolve a residência ativa (`getActiveHousehold`), lê o total com `getHouseholdSavings(householdId)`, formata via `formatCentsAsCurrency` para exibição e renderiza `SavingsForm` dentro de um `Card` do shadcn/ui. Prisma nunca no componente.
- [X] T009 [US1] Adicionar o item de navegação `{ href: "/cofrinho", label: "Cofrinho", icon: PiggyBank }` ao `NAV_ITEMS` em `components/layout/app-sidebar.tsx`, posicionado após "Categorias" (reutiliza o rendering desktop + Sheet mobile; NÃO criar botão de fechar do Sheet).

**Checkpoint**: US1 totalmente funcional e testável de forma independente (menu → tela → cadastrar → atualizar → persistir → compartilhar).

---

## Phase 4: User Story 2 - Acompanhar o total guardado no Dashboard (Priority: P2)

**Goal**: No Dashboard, entre os cards de resumo, aparece um card com o total guardado da residência ativa, formatado em Real, no mesmo padrão visual dos demais — inclusive R$ 0,00 quando não há valor cadastrado (mesmo sem despesas).

**Independent Test**: Cadastrar um valor no cofrinho e abrir o Dashboard, confirmando que um card exibe exatamente esse total formatado em Real, alinhado aos demais cards; verificar que uma residência sem valor exibe R$ 0,00 mesmo sem despesas; atualizar o valor e confirmar que o card reflete o novo total.

### Implementation for User Story 2

- [X] T010 [US2] Editar `app/(app)/dashboard/page.tsx` para ler `getHouseholdSavings(householdId)` (residência ativa) e passar `savingsInCents` à nova prop de `SummaryCards` (ver T011), garantindo que o card do cofrinho seja renderizado mesmo quando `hasExpenses` é falso (FR-011). Prisma nunca no componente.
- [X] T011 [US2] Em `components/dashboard/summary-cards.tsx`, adicionar `savingsInCents: number` à assinatura de props de `SummaryCards` e renderizar o card do cofrinho reutilizando o `SummaryTile` existente com `label="Cofrinho"`, `icon={PiggyBank}` (`lucide-react`), `tone="positive"` (token de tema já existente, sem novo token nem cor hard-coded) e `valueInCents={savingsInCents}` — o `SummaryTile` já formata internamente via `formatCentsAsCurrency`, portanto NÃO passar valor pré-formatado. Ajustar o grid do container de `sm:grid-cols-3` para `sm:grid-cols-2 lg:grid-cols-4`, acomodando o 4º card sem quebra de layout (DRY).

**Checkpoint**: US1 e US2 funcionam de forma independente; alterações na tela do Cofrinho refletem no card do Dashboard na próxima visualização.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Conformidade e validação final entre as stories.

- [X] T012 Rodar `pnpm lint` e corrigir todos os erros de ESLint (sem comentários no código; nomes descritivos; `rem` e tokens de tema).
- [X] T013 Rodar `pnpm build` e garantir build sem erros de tipo/compilação.
- [ ] T014 Executar a validação manual de `specs/007-household-savings/quickstart.md` (cenários US1 1–4, US2 5–7 e edge cases 8–12) e confirmar os critérios de aceite.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — começa imediatamente. T002 → T003 (migração depois do schema).
- **Foundational (Phase 2)**: Depende do Setup (client Prisma com a nova coluna). BLOQUEIA todas as user stories.
- **User Stories (Phase 3+)**: Dependem da fase Foundational. Podem prosseguir em paralelo ou por prioridade (P1 → P2).
- **Polish (Phase 5)**: Depende das user stories desejadas concluídas.

### User Story Dependencies

- **US1 (P1)**: Começa após Foundational. Sem dependências de outras stories. É o MVP.
- **US2 (P2)**: Começa após Foundational. Independentemente testável; na prática exibe valor de forma útil quando US1 permite cadastrá-lo, mas o card em si (R$ 0,00) já funciona só com a fase Foundational.

### Within Each User Story

- US1: T006 (action) e T007 (form) podem ser paralelos; T008 (página) depende de T006 e T007; T009 (nav) é independente.
- US2: T010 (leitura na página) antes de/junto com T011 (render do card); ambos compartilham o dado `savingsInCents`.

### Parallel Opportunities

- **Foundational**: T004 e T005 em paralelo (arquivos diferentes).
- **US1**: T006 e T007 em paralelo; T009 em paralelo com T006–T008.
- **Setup**: T002 → T003 são sequenciais (mesmo domínio: schema → migração).

---

## Parallel Example: Foundational + User Story 1

```bash
# Foundational — rodar juntos (arquivos diferentes):
Task: "Criar lib/validation/savings.ts (updateSavingsSchema)"
Task: "Criar data/savings.ts (getHouseholdSavings, setHouseholdSavings)"

# User Story 1 — action e form em paralelo:
Task: "Criar actions/update-savings.ts (Server Action protegida)"
Task: "Criar components/savings/savings-form.tsx (react-hook-form + useAction)"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Completar Phase 1: Setup (schema + migração).
2. Completar Phase 2: Foundational (validação + dados) — CRÍTICO, bloqueia as stories.
3. Completar Phase 3: User Story 1 (action, form, página, navegação).
4. **PARAR e VALIDAR**: testar US1 de forma independente (quickstart cenários 1–4 e edge cases).
5. Entregar/demonstrar o MVP.

### Incremental Delivery

1. Setup + Foundational → base pronta.
2. US1 → validar → entregar (MVP).
3. US2 → validar → entregar (card no Dashboard).
4. Polish (lint/build/quickstart) → conformidade final.

---

## Notes

- [P] = arquivos diferentes, sem dependências.
- [Story] mapeia a task à user story para rastreabilidade.
- Reutilizar `lib/money.ts` (`amountToCents`, `centsToAmount`, `formatCentsAsCurrency`) — não reimplementar (DRY).
- Segurança: `householdId` resolvido no servidor via `getActiveHousehold()` — nunca vem da entrada (evita IDOR; cobre FR-009 e edge "acesso de não-membro").
- Sem comentários no código; apenas cores de tema; medidas em `rem`; ícones `lucide-react`; shadcn/ui para todos os componentes.
- Commit após cada task ou grupo lógico. `npm run dev` é PROIBIDO — validar por `pnpm lint` / `pnpm build`.
