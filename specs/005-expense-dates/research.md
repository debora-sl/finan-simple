# Phase 0 — Research: Datas de Vencimento e Pagamento em Despesas

## 1. Causa-raiz do bug de deslocamento de um dia

**Decisão**: Tratar datas de despesa como datas de calendário puras (dia, sem horário/fuso), interpretando e formatando sempre em UTC.

**Diagnóstico da cadeia atual**:

1. O formulário usa o `Input` do shadcn com `type="date"` (`<Input type="date">`) → string `"2026-08-20"`.
2. `expense-form.tsx` converte com `new Date(values.date)`. Para uma string ISO date-only, o JS interpreta como **meia-noite UTC** → `2026-08-20T00:00:00.000Z`.
3. Prisma (`DateTime` → `timestamp` no Postgres) persiste o instante em UTC: `2026-08-20 00:00:00`.
4. `expense-table.tsx` exibe com `new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" })` **sem `timeZone`**, usando o fuso local do navegador. Em UTC−3, `2026-08-20T00:00Z` vira `2026-08-19 21:00` local → renderiza **19/08/2026**. Este é o bug.
5. O formulário de edição usa `toISOString().slice(0,10)` (UTC), então o campo de edição já mostra o dia certo — o defeito está apenas na **exibição da listagem**, mas a solução deve ser consistente em todas as pontas para não reintroduzir o problema no novo `paidDate`.

**Rationale**: A granularidade da feature é de dia (Assumptions do spec). Ao remover o fuso da equação — armazenando `date` no Postgres e sempre lendo/escrevendo em UTC — a data exibida passa a ser idêntica à informada, em qualquer fuso (FR-007, SC-001).

**Alternativas consideradas**:
- *Armazenar a data como string `"YYYY-MM-DD"`*: elimina o fuso, mas perde ordenação/consulta nativa por data e tipagem `Date` no Prisma. Rejeitada.
- *Manter `timestamp` e apenas formatar com `timeZone: "UTC"`*: corrige a exibição, mas mantém a semântica de instante e depende de todos os pontos lembrarem do fuso. Menos robusta que `@db.Date`. Rejeitada como solução principal (o util cobre a formatação, mas o tipo de coluna reforça a intenção).
- *Normalizar para meio-dia UTC*: mascara o problema sem resolvê-lo. Rejeitada.

## 2. Tipo de coluna e utilitário de datas

**Decisão**: Usar Prisma `@db.Date` (tipo `date` do Postgres) para `dueDate` e `paidDate`, e centralizar conversões em `lib/date.ts`:

- `parseCalendarDate(input: string): Date` — `"YYYY-MM-DD"` → `Date` em meia-noite UTC (`new Date(\`${input}T00:00:00.000Z\`)`).
- `formatCalendarDate(date: Date): string` — formata em pt-BR curto com `timeZone: "UTC"`.
- `toDateInputValue(date: Date): string` — `Date` → `"YYYY-MM-DD"` (fatia UTC) para preencher o `Input` do shadcn (`<Input type="date">`) na edição.

**Rationale**: Um único ponto de verdade para conversão (DRY, Princípio IV) impede que a correção regrida em campos futuros. Com `@db.Date`, o Postgres guarda apenas o dia; o Prisma devolve `Date` à meia-noite UTC, que `formatCalendarDate` exibe sem deslocamento.

**Alternativas consideradas**: Bibliotecas como `date-fns-tz`/`dayjs` — desnecessárias para granularidade de dia e adicionariam dependência que duplica responsabilidade (Restrições de Stack). Rejeitadas. Confirmar a sintaxe de `@db.Date` e de `prisma migrate` da versão 7 via Context7 antes de implementar (Princípio V).

## 3. Estado "pago" derivado de `paidDate`

**Decisão**: Remover a coluna `isPaid`. O estado "pago" passa a ser `paidDate != null` (FR-006). A action `toggle-expense-paid` define `paidDate = hoje (calendário local do usuário)` ao marcar como paga e `null` ao desmarcar. Como o servidor não conhece o fuso do cliente, o "hoje local" trafega como `clientToday` (`"YYYY-MM-DD"` capturado no navegador) no input da action (ver §4 e `contracts/expense-schema.md`).

**Rationale**: Clarificação de 2026-08-11 — "A Data do Pagamento controla o estado; não há marcador manual separado." Um único campo evita estados inconsistentes (pago sem data / data sem pago).

**Alternativas consideradas**: Manter `isPaid` derivado/sincronizado com `paidDate` — duplicação de estado, fonte de bugs. Rejeitada.

## 4. Validação (zod) das regras de data

**Decisão**: Estender `expenseSchema` com:
- `dueDate`: `z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()` — convertida para `Date` na action via `parseCalendarDate` (mantém toda conversão em `lib/date.ts`).
- `hasNoDueDate`: `z.boolean()` (default `false`) — flag explícita de "Sem data de vencimento".
- `paidDate`: `z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable()` — convertida via `parseCalendarDate` na action.
- `clientToday`: `z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()` — data de calendário local do usuário, capturada no navegador, enviada apenas quando há `paidDate` (US3); usada como referência de "hoje" na validação de `paidDate`.
- `superRefine`: (a) se `!hasNoDueDate && !dueDate` → erro no campo `dueDate` orientando informar a data ou marcar "Sem data de vencimento" (FR-003); (b) se `paidDate` e `clientToday` presentes e `paidDate > clientToday` (comparação lexicográfica de `"YYYY-MM-DD"`) → erro "A data de pagamento não pode ser futura" (FR-009).
- Quando `hasNoDueDate` for `true`, a action ignora/descarta `dueDate` e grava `null` (FR-002, edge case de alternância).

**Rationale**: A flag explícita distingue "usuário esqueceu de preencher" (bloquear) de "usuário marcou sem vencimento" (permitir null) — impossível inferir só pela ausência do valor. Datas de pagamento passadas/futuras em relação ao vencimento são permitidas (edge cases); só o futuro real é bloqueado. O "hoje" da validação é o **dia de calendário local do usuário** (não o UTC do servidor): comparar contra o UTC do servidor rejeitaria, perto da virada do dia, uma data que o usuário legitimamente vê como hoje — o que contraria o próprio propósito da feature (FR-007). Por isso a referência vem do cliente via `clientToday` (opcional, enviado apenas junto de `paidDate` em US3), mantendo a validação determinística no servidor (clarificação 2026-08-11).

**Alternativas consideradas**: Representar "sem vencimento" apenas por `dueDate === null` sem flag — impede diferenciar do campo vazio por engano. Rejeitada.

## 5. Migração de dados (legado)

**Decisão**: Migração escrita à mão (gerar com `prisma migrate dev --create-only` e editar) para **preservar dados**:
1. `ALTER TABLE "expense" RENAME COLUMN "date" TO "dueDate";`
2. Converter o tipo para `date` preservando o dia pretendido: `ALTER COLUMN "dueDate" TYPE date USING "dueDate"::date` e `ALTER COLUMN "dueDate" DROP NOT NULL;`
3. `ADD COLUMN "paidDate" date;` (todas as legadas ficam sem data de pagamento — clarificação 2026-08-11).
4. `DROP COLUMN "isPaid";`
5. Recriar índice `@@index([householdId, date])` como `@@index([householdId, dueDate])`.

**Rationale**: A coluna Prisma `DateTime` é `timestamp without time zone` guardando o horário de parede em UTC (ex.: `2026-08-20 00:00:00`); `::date` sobre esse valor é independente de fuso e retorna `2026-08-20`, exatamente o dia pretendido — satisfazendo FR-008/SC-002. Deixar o Prisma gerar automaticamente faria drop+add da coluna e perderia os dados; por isso a migração é editada manualmente.

**Consequência aceita**: Despesas legadas marcadas como pagas perdem esse estado (não recebem `paidDate`), conforme a clarificação explícita. Documentado em `data-model.md`.

**Alternativas consideradas**: `USING ("date" AT TIME ZONE 'UTC')::date` — necessário apenas se a coluna fosse `timestamptz`; como o default do Prisma é `timestamp` sem fuso, o cast direto basta. Verificar o tipo real da coluna na migração inicial antes de aplicar.

## 6. Impacto no dashboard (mínimo, dentro do escopo permitido)

**Decisão**: Em `data/dashboard.ts`, trocar o filtro do agregado de pagos de `isPaid: true` para `paidDate: { not: null }`.

**Rationale**: A remoção de `isPaid` obriga a atualizar a única consulta que o referenciava; é o mínimo necessário para manter a UI coerente (Assumptions permitem "o necessário"). Nenhuma outra mudança de dashboard/relatórios entra nesta feature.

## 7. Componente para "Sem data de vencimento"

**Decisão**: Preferir o **Checkbox do shadcn/ui** (adicionar via `pnpm dlx shadcn@latest add checkbox`), semanticamente adequado para a opção. Fallback: o **`Switch`** já instalado em `components/ui/switch.tsx`, evitando nova dependência.

**Rationale**: Ambos são shadcn/ui (Princípio I). O Checkbox comunica melhor uma opção booleana em formulário; a decisão final de adicionar o componente fica para a fase de tarefas/implementação, mas nenhum componente será criado do zero.

**Alternativas consideradas**: Componente custom — proibido pela Constituição quando há equivalente shadcn. Rejeitada.
