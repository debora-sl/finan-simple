# Research: Calculador de Dívidas + card "Total Pagantes"

A spec não contém marcadores `NEEDS CLARIFICATION` — as ambiguidades foram resolvidas na seção
**Assumptions** do `spec.md`. Este documento registra as decisões técnicas de reuso e padrão que
guiam a Fase 1.

## Decisão 1 — Persistência dos pagantes por mês

- **Decisão**: Novo model Prisma `MonthlyPayers` com `householdId`, `year`, `month`, `payersCount`,
  `@@unique([householdId, year, month])` e `onDelete: Cascade` a partir de `Household`.
- **Rationale**: A spec exige no máximo um número por combinação residência+mês (FR-007), upsert ao
  gravar (FR-008) e remoção em cascata (Key Entities / Assumptions). Guardar `year`+`month` como
  inteiros espelha exatamente como `getAvailableMonths` e `ReportPeriod` já representam meses,
  evitando conversões de fuso na persistência. O índice único habilita `upsert` atômico.
- **Alternativas consideradas**:
  - *Campo em `Household`* (como `savingsInCents`): rejeitado — pagantes é por mês, não um valor
    único da residência.
  - *Guardar um `DateTime` do primeiro dia do mês*: rejeitado — introduz risco de fuso; `year/month`
    inteiros são mais simples e alinham com o padrão existente.
  - *Coluna em `Expense`*: rejeitado — pagante é um conceito do mês inteiro, não de uma despesa.

## Decisão 2 — Total do mês (reuso da regra da spec 010)

- **Decisão**: Reusar `getDashboardSummary(householdId, period)` de `data/dashboard.ts` para obter o
  `totalInCents` do mês selecionado no Calculador.
- **Rationale**: FR-003 exige a **mesma** regra de recorte por `dueDate` do Dashboard. A função já
  aplica `{ dueDate: { gte, lt } }` a partir de um `ReportPeriod`. Reuso garante SC-002/coerência e
  cumpre DRY (Princípio IV).
- **Alternativas consideradas**: *Nova query de agregação em `data/payers.ts`*: rejeitado —
  duplicaria a lógica de recorte por mês e arriscaria divergência de regra.

## Decisão 3 — Seleção de mês no Calculador

- **Decisão**: Reusar o padrão de `?month=` na URL + `resolveReportPeriod`, e estender
  `MonthSelector` com uma prop opcional (ex.: `includeAllOption`, default `true`) para **ocultar**
  "Todos os meses" no Calculador.
- **Rationale**: Pagantes é um conceito por mês específico (não há "Todos os meses" — Assumptions).
  Estender o componente existente respeita a regra de não criar componentes do zero (Princípio I) e
  DRY, em vez de duplicar um seletor.
- **Alternativas consideradas**:
  - *Novo componente `DebtMonthSelector`*: rejeitado — duplicaria lógica de router/searchParams.
  - *Estado local (sem URL)*: rejeitado — perde consistência com o Dashboard e o `?month=`
    compartilhável, e complica pré-carregar total/pagantes no servidor.

## Decisão 4 — Cálculo e arredondamento do valor por pagante

- **Decisão**: `valuePerPayerInCents = Math.round(totalInCents / payersCount)` (centavos inteiros),
  exibido com `formatCentsAsCurrency`. Cálculo reativo no cliente conforme o usuário digita; total do
  mês vem do servidor.
- **Rationale**: FR-005/FR-006 pedem divisão do total pelo número de pagantes arredondada ao centavo
  mais próximo, exibindo apenas esse valor único, sem acerto de sobra. Operar em centavos inteiros
  evita erros de ponto flutuante. `N = 1` ⇒ valor = total (SC-002). Total `0` ⇒ `0` para qualquer N.
- **Alternativas consideradas**: *`Math.floor`/`ceil`*: rejeitado — a spec pede "centavo mais
  próximo". *Distribuir resto entre pagantes*: explicitamente fora de escopo (FR-006).

## Decisão 5 — Validação da entrada de pagantes

- **Decisão**: Schema zod `setMonthlyPayersSchema` com `year`/`month` inteiros válidos e
  `payersCount` inteiro `>= 1`; mesma validação no cliente (react-hook-form + zodResolver) e no
  servidor (`.inputSchema` da action).
- **Rationale**: FR-004/FR-015 e SC-004 exigem rejeitar valores < 1, zero, vazio ou não inteiros com
  mensagem amigável e sem calcular. Compartilhar o schema cliente/servidor cumpre DRY e garante
  paridade de validação. Padrão idêntico ao de `lib/validation/savings.ts`.
- **Alternativas consideradas**: *Validar só no cliente*: rejeitado — viola Princípio III (validação
  no servidor obrigatória). *Aceitar limite superior*: sem limite de negócio nesta spec (Assumptions).

## Decisão 6 — Card "Total Pagantes" no Dashboard

- **Decisão**: Estender `SummaryCards` para receber `payersCount: number | null` e renderizar um card
  de **contagem** (sem símbolo monetário) reusando a estrutura de `SummaryTile`; estado vazio "—"
  quando `null`. O Dashboard carrega o valor via `getMonthlyPayers` conforme o `period` selecionado.
- **Rationale**: FR-011..FR-013 e SC-005. Reusa o layout de cards (Princípio I), mantém os cards
  monetários intactos e trata o modo "Todos os meses"/mês sem dado como estado vazio (Assumptions).
- **Alternativas consideradas**: *Card totalmente novo fora do grid*: rejeitado — quebraria a
  consistência visual do grid de resumo; estender é mais DRY.

## Notas de stack (a validar via Context7/MCP durante a implementação)

- **Prisma 7**: confirmar sintaxe de `upsert` e da migration; gerar client após alterar schema
  (`prisma generate` roda em `postinstall`/`build`).
- **Next.js 16**: `searchParams` é `Promise` (já usado no Dashboard); ler guia relevante em
  `node_modules/next/dist/docs/` antes de código novo de roteamento (AGENTS.md).
- **next-safe-action 8**: usar `protectedActionClient.inputSchema(...).action(...)` e `useAction`.
