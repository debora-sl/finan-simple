# Contract — Server Actions de Despesa

Todas usam `protectedActionClient` (`lib/action-client.ts`), `.inputSchema(...)`, resolvem a residência ativa com `getActiveHousehold()` e restringem operações por `householdId` (FR-010). Chamadas no cliente via `useAction`.

## `createExpense` (`actions/create-expense.ts`)

- **Input**: `createExpenseSchema`.
- **Efeito**: cria `expense` com `dueDate` (ou `null` se `hasNoDueDate`), `paidDate` (ou `null`), demais campos como hoje.
- **Autorização**: valida `categoryId` pertencente à residência quando informado.
- **Pós**: `revalidatePath("/expenses")` e `revalidatePath("/dashboard")`.

## `updateExpense` (`actions/update-expense.ts`)

- **Input**: `updateExpenseSchema` (inclui `id`).
- **Efeito**: verifica despesa da residência; atualiza `dueDate`/`paidDate` conforme input (incluindo limpar para `null`).
- **Pós**: `revalidatePath("/expenses")` e `revalidatePath("/dashboard")`.

## `toggleExpensePaid` (`actions/toggle-expense-paid.ts`)

- **Input**: `toggleExpensePaidSchema` (`{ id, isPaid, clientToday }`).
- **Efeito**: `isPaid === true` → `paidDate = clientToday` (dia de calendário local do usuário); `isPaid === false` → `paidDate = null`. **Não** existe mais coluna `isPaid`.
- **Pós**: `revalidatePath("/expenses")` e `revalidatePath("/dashboard")`.

## `deleteExpense` (`actions/delete-expense.ts`)

- Inalterado.

## Camada de dados

- `data/expenses.ts`: `getExpenses` passa a `orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }]` — vencimento mais próximo primeiro; despesas sem vencimento ao final (FR-004). O `nulls: "last"` é mantido explícito para garantir que as sem-vencimento fiquem ao final independentemente do padrão do banco. `getExpenseById` inalterado exceto pelos novos campos retornados automaticamente.
- `data/dashboard.ts`: filtro de pagos `isPaid: true` → `paidDate: { not: null }`.

## Contrato de UI

- **`expense-form.tsx`**: campos `Vencimento` (`Input` do shadcn, `<Input type="date">`) + opção `Sem data de vencimento` (Checkbox shadcn) que desabilita/limpa o vencimento; campo opcional `Pagamento` (`Input` do shadcn, `<Input type="date">`). Envia `clientToday` (dia local do navegador, `"YYYY-MM-DD"`) no input para a validação de data futura (RN-2). Erros de validação exibidos via `FieldError`. Conversões via `lib/date.ts`.
- **`expense-table.tsx`**: coluna `Vencimento` exibindo `formatCalendarDate(dueDate)` ou o rótulo `Sem vencimento` quando `null` (FR-004); despesas sem vencimento exibidas ao final da lista; status `Paga`/`Pendente` derivado de `paidDate`; exibição de `paidDate` quando presente; `Switch` de status mantém a marcação rápida (dispara `toggleExpensePaid` enviando `clientToday`).
