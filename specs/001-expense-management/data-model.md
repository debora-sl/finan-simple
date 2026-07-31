# Phase 1 Data Model: Gestão de Despesas com Autenticação

**Feature**: 001-expense-management | **Date**: 2026-07-28

Modelo de dados derivado das entidades do spec (Usuário, Categoria, Despesa) e das entidades de autenticação exigidas pelo Better Auth. Persistência: Prisma 7 sobre SQLite. Referência de decisões: [research.md](./research.md).

---

## Diagrama de relacionamentos

```text
User (1) ──< (N) Expense >── (0..1) Category
  │                              │
  │ (1)                         (1)
  ├──< (N) Category ────────────┘  (posse)
  │
  ├──< (N) Session      (Better Auth)
  ├──< (N) Account      (Better Auth — credencial e-mail/senha)
  └──  Verification     (Better Auth — global, sem FK de usuário)
```

- Um **User** possui muitas **Expense** e muitas **Category**.
- Uma **Expense** pertence a exatamente um **User** e a no máximo uma **Category** (opcional).
- Uma **Category** pertence a exatamente um **User** e agrupa muitas **Expense**.
- Remoção de **Category** → `SetNull` em `Expense.categoryId` (despesas preservadas sem categoria).
- Remoção de **User** → `Cascade` em Expense, Category, Session, Account.

---

## Entidades de domínio

### User

Pessoa que utiliza o sistema. Também serve de modelo base do Better Auth.

| Campo | Tipo | Regras |
|-------|------|--------|
| `id` | String (cuid) | PK |
| `name` | String | Obrigatório; mín. 2 caracteres (FR-001) |
| `email` | String | Obrigatório; único; formato de e-mail válido (FR-002) |
| `emailVerified` | Boolean | Default `false` (gerenciado pelo Better Auth) |
| `image` | String? | Opcional |
| `createdAt` | DateTime | Default `now()` |
| `updatedAt` | DateTime | `@updatedAt` |

Relações: `expenses Expense[]`, `categories Category[]`, `sessions Session[]`, `accounts Account[]`.

> A senha **não** fica em `User`; o Better Auth armazena o hash em `Account` (provedor de credenciais). Nenhuma senha em texto puro é persistida (FR-003).

### Category

Rótulo de organização de despesas criado por um usuário.

| Campo | Tipo | Regras |
|-------|------|--------|
| `id` | String (cuid) | PK |
| `name` | String | Obrigatório; mín. 1 caractere; trim (FR-011); valor exibido ao usuário |
| `nameLower` | String | Derivado de `name.trim().toLowerCase()`; usado só para unicidade case-insensitive (FR-011) |
| `userId` | String | FK → `User.id`; `onDelete: Cascade` |
| `createdAt` | DateTime | Default `now()` |
| `updatedAt` | DateTime | `@updatedAt` |

Relações: `user User`, `expenses Expense[]`.

Regras de negócio:
- Toda consulta/edição/remoção filtra por `userId` do usuário autenticado (FR-006, FR-012).
- Unicidade **case-insensitive** por usuário (FR-011) é garantida no banco por índice único composto `@@unique([userId, nameLower])`. O índice sobre `name` seria case-sensitive no SQLite; por isso persiste-se a coluna derivada `nameLower` (calculada na action a partir de `name.trim().toLowerCase()`) e a unicidade recai sobre ela. Nomes iguais entre usuários diferentes continuam permitidos.
- A action captura a violação do índice único (`P2002` do Prisma) e retorna erro claro de nome duplicado (FR-011, FR-018).

### Expense

Registro de um gasto do usuário.

| Campo | Tipo | Regras |
|-------|------|--------|
| `id` | String (cuid) | PK |
| `description` | String | Obrigatório; mín. 1 caractere; trim (FR-007) |
| `amountInCents` | Int | Obrigatório; **> 0**; valor monetário em centavos (FR-008; ver research §6) |
| `date` | DateTime | Obrigatório (FR-007) |
| `isPaid` | Boolean | Default `false`; alternável (FR-015) |
| `categoryId` | String? | Opcional; FK → `Category.id`; `onDelete: SetNull` (FR-013, FR-014) |
| `userId` | String | FK → `User.id`; `onDelete: Cascade` |
| `createdAt` | DateTime | Default `now()` |
| `updatedAt` | DateTime | `@updatedAt` |

Relações: `user User`, `category Category?`.

Regras de negócio:
- `amountInCents` sempre positivo; valores ≤ 0 são recusados na validação (FR-008; edge case de valor negativo/zero).
- Toda consulta/edição/remoção filtra por `userId` (FR-006, FR-009, FR-010).
- Ao associar categoria, valida-se que a `categoryId` pertence ao mesmo `userId` (impede associar categoria de outro usuário).
- Índices recomendados: `(userId, date)` para listagem ordenada; `(userId, categoryId)` para agregação da dashboard.

---

## Entidades de autenticação (Better Auth)

Geradas/gerenciadas pelo Better Auth; incluídas no `schema.prisma`. Estrutura conforme o adaptador Prisma do Better Auth (reconfirmar campos exatos via Context7 na implementação).

### Session

| Campo | Tipo | Regras |
|-------|------|--------|
| `id` | String | PK |
| `userId` | String | FK → `User.id`; `onDelete: Cascade` |
| `token` | String | Único |
| `expiresAt` | DateTime | Expiração da sessão |
| `ipAddress` | String? | Opcional |
| `userAgent` | String? | Opcional |
| `createdAt` / `updatedAt` | DateTime | — |

### Account

Guarda a credencial (hash de senha para o provedor e-mail/senha) e/ou vínculos de provedores.

| Campo | Tipo | Regras |
|-------|------|--------|
| `id` | String | PK |
| `userId` | String | FK → `User.id`; `onDelete: Cascade` |
| `accountId` | String | Identificador da conta no provedor |
| `providerId` | String | Ex.: `credential` |
| `password` | String? | Hash da senha (provedor de credenciais) |
| `accessToken` / `refreshToken` / `idToken` | String? | Para provedores OAuth (não usados nesta versão) |
| `createdAt` / `updatedAt` | DateTime | — |

### Verification

| Campo | Tipo | Regras |
|-------|------|--------|
| `id` | String | PK |
| `identifier` | String | Alvo da verificação |
| `value` | String | Token/valor |
| `expiresAt` | DateTime | Expiração |
| `createdAt` / `updatedAt` | DateTime | — |

---

## Regras de validação (camada Zod, aplicadas nas actions)

| Entidade | Campo | Regra Zod |
|----------|-------|-----------|
| Signup | `name` | `string().trim().min(2)` |
| Signup | `email` | `email()` |
| Signup | `password` | `string().min(8)` |
| Category | `name` | `string().trim().min(1).max(60)` |
| Expense | `description` | `string().trim().min(1).max(200)` |
| Expense | `amount` | `number().positive().multipleOf(0.01)` → convertido para `amountInCents` |
| Expense | `date` | `date()` (ou ISO string coercível) |
| Expense | `categoryId` | `string().optional()` — validado contra posse do usuário |
| Expense (update/toggle/delete) | `id` | `string()` — validado contra posse do usuário |

---

## Transições de estado

**Expense.isPaid** (FR-015, História 4):

```text
[não paga] ──marcar paga──> [paga]
[paga] ──marcar não paga──> [não paga]
```

- Estado inicial: `isPaid = false`.
- Alternância livre e idempotente por ação explícita do usuário dono da despesa.
- Nenhuma outra máquina de estado no domínio.

---

## Mapeamento requisito → modelo

| Requisito | Coberto por |
|-----------|-------------|
| FR-001/002 | `User.name`, `User.email` (único), validação de signup |
| FR-003/004 | `Account.password` (hash), `Session` (Better Auth) |
| FR-005/006 | Filtro por `userId` em todas as queries de `data/`; DAL |
| FR-007/008 | `Expense.description/amountInCents/date`; `amountInCents > 0` |
| FR-009/010 | Queries e actions de Expense filtradas por `userId` |
| FR-011/012 | `Category` + actions filtradas por `userId`; unicidade case-insensitive via `@@unique([userId, nameLower])` |
| FR-013 | `Expense.categoryId` opcional, validado por posse |
| FR-014 | `onDelete: SetNull` em `Expense.categoryId` |
| FR-015 | `Expense.isPaid` + `toggle-expense-paid` |
| FR-016/017 | Agregações em `data/dashboard.ts`; estado vazio |
| FR-018 | Erros de validação Zod retornados pelas actions |
