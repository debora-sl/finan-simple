# Contract: Server Action `updateSavings`

**Feature**: 007-household-savings | **Date**: 2026-08-14

Interface exposta pela aplicação para definir/atualizar o valor guardado da residência ativa. Implementada como Server Action `next-safe-action` em `actions/update-savings.ts`, consumida no cliente via `useAction`.

## Assinatura

- **Client**: `protectedActionClient` (autenticação obrigatória; sessão inexistente → erro `SESSION_EXPIRED`).
- **Validação**: `.inputSchema(updateSavingsSchema)` (NUNCA `.schema`).
- **Base de referência**: `actions/update-household.ts` + `actions/create-expense.ts`.

## Input (`updateSavingsSchema` — `lib/validation/savings.ts`)

```ts
{
  amount: number // em reais; coerção de string; >= 0; múltiplo de 0.01
}
```

| Campo    | Tipo   | Regras                                                        | Mensagem de erro (pt-BR)                          |
|----------|--------|--------------------------------------------------------------|---------------------------------------------------|
| `amount` | number | `z.coerce.number({ error })`; `.min(0)`; `.multipleOf(0.01)` | "Valor obrigatório" / "O valor não pode ser negativo" / "Valor deve ter no máximo 2 casas decimais" |

O `householdId` **não** é entrada — é resolvido no servidor via `getActiveHousehold()` (evita IDOR; garante FR-009).

## Comportamento

1. Resolve a residência ativa: `const { householdId } = await getActiveHousehold()`.
   - Sem membership/residência ativa → `getActiveHousehold` redireciona para onboarding (edge "usuário sem residência ativa").
2. Persiste via função de dados: `setHouseholdSavings(householdId, amountToCents(parsedInput.amount))`
   - Executa `prisma.household.update({ where: { id: householdId }, data: { savingsInCents } })`.
3. `revalidatePath("/cofrinho")` e `revalidatePath("/dashboard")`.
4. Retorna o novo total persistido (ex.: `{ savingsInCents }`) para feedback imediato.

## Output

- **Sucesso**: `{ savingsInCents: number }` — total após a atualização.
- **Erro de validação**: `validationErrors` do next-safe-action, exibidos no formulário (por campo).
- **Erro de sessão**: mensagem tratada por `handleServerError` (`SESSION_EXPIRED`).

## Autorização

| Cenário                                             | Resultado esperado |
|-----------------------------------------------------|--------------------|
| Usuário autenticado, membro da residência ativa     | Permite atualizar (FR-009) |
| Usuário não autenticado                             | `SESSION_EXPIRED` (bloqueia) |
| Usuário sem residência ativa                        | Redirecionado ao onboarding (não atualiza) |
| Tentativa de atualizar residência de outro usuário  | Impossível — householdId vem do servidor, não da entrada (edge "acesso de não-membro") |

## Rastreabilidade

Cobre FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-012 e os edge cases de valor zero, negativo, vazio/não numérico, centavos, usuário sem residência e acesso de não-membro.
