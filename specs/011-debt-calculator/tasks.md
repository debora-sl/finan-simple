# Tasks: Calculador de Dívidas + card "Total Pagantes" no Dashboard

**Input**: Design documents from `/specs/011-debt-calculator/`

**Prerequisites**: plan.md (required), spec.md (user stories), research.md, data-model.md, contracts/

**Tests**: O projeto não possui suíte automatizada; a validação é manual via `quickstart.md`. Nenhuma task de teste automatizado é gerada.

**Organization**: Tasks agrupadas por user story para permitir implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual user story a task pertence (US1, US2)
- Caminhos de arquivo exatos incluídos em cada descrição

## Path Conventions

Next.js 16 App Router monolito. Caminhos relativos à raiz do repositório: `prisma/`, `lib/`, `data/`, `actions/`, `app/(app)/`, `components/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar o schema de dados para a feature. Nenhuma dependência nova a instalar.

- [X] T001 Adicionar o model `MonthlyPayers` em `prisma/schema.prisma` (campos `id`, `householdId`, `year`, `month`, `payersCount`, `createdAt`, `updatedAt`; relação `household Household @relation(..., onDelete: Cascade)`; `@@unique([householdId, year, month])`; `@@index([householdId])`; `@@map("monthly_payers")`) conforme `data-model.md`
- [X] T002 Adicionar a relação inversa `monthlyPayers MonthlyPayers[]` ao model `Household` em `prisma/schema.prisma`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Migration, client gerado e camada de dados compartilhada — pré-requisito para AMBAS as user stories.

**⚠️ CRITICAL**: Nenhuma user story pode começar até esta fase completar.

- [X] T003 Rodar `pnpm prisma migrate dev --name add_monthly_payers` para gerar a migration em `prisma/migrations/<timestamp>_add_monthly_payers/` e aplicar ao banco (depende de T001, T002)
- [X] T004 Rodar `pnpm prisma generate` para regenerar o Prisma Client com o novo model (depende de T003)
- [X] T005 [P] Criar `data/payers.ts` com `getMonthlyPayers(householdId, year, month): Promise<number | null>` (retorna `payersCount` do registro `(householdId, year, month)` ou `null`) e `setMonthlyPayers(householdId, year, month, payersCount): Promise<void>` (executa `upsert` pela chave única), seguindo o padrão de `data/savings.ts` e a regra "Prisma só em `data/`" (depende de T004)

**Checkpoint**: Model, migration e camada de dados prontos — user stories podem começar.

---

## Phase 3: User Story 1 - Calcular o valor por pagante de um mês (Priority: P1) 🎯 MVP

**Goal**: Página `/debt-calculator` com item de menu próprio onde o usuário escolhe um mês (entre os que têm despesas), vê o total do mês, informa o número de pagantes, obtém o valor por pagante ao vivo e persiste o número via botão "Salvar".

**Independent Test**: Com uma residência com despesas em pelo menos um mês, abrir o Calculador, selecionar o mês, conferir o total, informar 3 pagantes, ver R$ 333,33 por pagante ao vivo e confirmar que "3" permanece salvo ao recarregar a página.

### Implementation for User Story 1

- [X] T006 [P] [US1] Criar o schema `setMonthlyPayersSchema` em `lib/validation/payers.ts` (`year` inteiro 2000–2100, `month` inteiro 1..12, `payersCount` `z.coerce.number().int().min(1)` com mensagens amigáveis) seguindo o padrão de `lib/validation/savings.ts` (FR-004, FR-015)
- [X] T007 [US1] Criar a Server Action `setMonthlyPayers` em `actions/set-monthly-payers.ts` usando `protectedActionClient.inputSchema(setMonthlyPayersSchema)`, resolvendo `householdId` via `getActiveHousehold()` (nunca do cliente), chamando `setMonthlyPayers` de `data/payers.ts`, com `revalidatePath("/debt-calculator")` e `revalidatePath("/dashboard")`, retornando `{ payersCount }` — base `actions/update-savings.ts` (FR-007, FR-008, FR-009; depende de T005, T006)
- [X] T008 [P] [US1] Estender `components/shared/month-selector.tsx` com prop opcional `includeAllOption` (default `true`) para ocultar a opção "Todos os meses" quando `false`, sem alterar o comportamento atual do Dashboard/Despesas (FR-002; reuso da Decisão 3)
- [X] T009 [US1] Criar o componente client `components/debt-calculator/debt-calculator-form.tsx` (react-hook-form + zodResolver com `setMonthlyPayersSchema`, input de pagantes pré-preenchido com o valor salvo, cálculo reativo `valuePerPayerInCents = Math.round(totalInCents / payersCount)` exibido com `formatCentsAsCurrency`, botão "Salvar" via `useAction(setMonthlyPayers)`, estado vazio quando o mês não tem pagantes). O preview reativo SÓ é computado quando `payersCount` é um inteiro válido `>= 1`; para entrada vazia, `0`, negativa ou não inteira, o valor por pagante é ocultado (nunca renderizar `NaN`/`Infinity` — nunca dividir por zero) (FR-004, FR-005, FR-006, FR-010, FR-014, FR-015; Edge Cases "Número de pagantes inválido"/"nunca divide por zero"; depende de T007)
- [X] T010 [US1] Criar a página RSC `app/(app)/debt-calculator/page.tsx` que resolve o mês via `?month=` + `resolveReportPeriod` (`lib/report-period.ts`), obtém o `householdId` da residência ativa via `getActiveHousehold` (nunca de `searchParams`/cliente — escopo de leitura, FR-009), carrega os meses com `getAvailableMonths`, o total via `getDashboardSummary` e os pagantes salvos via `getMonthlyPayers`, renderiza `MonthSelector` com `includeAllOption={false}` e o `DebtCalculatorForm`, e trata o estado vazio de residência sem meses disponíveis (FR-001, FR-002, FR-003, FR-009, FR-014; depende de T005, T008, T009)
- [X] T011 [US1] Adicionar o item de menu "Calculador de Dívidas" (ícone `lucide-react`, ex.: `Calculator`) apontando para `/debt-calculator` em `components/layout/app-sidebar.tsx` (FR-001; depende de T010)

**Checkpoint**: Calculador totalmente funcional e testável de forma independente — MVP entregável.

---

## Phase 4: User Story 2 - Ver o número de pagantes no Dashboard (Priority: P2)

**Goal**: Card "Total Pagantes" no Dashboard exibindo o número inteiro de pagantes salvo para o mês selecionado, com estado vazio "—" quando não houver (ou em "Todos os meses").

**Independent Test**: Com "3 pagantes em Julho" salvo, abrir o Dashboard em Julho e verificar que o card exibe "3"; selecionar um mês sem pagantes (ou "Todos os meses") e verificar o estado vazio "—".

### Implementation for User Story 2

- [X] T012 [US2] Estender `components/dashboard/summary-cards.tsx` para receber `payersCount: number | null` e renderizar o card "Total Pagantes" como contagem inteira (sem símbolo monetário, ícone `lucide-react` ex.: `Users`), reusando a estrutura de tile existente, exibindo "—" quando `null`, sem quebrar os cards monetários (FR-011, FR-012, FR-013, SC-005)
- [X] T013 [US2] Ajustar `app/(app)/dashboard/page.tsx` para carregar os pagantes via `getMonthlyPayers(householdId, period.year, period.month)` com o `householdId` da residência ativa (`getActiveHousehold`, escopo de leitura — FR-009) apenas quando `period.kind === "month"` (passa `null` em "Todos os meses") e repassar `payersCount` ao `SummaryCards` (FR-011, FR-012, FR-009; depende de T005, T012)

**Checkpoint**: Dashboard exibe o card "Total Pagantes"; ambas as user stories funcionam de forma independente.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verificação de qualidade e validação end-to-end.

- [X] T014 Rodar `pnpm lint` e corrigir eventuais erros de ESLint em todos os arquivos criados/alterados (Constituição IV)
- [X] T015 Rodar `pnpm build` para validar a compilação (não usar `npm run dev`) e revisar tokens de tema, medidas em `rem` e ícones `lucide-react` nos componentes novos
- [X] T016 Executar os cenários de `specs/011-debt-calculator/quickstart.md` (cálculo/persistência, atualização, card do Dashboard, validação, estados vazios, autorização) e confirmar os resultados esperados

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — começa imediatamente.
- **Foundational (Phase 2)**: Depende do Setup — BLOQUEIA todas as user stories.
- **User Story 1 (Phase 3)**: Depende do Foundational. Independente da US2.
- **User Story 2 (Phase 4)**: Depende do Foundational. Pode ser desenvolvida em paralelo à US1 (arquivos distintos), mas entrega valor visível só após existir dado salvo pela US1.
- **Polish (Phase 5)**: Depende das user stories desejadas estarem completas.

### User Story Dependencies

- **US1 (P1)**: Só precisa do Foundational (T005). Nenhuma dependência da US2.
- **US2 (P2)**: Só precisa do Foundational (T005, `getMonthlyPayers`). Testável de forma independente desde que exista um registro salvo.

### Within Each User Story

- US1: schema/action (T006→T007) e month-selector (T008) antes do form (T009); form antes da página (T010); página antes do item de menu (T011).
- US2: card (T012) antes da fiação da página (T013).

### Parallel Opportunities

- **Foundational**: T005 é `[P]` mas depende de T004 (client gerado); T001/T002 no mesmo arquivo (sequenciais).
- **US1**: T006 (validation) e T008 (month-selector) são `[P]` — arquivos distintos, podem rodar juntos.
- **Cross-story**: Após o Foundational, US1 e US2 podem ser tocadas em paralelo por pessoas diferentes (T012 não colide com arquivos da US1).

---

## Parallel Example: User Story 1

```bash
# Após o Foundational (T005), iniciar em paralelo:
Task: "T006 [US1] Criar setMonthlyPayersSchema em lib/validation/payers.ts"
Task: "T008 [US1] Estender components/shared/month-selector.tsx com includeAllOption"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Completar Phase 1: Setup (schema).
2. Completar Phase 2: Foundational (migration + data layer) — CRÍTICO, bloqueia tudo.
3. Completar Phase 3: User Story 1 (Calculador).
4. **PARAR e VALIDAR**: testar o Calculador de forma independente (quickstart Cenários 1, 2, 4, 5).
5. Entregar/demonstrar como MVP.

### Incremental Delivery

1. Setup + Foundational → base pronta.
2. US1 → testar → entregar (MVP: já resolve dividir a conta do mês).
3. US2 → testar → entregar (card do Dashboard lê o dado salvo pela US1).
4. Polish → lint, build e validação end-to-end via quickstart.

---

## Notes

- `[P]` = arquivos diferentes, sem dependências entre si.
- Rótulo `[Story]` mapeia a task para rastreabilidade da user story.
- Sem tasks de teste automatizado (projeto sem suíte); validação manual via `quickstart.md`.
- Prisma somente em `data/`; Server Actions somente via `next-safe-action` com `protectedActionClient` e `.inputSchema`.
- Sem comentários no código; ESLint sem erros; cores via tokens de `app/globals.css`; medidas em `rem`; ícones `lucide-react`.
- Commit após cada task ou grupo lógico.
