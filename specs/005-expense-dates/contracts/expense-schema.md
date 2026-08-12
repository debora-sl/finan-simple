# Contract — Validação de Despesa (`lib/validation/expense.ts`)

Define o contrato de entrada validado por zod, consumido pelas Server Actions. `dueDate`/`paidDate` trafegam como string `"YYYY-MM-DD"` (validada por regex) e são convertidas para `Date` na action via `parseCalendarDate` (`lib/date.ts`). Ver regras em [data-model.md](../data-model.md).

## Campos

| Campo | Tipo zod | Obrigatório | Regra |
|-------|----------|-------------|-------|
| `description` | `string` (trim, 1–200) | Sim | inalterado |
| `amount` | `number` positivo, `multipleOf(0.01)` | Sim | inalterado |
| `dueDate` | `string` `/^\d{4}-\d{2}-\d{2}$/` | Condicional | exigido quando `hasNoDueDate === false`; convertido via `parseCalendarDate` na action |
| `hasNoDueDate` | `boolean` (default `false`) | Não | `true` ⇒ `dueDate` gravada como `null` |
| `paidDate` | `string` `/^\d{4}-\d{2}-\d{2}$/` opcional/nullable | Não | se presente, **≤ `clientToday`**; convertido via `parseCalendarDate` na action |
| `clientToday` | `string` `/^\d{4}-\d{2}-\d{2}$/` opcional | Condicional | dia local do usuário (capturado no navegador); referência de "hoje" para RN-2. **Obrigatório quando `paidDate` presente** (RN-4); o formulário o envia sempre que há `paidDate` (US3) |
| `categoryId` | `string` (trim, min 1) opcional | Não | inalterado |

## Refinements (regras de negócio)

- **RN-1 (FR-003)**: `!hasNoDueDate && !dueDate` → issue em `dueDate`: *"Informe a data de vencimento ou marque 'Sem data de vencimento'."*
- **RN-2 (FR-009)**: `paidDate` e `clientToday` presentes e `paidDate > clientToday` (comparação lexicográfica de `"YYYY-MM-DD"` — dia de calendário local do usuário, **não** UTC do servidor) → issue em `paidDate`: *"A data de pagamento não pode ser futura."*
- **RN-3 (FR-002)**: `hasNoDueDate === true` → a action grava `dueDate: null` (ignora qualquer valor enviado).
- **RN-4 (FR-009)**: `paidDate` presente e `clientToday` ausente → issue em `paidDate`: *"Não foi possível validar a data de pagamento; recarregue a página e tente novamente."* Garante que a checagem de data futura (RN-2) não seja contornável ao omitir `clientToday`, cumprindo o MUST do FR-009 no servidor.

## Schemas exportados

- `expenseSchema` — objeto base com os campos acima + refinements.
- `createExpenseSchema = expenseSchema`.
- `updateExpenseSchema = expenseSchema.extend({ id: z.string().min(1) })`.
- `deleteExpenseSchema = z.object({ id: z.string().min(1) })` — inalterado.
- `toggleExpensePaidSchema = z.object({ id: z.string().min(1), isPaid: z.boolean(), clientToday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) })` — a action mapeia `isPaid` para `paidDate = clientToday | null`, gravando a data de pagamento no dia de calendário local do usuário.

## Utilitário de datas (`lib/date.ts`)

| Função | Assinatura | Uso |
|--------|-----------|-----|
| `parseCalendarDate` | `(input: string) => Date` | `"YYYY-MM-DD"` → `Date` meia-noite UTC (form → action) |
| `formatCalendarDate` | `(date: Date) => string` | exibição pt-BR curta em `timeZone: "UTC"` (tabela) |
| `toDateInputValue` | `(date: Date) => string` | `Date` → `"YYYY-MM-DD"` (UTC) para o `Input` do shadcn (`<Input type="date">`) na edição |

> Regra de ouro: nenhuma conversão de data de despesa fora de `lib/date.ts`. Isso garante FR-007 e impede regressão do deslocamento nos campos `dueDate` e `paidDate`.
