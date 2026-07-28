# Contract: Server Actions de Despesas

**Feature**: 001-expense-management | Cobre: US2, US4, FR-007..FR-010, FR-013..FR-015

Todas em `actions/`, criadas com `protectedActionClient` (next-safe-action) usando `.inputSchema`. `ctx.user.id` vem da DAL; nunca do cliente. Cada action valida a **posse** do recurso antes de mutar. Leitura fica em `data/expenses.ts`. Cliente chama via `useAction`.

## Regra transversal de autorização
Antes de qualquer update/delete/toggle, a action confirma que a despesa (e a categoria, se informada) pertence a `ctx.user.id`. Recurso de outro usuário → erro de autorização, sem vazar existência (FR-006; edge case de acesso a recurso alheio).

---

## createExpense — `actions/create-expense.ts`
- **inputSchema**: `{ description: string(min1,max200), amount: number.positive.multipleOf(0.01), date: date, categoryId?: string }`
- **Efeito**: cria `Expense` com `userId = ctx.user.id`, `amountInCents = round(amount*100)`, `isPaid = false`. Se `categoryId` informado, valida posse.
- **Sucesso**: despesa passa a aparecer na lista do usuário (FR-007; Cenário US2.1). Revalida a rota de despesas/dashboard.
- **Erros**: `amount` ausente/≤0 → validação (FR-008; Cenário US2.2); `categoryId` de outro usuário → autorização.

## updateExpense — `actions/update-expense.ts`
- **inputSchema**: `{ id: string, description, amount, date, categoryId? }`
- **Efeito**: atualiza a despesa se `expense.userId === ctx.user.id`.
- **Sucesso**: alteração refletida na lista (FR-010; Cenário US2.4).
- **Erros**: id inexistente/de outro usuário → autorização; validações iguais a create.

## deleteExpense — `actions/delete-expense.ts`
- **inputSchema**: `{ id: string }`
- **Efeito**: remove a despesa do usuário dono.
- **Sucesso**: some da lista (FR-010; Cenário US2.4).
- **Erros**: id de outro usuário → autorização.

## toggleExpensePaid — `actions/toggle-expense-paid.ts`
- **inputSchema**: `{ id: string, isPaid: boolean }`
- **Efeito**: define `isPaid` conforme entrada, se a despesa pertence ao usuário (FR-015).
- **Sucesso**: estado alterna entre paga/pendente e é refletido na lista (Cenários US4.1, US4.2).
- **Erros**: id de outro usuário → autorização.

---

## Leituras — `data/expenses.ts` (não são actions)
- `getExpenses(userId)`: despesas do usuário, ordenadas por `date` desc, com `category` incluída. Retorna só do usuário (FR-009; Cenário US2.3).
- `getExpenseById(userId, id)`: uma despesa do usuário (para edição), ou `null`.

## Contrato de retorno (next-safe-action)
- Sucesso: `{ data: ... }`.
- Erro de validação: `validationErrors` por campo (renderizados no formulário shadcn — FR-018).
- Erro de negócio/autorização: `serverError` com mensagem clara e neutra.
