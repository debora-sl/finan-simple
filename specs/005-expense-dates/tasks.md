---
description: "Task list — Datas de Vencimento e Pagamento em Despesas"
---

# Tasks: Datas de Vencimento e Pagamento em Despesas

**Input**: Design documents from `/specs/005-expense-dates/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Não há tarefas de teste automatizado — o projeto valida manualmente via `quickstart.md` e usa `pnpm lint` como portão obrigatório (ver plan.md).

**Organization**: Tarefas agrupadas por user story para permitir implementação e validação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências pendentes)
- **[Story]**: User story a que a tarefa pertence (US1, US2, US3)
- Todo caminho de arquivo é relativo à raiz do repositório

## Path Conventions

Web app single-project Next.js (App Router). Código na raiz: `prisma/`, `lib/`, `data/`, `actions/`, `components/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar documentação de versão e componentes compartilhados antes de codar.

- [X] T001 [P] Consultar via Context7 a documentação do Prisma 7 (`@db.Date`, `prisma migrate dev --create-only`) e do Next.js 16 (ler guias em `node_modules/next/dist/docs/`), registrando a sintaxe correta antes de tocar em código (Princípio V)
- [X] T002 Adicionar o componente Checkbox do shadcn/ui via `pnpm dlx shadcn@latest add checkbox`, gerando `components/ui/checkbox.tsx` (usado por "Sem data de vencimento" — ver research.md §7). O `Switch` (status pago) já está presente em `components/ui/switch.tsx` e é apenas reutilizado — não precisa ser instalado

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Schema, migração de dados, utilitário de datas e validação — pré-requisitos de TODAS as stories.

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase concluir.

- [X] T003 Atualizar o `model Expense` em `prisma/schema.prisma`: renomear `date`→`dueDate` como `DateTime? @db.Date`, adicionar `paidDate DateTime? @db.Date`, remover `isPaid`, e trocar `@@index([householdId, date])` por `@@index([householdId, dueDate])` (ver data-model.md)
- [X] T004 Gerar a migração com `pnpm prisma migrate dev --create-only --name expense_dates`, editar o SQL à mão para preservar dados legados (`RENAME COLUMN "date" TO "dueDate"`; `ALTER COLUMN "dueDate" TYPE date USING "dueDate"::date`; `DROP NOT NULL`; `ADD COLUMN "paidDate" date`; `DROP COLUMN "isPaid"`; recriar índice), aplicar com `pnpm prisma migrate dev` e regenerar o client — em `prisma/migrations/<timestamp>_expense_dates/` (ver research.md §5). **Antes de aplicar**, confirmar que a coluna legada é `timestamp` *without time zone* (ex.: `\d expense` no psql): se for `timestamptz`, trocar o cast por `USING ("dueDate" AT TIME ZONE 'UTC')::date`; após aplicar, validar em dados reais que o dia exibido corresponde ao pretendido (FR-008/SC-002), evitando reintroduzir o deslocamento de −1 dia nos registros legados (depende de T003)
- [X] T005 [P] Criar `lib/date.ts` com `parseCalendarDate(input: string): Date` (`"YYYY-MM-DD"`→meia-noite UTC), `formatCalendarDate(date: Date): string` (pt-BR curto, `timeZone: "UTC"`) e `toDateInputValue(date: Date): string` (`Date`→`"YYYY-MM-DD"` em UTC) — ponto único de conversão de datas (ver contracts/expense-schema.md)
- [X] T006 [P] Reescrever `lib/validation/expense.ts`: `dueDate` como string `"YYYY-MM-DD"` (`regex`) **opcional**, `hasNoDueDate` boolean (default `false`), `paidDate` string `"YYYY-MM-DD"` opcional/nullable, `clientToday` (`/^\d{4}-\d{2}-\d{2}$/`) **opcional**, `superRefine` com RN-1 (FR-003), RN-2 (FR-009, compara `paidDate` com `clientToday`) e RN-4 (FR-009, exige `clientToday` quando `paidDate` presente, impedindo que a checagem de data futura seja contornada), e estender `toggleExpensePaidSchema` com `clientToday`; atualizar `createExpenseSchema`/`updateExpenseSchema`. NÃO usar `z.coerce.date()` — a conversão para `Date` ocorre na action via `parseCalendarDate` (ver contracts/expense-schema.md)

**Checkpoint**: Fundação pronta — as user stories podem começar.

---

## Phase 3: User Story 1 - Registrar despesa com data de vencimento ou "Sem data de vencimento" (Priority: P1) 🎯 MVP

**Goal**: Permitir informar a Data de Vencimento no cadastro/edição, ou marcar "Sem data de vencimento", com a listagem distinguindo e ordenando as despesas sem vencimento ao final.

**Independent Test**: Cadastrar uma despesa com vencimento e confirmar que aparece na listagem com essa data; cadastrar outra marcando "Sem data de vencimento" e confirmar que é salva sem data, rotulada "Sem vencimento" e posicionada ao final da lista.

### Implementation for User Story 1

- [X] T007 [P] [US1] Em `actions/create-expense.ts`, gravar `dueDate` a partir do input validado (`null` quando `hasNoDueDate === true`, senão via `parseCalendarDate`), mantendo `protectedActionClient`, `.inputSchema`, `getActiveHousehold()` e `revalidatePath` (ver contracts/expense-actions.md)
- [X] T008 [P] [US1] Em `actions/update-expense.ts`, atualizar `dueDate` conforme input, incluindo limpar para `null` quando `hasNoDueDate`, verificando a despesa da residência ativa (FR-010)
- [X] T009 [P] [US1] Em `data/expenses.ts`, alterar `getExpenses` para `orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }]` — vencimento mais próximo primeiro; despesas sem vencimento ao final (FR-004)
- [X] T010 [P] [US1] Em `components/expenses/expense-form.tsx`, adicionar o campo Vencimento reutilizando o componente `Input` do shadcn (`<Input type="date">`, como o já usado no formulário) e o Checkbox "Sem data de vencimento" que desabilita/limpa o campo e o dispensa da validação; exibir erros via `FieldError`
- [X] T011 [P] [US1] Em `components/expenses/expense-table.tsx`, adicionar a coluna Vencimento exibindo o rótulo "Sem vencimento" quando `dueDate` for `null` (FR-004)

**Checkpoint**: US1 funcional e testável de forma independente.

---

## Phase 4: User Story 2 - Data exibida exatamente como informada (correção do bug de um dia antes) (Priority: P1)

**Goal**: Garantir que toda data de despesa seja exibida e pré-preenchida exatamente como informada, sem deslocamento de dia, em qualquer fuso — corrigindo o bug atual e prevenindo regressão nos novos campos.

**Independent Test**: Cadastrar `20/08/2026` e confirmar que a listagem e a edição mostram `20/08/2026` (não `19/08`) com o fuso do dispositivo em UTC−3 e em um fuso positivo; abrir uma despesa legada e confirmar que a data corresponde ao dia pretendido.

### Implementation for User Story 2

- [X] T012 [P] [US2] Em `components/expenses/expense-form.tsx`, rotear todas as conversões de data por `lib/date.ts` — `parseCalendarDate` no envio e `toDateInputValue` no pré-preenchimento da edição — removendo qualquer `new Date(value)`/`toISOString().slice(...)` direto (FR-007) (depende de T010)
- [X] T013 [P] [US2] Em `components/expenses/expense-table.tsx`, exibir toda data via `formatCalendarDate` (`timeZone: "UTC"`), substituindo o `Intl.DateTimeFormat` sem `timeZone` que causa o deslocamento na listagem — corrige despesas novas e legadas (FR-007, FR-008, SC-002) (depende de T011)

**Checkpoint**: US1 e US2 funcionam de forma independente; datas exibidas sem deslocamento.

---

## Phase 5: User Story 3 - Registrar a data de pagamento da despesa (Priority: P2)

**Goal**: Permitir informar/limpar a Data do Pagamento, derivando o estado Paga/Pendente da presença de `paidDate`, com validação de data não futura (dia local do usuário).

**Independent Test**: Informar a data de pagamento em uma despesa e confirmar que ela passa a "Paga" e exibe a data sem deslocamento; remover a data e confirmar volta a "Pendente"; tentar salvar uma data futura e confirmar rejeição com mensagem.

### Implementation for User Story 3

- [X] T014 [US3] Em `actions/create-expense.ts`, gravar `paidDate` a partir do input validado (`null` quando ausente, senão via `parseCalendarDate`) (depende de T007)
- [X] T015 [US3] Em `actions/update-expense.ts`, atualizar `paidDate` conforme input, incluindo limpar para `null` (FR-005, FR-006) (depende de T008)
- [X] T016 [P] [US3] Em `actions/toggle-expense-paid.ts`, mapear `isPaid` para `paidDate = clientToday` (marcar paga) ou `null` (marcar pendente), consumindo `clientToday` do input e mantendo a checagem de residência (ver contracts/expense-actions.md)
- [X] T017 [P] [US3] Em `data/dashboard.ts`, trocar o filtro de pagos de `isPaid: true` para `paidDate: { not: null }` (research.md §6). Nota: o dashboard apenas agrega somas (`amountInCents`) e **não exibe nenhuma data** de despesa, portanto não há formatação de data a rotear por `lib/date.ts` aqui — FR-007/FR-008 não se aplicam a este arquivo
- [X] T018 [US3] Em `components/expenses/expense-form.tsx`, adicionar o campo opcional Pagamento reutilizando o componente `Input` do shadcn (`<Input type="date">`) e enviar `clientToday` (dia local do navegador, `"YYYY-MM-DD"`) no input para a validação RN-2 (depende de T012)
- [X] T019 [US3] Em `components/expenses/expense-table.tsx`, remover o campo `isPaid: boolean` do tipo/props da linha e substituir todos os usos remanescentes (`checked`, `Badge variant`, `aria-label`) por `paidDate != null`; derivar o status Paga/Pendente de `paidDate`, exibir `paidDate` quando presente e fazer o `Switch` de status disparar `toggleExpensePaid` enviando `clientToday` (depende de T013)

**Checkpoint**: Todas as user stories funcionam de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Portão de qualidade e validação manual.

- [X] T020 Rodar `pnpm lint` e corrigir todos os erros de ESLint (portão obrigatório). Confirmar via busca (`grep -rn "isPaid" --exclude-dir=specs --exclude-dir=prisma/migrations`) que não restam referências a `isPaid` no código de runtime, exceto o campo de entrada de `toggleExpensePaidSchema`/`toggle-expense-paid.ts` (que continua recebendo `isPaid` no input e o mapeia para `paidDate`)
- [ ] T021 Executar a validação manual de `specs/005-expense-dates/quickstart.md` (US1, US2, US3, edge cases, usabilidade/SC-005 e testes de fuso horário)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente.
- **Foundational (Phase 2)**: Depende do Setup — BLOQUEIA todas as user stories.
- **User Stories (Phase 3–5)**: Todas dependem da Fase 2. US2 estende os arquivos de formulário/tabela criados na US1; US3 estende os arquivos de action/formulário/tabela das US1/US2.
- **Polish (Phase 6)**: Depende das stories desejadas concluídas.

### User Story Dependencies

- **US1 (P1)**: Começa após a Fase 2 — sem dependências de outras stories.
- **US2 (P1)**: Após a Fase 2; T012/T013 tocam os mesmos arquivos de US1 (`expense-form.tsx`, `expense-table.tsx`) e dependem de T010/T011.
- **US3 (P2)**: Após a Fase 2; tarefas de action/UI estendem arquivos de US1/US2 (T014→T007, T015→T008, T018→T012, T019→T013). T016 e T017 são independentes.

### Within Each User Story

- Actions e camada de dados antes de validar a UI ponta a ponta.
- Story completa antes de passar para a próxima prioridade.

### Parallel Opportunities

- Setup: T001 em paralelo.
- Foundational: T005 e T006 em paralelo (T003→T004 sequencial).
- US1: T007, T008, T009, T010, T011 são todos arquivos diferentes → paralelizáveis.
- US2: T012 e T013 são arquivos diferentes → paralelizáveis entre si (mas dependem de US1).
- US3: T016 e T017 são arquivos diferentes e independentes → paralelizáveis.

---

## Parallel Example: User Story 1

```bash
# Após a Fase 2, lançar as tarefas de US1 (arquivos distintos) juntas:
Task: "actions/create-expense.ts: gravar dueDate (null se hasNoDueDate)"
Task: "actions/update-expense.ts: atualizar dueDate incl. null"
Task: "data/expenses.ts: orderBy dueDate nulls last"
Task: "expense-form.tsx: campo Vencimento + Checkbox 'Sem data de vencimento'"
Task: "expense-table.tsx: coluna Vencimento com rótulo 'Sem vencimento'"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Fase 1: Setup.
2. Fase 2: Foundational (schema, migração, `lib/date.ts`, validação).
3. Fase 3: US1 (vencimento + "Sem data de vencimento").
4. **PARAR e VALIDAR**: testar US1 pelo quickstart.
5. Demo/deploy se pronto.

### Incremental Delivery

1. Setup + Foundational → fundação pronta.
2. US1 → validar → demo (MVP).
3. US2 → validar (datas exatas, legadas) → demo.
4. US3 → validar (pagamento/estado) → demo.

---

## Notes

- [P] = arquivos diferentes, sem dependências pendentes.
- Regra de ouro: nenhuma conversão de data de despesa fora de `lib/date.ts` (FR-007).
- `dueDate`/`paidDate` trafegam como string `"YYYY-MM-DD"`; a conversão para `Date` é feita na action com `parseCalendarDate` (nunca `z.coerce.date()`).
- `clientToday` é opcional e só é enviado pelo formulário quando há data de pagamento (US3); US1/US2 permanecem entregáveis sem ele.
- `hasNoDueDate = true` ⇒ a action grava `dueDate: null` e descarta valor enviado.
- Migração editada à mão para preservar dados legados — não deixar o Prisma fazer drop+add da coluna.
- Sem componentes do zero: usar Checkbox/Switch e Table do shadcn/ui.
- Commitar após cada tarefa ou grupo lógico; validar cada story de forma independente.
