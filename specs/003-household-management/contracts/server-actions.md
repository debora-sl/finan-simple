# Contract — Server Actions (`actions/`)

Todas as actions usam `next-safe-action` com `protectedActionClient` (`lib/action-client.ts`),
`.inputSchema(...)`, e são consumidas no cliente via `useAction`. `ctx.user.id` vem da sessão.
Autorização adicional (pertencimento/papel) é validada dentro de cada action. Erros lançam
`Error(mensagem)` tratado por `handleServerError`. Referência de estilo: `actions/create-expense.ts`.

Convenção: onde a action opera sobre a "casa ativa", ela resolve o `householdId` a partir de
`getActiveHousehold()` (server), não confia em id vindo do cliente para a residência corrente.

## Residência

### `create-household.ts`
- **Input**: `{ name: string }` (`createHouseholdSchema`)
- **Autorização**: usuário autenticado.
- **Efeito**: cria `Household`; cria `Membership` role ADMIN (`joinedAt = now`); define
  `User.activeHouseholdId`. (FR-001, FR-002)
- **Retorno**: `{ id }`. **Revalida**: `/dashboard`, `/expenses`, `/categories`, `/households`.

### `update-household.ts`
- **Input**: `{ id: string, name: string }` (`updateHouseholdSchema`)
- **Autorização**: `role = ADMIN` na residência `id`. (FR-011, FR-012)
- **Efeito**: atualiza `name`. **Revalida**: `/households`.

### `switch-active-household.ts`
- **Input**: `{ householdId: string }` (`switchHouseholdSchema`)
- **Autorização**: usuário é membro de `householdId`. (FR-008)
- **Efeito**: define `User.activeHouseholdId = householdId`. (FR-009)
- **Revalida**: `/dashboard`, `/expenses`, `/categories`.

## Convites e membros

### `invite-member.ts`
- **Input**: `{ email: string }` (`inviteMemberSchema`) — householdId = casa ativa.
- **Autorização**: `role = ADMIN`. (FR-013)
- **Regras**: normaliza e-mail (lowercase). Rejeita se o e-mail já pertence a um membro da
  residência ou já tem convite PENDING; ignora convite ao próprio e-mail do Administrador. (FR-014,
  FR-022, edge cases)
- **Efeito**: cria `Invitation` status PENDING. **Revalida**: `/households`.

### `cancel-invitation.ts`
- **Input**: `{ invitationId: string }` (`invitationIdSchema`)
- **Autorização**: `role = ADMIN` da residência do convite. (FR-017)
- **Efeito**: `status = CANCELLED` (só se PENDING). **Revalida**: `/households`.

### `accept-invitation.ts`
- **Input**: `{ invitationId: string }` (`invitationIdSchema`)
- **Autorização**: usuário autenticado cujo e-mail == `Invitation.email` e `status = PENDING`.
  (FR-015, FR-023)
- **Efeito**: cria `Membership` MEMBER; `status = ACCEPTED`; define `activeHouseholdId` se nulo.
  Idempotente contra duplicidade (FR-022).
- **Retorno**: `{ householdId }`. **Revalida**: `/households`, `/dashboard`.

### `remove-member.ts`
- **Input**: `{ membershipId: string }` (`removeMemberSchema`)
- **Autorização**: `role = ADMIN`; não pode remover a si mesmo por esta action (usar
  `leave-household`). (FR-018)
- **Efeito**: apaga a `Membership`; se a residência era a casa ativa do removido, seu
  `activeHouseholdId` cai para fallback/null. **Revalida**: `/households`.

### `leave-household.ts`
- **Input**: `{ householdId: string }` (`switchHouseholdSchema`)
- **Autorização**: usuário é membro de `householdId`.
- **Efeito** (transacional — FR-019, FR-020, SC-004): se for ADMIN e houver outro membro ativo,
  promove o de menor `joinedAt` a ADMIN e remove sua membership; se for o único integrante, apaga a
  residência (cascata remove despesas/categorias/convites). Ajusta `activeHouseholdId` do usuário
  para fallback. Reutiliza a mesma função usada pelo hook de exclusão de conta.
- **Revalida**: `/dashboard`, `/expenses`, `/categories`, `/households`.

## Despesas e categorias (alteradas)

`create/update/delete-expense`, `toggle-expense-paid`, `create/update/delete-category`:
- **Autorização**: passa a validar **pertencimento à casa ativa** (membership) em vez de
  `userId === ctx.user.id`. Categoria referenciada deve pertencer à mesma residência. (FR-005,
  FR-006, FR-010)
- **Efeito**: grava/lê por `householdId` (da casa ativa) em vez de `userId`. Qualquer membro pode
  editar/excluir registros criados por outros da mesma residência.
- **Revalida**: rotas correspondentes (inalterado).
