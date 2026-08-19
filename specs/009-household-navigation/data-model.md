# Phase 1 — Data Model: Residências (navegação, listagem, edição por residência)

> **Sem migration.** O modelo de dados permanece inalterado (Assumption do spec). Este documento
> descreve as entidades envolvidas como já existem e as **formas de leitura** (shapes) que a camada
> de dados expõe para a feature.

## Entidades (existentes — inalteradas)

### Household
- `id: string` (cuid/uuid)
- `name: string` (1–60 chars — `householdSchema`)
- Relacionamentos: `memberships: Membership[]`, `invitations: Invitation[]`

### Membership (vínculo usuário↔residência)
- `id: string`
- `userId: string`
- `householdId: string`
- `role: "ADMIN" | "MEMBER"` — **o papel aplicável é o desta residência** (a da rota), não o da ativa
- `joinedAt: DateTime` (usado para ordenação e reatribuição de admin)
- Chave única: `userId_householdId`

### Invitation
- `id: string`
- `householdId: string`
- `email: string`
- `status: "PENDING" | "ACCEPTED" | "REJECTED"`
- `invitedById: string | null`
- `createdAt: DateTime`
- Chave única: `householdId_email`

### User (recorte relevante)
- `id: string`
- `email: string`
- `name: string`
- `activeHouseholdId: string | null` — **contexto de residência ativa** do usuário; trocado na
  listagem, exibido no header, reatribuído automaticamente ao excluir/sair da ativa

## Regras de validação e autorização (aplicadas na camada de dados/actions)

- **Pertencimento**: acesso à edição `/households/[id]` exige `Membership(userId, id)` existente;
  caso contrário, acesso negado (FR-014).
- **Papel pela rota**: permissões de ADMIN (editar nome, convidar/gerenciar convites, excluir) são
  derivadas do `Membership.role` na residência `[id]`, nunca da ativa (FR-012, FR-013).
- **Sair**: qualquer membro pode sair da residência da rota (FR-013).
- **Nome**: 1–60 caracteres (`householdSchema`).

## Shapes de leitura (data layer)

### `getHouseholdsForUser(userId)` — existente (reuso na listagem)
```ts
Array<{ id: string; name: string; role: "ADMIN" | "MEMBER" }>
```
Ordenado por `joinedAt asc`. A página marca/ordena a residência ativa no topo usando o
`activeHouseholdId` obtido de `getActiveHousehold()`.

### `getHouseholdForUserWithRole(userId, householdId)` — **NOVO** (edição `[id]`)
```ts
Promise<null | {
  id: string;
  name: string;
  role: "ADMIN" | "MEMBER";
}>
```
Retorna `null` quando o usuário não é membro ou o id não existe (base do guard de acesso).

### `getMembers(householdId)` — existente (reuso na edição)
```ts
Array<{
  membershipId: string;
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  joinedAt: Date;
}>
```

### `getHouseholdInvitations(householdId)` — existente (reuso na edição)
```ts
Array<{ id: string; email: string; status: "PENDING" | "ACCEPTED" | "REJECTED"; createdAt: Date }>
```

## Transições de estado relevantes (comportamento preservado)

- **Trocar residência ativa** (`switchActiveHousehold`): `User.activeHouseholdId := householdId`
  (exige membership). Reflete em listagem e header.
- **Excluir residência** (`deleteHouseholdById`): remove `Household`; para cada usuário cuja ativa era
  a excluída, reatribui `activeHouseholdId` ao membership mais antigo restante (FR-016).
- **Sair / saída de admin** (`handleAdminDeparture`): membro comum sai; admin transfere ADMIN ao
  membro mais antigo; se era o último, a residência é removida. Se a ativa era a que saiu, reatribui.

## Derivações de apresentação (não persistidas)

- **isActive**: `household.id === activeHouseholdId` → destaque + posição no topo + oculta "Definir
  como ativa" (FR-003, FR-004).
- **isAdmin**: `role === "ADMIN"` na residência da rota → habilita ações de admin na edição (FR-013).
