# Phase 1 — Data Model: Gestão de Residências

Modelo derivado das Key Entities e dos Functional Requirements da spec. Alvo: `prisma/schema.prisma`
(SQLite via Prisma 7). Convenções seguem o schema atual: ids `cuid()`, `@@map` para nomes de tabela.

## Diagrama de relacionamentos

```text
User ──< Membership >── Household ──< Expense
  │           (role)         │      └─< Category
  │ activeHouseholdId ───────┘
  └──────────────< Invitation (email) >── Household
```

- `User 1—N Membership N—1 Household` (associação com papel e antiguidade)
- `Household 1—N Expense` e `Household 1—N Category` (posse dos dados financeiros)
- `Household 1—N Invitation` (convites pendentes/aceitos/cancelados)
- `User.activeHouseholdId → Household` (casa ativa selecionada, nullable)

## Entidades

### Household (`household`)

| Campo | Tipo | Regras |
|-------|------|--------|
| id | String `@id @default(cuid())` | |
| name | String | obrigatório; 1–60 chars (validação zod) |
| createdAt | DateTime `@default(now())` | |
| updatedAt | DateTime `@updatedAt` | |

Relações: `memberships Membership[]`, `invitations Invitation[]`, `expenses Expense[]`,
`categories Category[]`, `activeForUsers User[] @relation("ActiveHousehold")`.

Invariante (aplicada em código, não no schema): exatamente uma `Membership` com `role = "ADMIN"`
por household em qualquer instante (FR-003, SC-004).

### Membership (`membership`)

| Campo | Tipo | Regras |
|-------|------|--------|
| id | String `@id @default(cuid())` | |
| userId | String | FK → User, `onDelete: Cascade` |
| householdId | String | FK → Household, `onDelete: Cascade` |
| role | String | "ADMIN" \| "MEMBER" (validado por zod) |
| joinedAt | DateTime `@default(now())` | antiguidade para sucessão (FR-019) |

Constraints: `@@unique([userId, householdId])` (FR-022 — sem vínculo duplicado);
índices `@@index([householdId])`, `@@index([householdId, role])`.

### Invitation (`invitation`)

| Campo | Tipo | Regras |
|-------|------|--------|
| id | String `@id @default(cuid())` | |
| email | String | e-mail de destino (lowercase normalizado) |
| householdId | String | FK → Household, `onDelete: Cascade` |
| status | String | "PENDING" \| "ACCEPTED" \| "CANCELLED" (default "PENDING") |
| createdAt | DateTime `@default(now())` | |
| updatedAt | DateTime `@updatedAt` | |

Constraints: `@@unique([householdId, email])` (evita convite redundante ao mesmo e-mail — edge case
"convidar o próprio e-mail"/"já é membro" tratado na action); índice `@@index([email, status])`
(usado pela vinculação no signup, FR-016).

Transições de estado:

```text
PENDING ──aceitar (usuário cadastrado)──> ACCEPTED
PENDING ──signup com e-mail correspondente──> ACCEPTED (auto, FR-016)
PENDING ──cancelar (Administrador)──> CANCELLED
ACCEPTED / CANCELLED ──aceitar──> operação REJEITADA, sem mudança de estado (FR-023, edge case)
```

### User (`user`) — alterações

Adicionar:

| Campo | Tipo | Regras |
|-------|------|--------|
| activeHouseholdId | String? | FK → Household `@relation("ActiveHousehold", onDelete: SetNull)` |

Adicionar relações: `memberships Membership[]`. Manter `expenses`/`categories`? **Não** — a posse
migra para Household (ver abaixo). Campos de auth (`sessions`, `accounts`) inalterados.

### Expense (`expense`) — alterações

- Remover `userId` e a relação `user`; remover índices baseados em `userId`.
- Adicionar `householdId String` + relação `household Household @relation(onDelete: Cascade)`.
- Novos índices: `@@index([householdId, date])`, `@@index([householdId, categoryId])`.
- `categoryId` permanece `String?` com `onDelete: SetNull`.

### Category (`category`) — alterações

- Remover `userId` e a relação `user`.
- Adicionar `householdId String` + relação `household Household @relation(onDelete: Cascade)`.
- Trocar unicidade: de `@@unique([userId, nameLower])` para `@@unique([householdId, nameLower])`
  (nome de categoria único por residência).

## Regras de validação (zod — `lib/validation/`)

- **household**: `name` string trim 1–60. Schemas: `createHouseholdSchema`, `updateHouseholdSchema`
  (`{ id, name }`), `switchHouseholdSchema` (`{ householdId }`).
- **invitation**: `email` string trim lowercase `.email()`. Schemas: `inviteMemberSchema`
  (`{ email }` — householdId vem da casa ativa/ctx), `invitationIdSchema` (`{ invitationId }`),
  `removeMemberSchema` (`{ membershipId }`).

## Autorização (resumo por operação)

| Operação | Requisito |
|----------|-----------|
| Criar despesa/categoria, editar/excluir qualquer uma da residência | membership na residência (ADMIN ou MEMBER) — FR-010 |
| Editar nome da residência | role ADMIN — FR-012 |
| Convidar / cancelar convite / remover membro | role ADMIN — FR-013, FR-017, FR-018 |
| Trocar casa ativa | ser membro da residência-alvo |
| Aceitar convite | e-mail do usuário == e-mail do convite e status PENDING — FR-015, FR-023 |
| Sair da residência | ser membro; dispara sucessão/remoção — FR-019, FR-020 |

## Migração de dados existentes

1. Criar tabelas `household`, `membership`, `invitation`; adicionar colunas nullable
   (`expense.householdId`, `category.householdId`, `user.activeHouseholdId`).
2. Passo de dados: para cada `user` existente → criar `household` "Minha Casa", `membership` ADMIN
   (`joinedAt = user.createdAt`), repointar suas `expense`/`category` para o `householdId`, e setar
   `user.activeHouseholdId`.
3. Tornar `expense.householdId` e `category.householdId` obrigatórios; remover `expense.userId` e
   `category.userId` e ajustar índices/uniques.
