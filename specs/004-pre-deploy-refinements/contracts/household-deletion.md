# Contrato — Exclusão de Residência (US3)

## `deleteHousehold` (NOVO) — `actions/delete-household.ts`

- **Client**: `protectedActionClient`.
- **Input**: `{ householdId: string }` (novo schema em `lib/validation/household.ts`).
- **Autorização**: solicitante deve ter `Membership.role === "ADMIN"` na residência-alvo (padrão de `invite-member.ts`). Membro comum → negar.
- **Execução** (helper em `data/households.ts`, transação):
  1. Identificar usuários com `activeHouseholdId === householdId`.
  2. `prisma.household.delete({ where: { id } })` — cascatas removem `Membership`, `Invitation`, `Category`, `Expense`; `User.activeHouseholdId` vira `null` via `SetNull`.
  3. Para cada usuário afetado, reajustar `activeHouseholdId` para o membership mais antigo restante (ou manter `null`, levando ao fluxo `/households/new` via `getActiveHousehold`).
- **Erros (serverError)**:
  - não-admin → "Apenas o Administrador pode excluir a residência." (FR-011)
  - residência inexistente → "Residência não encontrada."
- **Sucesso**: `revalidatePath` de `/dashboard`, `/expenses`, `/categories`, `/households`.

## UI — `components/households/delete-household-button.tsx` (NOVO)

- Visível apenas para `ADMIN`.
- Abre `Dialog` de confirmação explícita (FR-012); confirmação abandonada não altera nada.

## Cobertura de requisitos
FR-011, FR-012, FR-013, FR-014, FR-015; edge case: residência ativa excluída → reajuste ou fluxo de criação.
