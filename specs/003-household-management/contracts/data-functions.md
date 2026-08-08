# Contract — Funções de Dados (`data/`) e Helpers (`lib/`)

Toda leitura de banco fica em `data/` (Princípio II). Componentes/páginas consomem estas funções;
nunca chamam Prisma diretamente. Assinaturas passam a receber `householdId` (não `userId`).

## `lib/active-household.ts` (novo helper)

```ts
getActiveHousehold(): Promise<{ userId: string; householdId: string; role: "ADMIN" | "MEMBER" }>
```
- Cacheado com `react.cache`. Verifica sessão (reusa `verifySession`).
- Lê `User.activeHouseholdId`; valida membership. Se o usuário não tem nenhuma residência →
  `redirect("/households/new")`. Se `activeHouseholdId` inválido/removido → seleciona a membership
  mais antiga; se nenhuma, redireciona para criação. (FR-004, FR-008, edge cases)
- Usado pelo `app/(app)/layout.tsx` e por todas as páginas de dados.

## `data/households.ts` (novo)

| Função | Assinatura | Descrição |
|--------|-----------|-----------|
| `getHouseholdsForUser` | `(userId) => Promise<Array<{ id; name; role }>>` | residências do usuário para o seletor (FR-007). |
| `getHouseholdById` | `(householdId) => Promise<Household \| null>` | dados da residência ativa. |
| `getMembership` | `(userId, householdId) => Promise<{ role } \| null>` | usado em autorização. |
| `handleAdminDeparture` | `(householdId, leavingUserId) => Promise<void>` | sucessão/remoção transacional (FR-019, FR-020) — compartilhada por `leave-household` e pelo hook de exclusão de conta. |

## `data/memberships.ts` (novo)

| Função | Assinatura | Descrição |
|--------|-----------|-----------|
| `getMembers` | `(householdId) => Promise<Array<{ membershipId; userId; name; email; role; joinedAt }>>` | lista de membros (FR-018, US2). |
| `getPendingInvitations` | `(householdId) => Promise<Array<{ id; email; createdAt }>>` | convites pendentes (FR-017). |

## `data/expenses.ts` (alterado)

| Antes | Depois |
|-------|--------|
| `getExpenses(userId)` | `getExpenses(householdId)` — `where: { householdId }` |
| `getExpenseById(userId, id)` | `getExpenseById(householdId, id)` — `where: { id, householdId }` |

## `data/categories.ts` (alterado)

- `getCategories(userId)` → `getCategories(householdId)` (`where: { householdId }`, mesma ordenação).
- Demais funções: trocar filtro `userId` por `householdId`.

## `data/dashboard.ts` (alterado)

- `getDashboardSummary(userId)` → `getDashboardSummary(householdId)`; todos os `where` internos
  passam de `{ userId }` para `{ householdId }` (FR-009, SC-002).

## Integração Better Auth (`lib/auth.ts` — `databaseHooks`)

- `user.create.after(user)`: busca `Invitation` `{ email: user.email, status: PENDING }`; para cada
  uma cria `Membership` MEMBER, marca `ACCEPTED`, define `activeHouseholdId` se nulo. (FR-016)
- `user.delete.before(user)`: para cada household que o usuário administra/participa, chama
  `handleAdminDeparture(householdId, user.id)`. (FR-019, FR-020)

## Landing (US5) — sem funções de dados

`app/page.tsx` e `components/marketing/*` são estáticos; **não** consomem funções de `data/`
(SC-007). Dados ilustrativos são constantes no próprio componente.
