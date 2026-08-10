# Phase 1 — Data Model: Pré-Deploy Refinements

Escopo de dados desta feature. Apenas o modelo `Invitation` muda de forma; as demais entidades são reutilizadas como estão, apoiando-se em relações `onDelete` já declaradas em `prisma/schema.prisma`.

## Alterações de esquema

### Invitation (ALTERADO)

| Campo | Tipo | Mudança | Regra / Observação |
|-------|------|---------|--------------------|
| `id` | String (cuid) | — | PK |
| `email` | String | — | destinatário; `@@unique([householdId, email])` preservado |
| `householdId` | String | — | FK → Household (`onDelete: Cascade`) |
| `invitedById` | `String?` | **NOVO** | FK → User (autor). Relação com `onDelete: SetNull` |
| `status` | String | **valores** | agora `PENDING` \| `ACCEPTED` \| `REJECTED` (default `PENDING`) |
| `createdAt` | DateTime | — | |
| `updatedAt` | DateTime | — | |

Relações:
- `household  Household @relation(fields: [householdId], references: [id], onDelete: Cascade)` (existente)
- `invitedBy  User?     @relation("InvitationAuthor", fields: [invitedById], references: [id], onDelete: SetNull)` (**novo**)

Índices: manter `@@unique([householdId, email])` e `@@index([email, status])`.

**Regras de validação / negócio**:
- Existe no máximo **um** registro de convite por `(householdId, email)`.
- Um convite `REJECTED` **bloqueia** novos convites ao mesmo e-mail na mesma residência: a criação NÃO reabre um registro recusado (FR-020) — diferente do `upsert` atual que reabre.
- Transições de estado permitidas: `PENDING → ACCEPTED`, `PENDING → REJECTED`. Nenhuma transição a partir de `ACCEPTED`/`REJECTED`.
- Toda ação sobre um convite (aceitar/recusar/cancelar) só tem efeito se `status === "PENDING"`; caso contrário falha com mensagem específica (concorrência — clarificação 2026-08-09).
- Convites `PENDING` cujo `invitedById` é um usuário em exclusão são removidos no `beforeDelete` (sem órfãos, FR-001/FR-010).

### User (relação NOVA, sem novo campo)

Adicionar o lado inverso da relação de autoria:
- `authoredInvitations Invitation[] @relation("InvitationAuthor")`

Campos existentes reutilizados: `name` (saudação FR-023), `email` (detecção de convites e pré-check de login FR-017), `activeHouseholdId` (reajuste de residência ativa FR-014), `sessions`/`accounts`/`memberships` (removidos em cascata na exclusão de conta FR-010).

## Entidades reutilizadas (sem mudança de forma)

| Entidade | Papel nesta feature | Cascatas relevantes já existentes |
|----------|---------------------|-----------------------------------|
| **Household** | Alvo de exclusão (US3); nome exibido na mensagem de convite | `memberships`, `invitations`, `expenses`, `categories` com `onDelete: Cascade`; `activeForUsers` com `SetNull` |
| **Membership** | Papel (ADMIN/MEMBER) e antiguidade (`joinedAt`) para transferência de admin | `user`/`household` com `onDelete: Cascade`; `@@unique([userId, householdId])` |
| **Session / Account** | Removidos na exclusão de conta | `onDelete: Cascade` para User |
| **Expense / Category** | Removidos na exclusão de residência | `onDelete: Cascade` para Household |

## Migração

- Gerar migração Prisma adicionando `invitedById` (nullable) + relação `InvitationAuthor`.
- Nenhum backfill obrigatório: convites históricos ficam com `invitedById = NULL`; a UI exibe fallback (ex.: "um administrador") quando o autor for nulo.
- `status` permanece `String` — nenhum novo tipo; apenas o valor `REJECTED` passa a ser gravado.

## Diagrama de relações (foco da feature)

```text
User ──authoredInvitations(1:N, SetNull)──> Invitation
User ──memberships(1:N, Cascade)──────────> Membership ──> Household
User ──activeHousehold(N:1, SetNull)──────> Household
Household ──invitations(1:N, Cascade)─────> Invitation
Household ──(expenses/categories, Cascade)─> Expense / Category
```
