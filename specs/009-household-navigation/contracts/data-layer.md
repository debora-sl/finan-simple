# Contract — Data Layer (`data/households.ts`, `data/memberships.ts`)

Contratos das funções de leitura consumidas pela feature. Prisma reside **apenas** aqui (FR-018).

## Existentes (reuso, sem alteração)

### `getHouseholdsForUser(userId: string)`
- **Uso**: listagem `/households`.
- **Retorno**: `Array<{ id: string; name: string; role: "ADMIN" | "MEMBER" }>`, ordenado por
  `joinedAt asc`.
- **Garantias**: contém 100% das residências das quais o usuário é membro (SC-001).

### `getMembers(householdId: string)`
- **Uso**: seção "Membros" na edição `/households/[id]`.
- **Retorno**: `Array<{ membershipId; userId; name; email; role; joinedAt }>`.

### `getHouseholdInvitations(householdId: string)`
- **Uso**: seção "Convites" na edição `/households/[id]` (apenas ADMIN).
- **Retorno**: `Array<{ id; email; status; createdAt }>`.

## Novo

### `getActiveHouseholdId(userId: string)`
- **Uso**: listagem `/households` (T004) e header no layout (T014) — determinar a residência ativa
  **tolerando ausência**, para o estado vazio e o rótulo neutro (FR-021).
- **Assinatura**:
  ```ts
  export async function getActiveHouseholdId(userId: string): Promise<string | null>
  ```
- **Contrato**:
  - Lê `user.activeHouseholdId` diretamente e retorna `null` quando ausente.
  - MUST NOT redirecionar (ex.: para `/households/new`) nem reatribuir automaticamente a residência
    ativa — diferentemente de `getActiveHousehold()` (`lib/active-household.ts`), reservada às demais
    telas fora do escopo desta feature.
  - A listagem/header cruzam esse id com `getHouseholdsForUser` para derivar destaque, ordem e nome.

### `getHouseholdForUserWithRole(userId: string, householdId: string)`
- **Uso**: página de edição `/households/[id]` — carrega residência **e** papel do usuário nela e
  serve de guard de acesso.
- **Assinatura**:
  ```ts
  export async function getHouseholdForUserWithRole(
    userId: string,
    householdId: string,
  ): Promise<{ id: string; name: string; role: "ADMIN" | "MEMBER" } | null>
  ```
- **Contrato**:
  - Retorna `null` se não existir `Membership(userId, householdId)` **ou** se a residência não
    existir → a página deve negar acesso (`notFound()`), atendendo FR-014/SC-005.
  - Quando presente, `role` é o papel **naquela** residência (FR-012).
  - Implementação: uma consulta de `membership` com `include: { household }` filtrando por
    `userId_householdId`; mapear para o shape acima.
