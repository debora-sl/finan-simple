# Contract — Server Actions (`actions/`)

Todas usam `protectedActionClient` + `.inputSchema` (`next-safe-action`) e revalidam autenticação e
autorização por `householdId`/`membershipId` **explícito** (FR-015). Chamadas do cliente via
`useAction`.

## Reuso — sem alteração de contrato

### `switchActiveHousehold({ householdId })`
- **Guard**: exige `Membership(user, householdId)`; nega se não membro (FR-004, US2-AS3, SC-005).
- **Efeito**: `User.activeHouseholdId := householdId`; revalida telas afetadas.
- **Uso**: ação "Definir como ativa" na listagem.

### `updateHousehold({ id, name })`
- **Guard**: `Membership(user, id).role === "ADMIN"`, senão erro (FR-013).
- **Efeito**: atualiza `name`; `revalidatePath("/households")` (+ `/households/[id]`).
- **Uso**: formulário de nome na edição `[id]`.

### `deleteHousehold({ householdId })`
- **Guard**: residência existe e `Membership(user, householdId).role === "ADMIN"` (FR-013).
- **Efeito**: `deleteHouseholdById` (reatribui ativa quando necessário — FR-016); revalida
  `/households` (+ dashboard/expenses/categories). Cliente redireciona para `/households`.
- **Uso**: zona de perigo na edição `[id]`.

### `leaveHousehold({ householdId })`
- **Guard**: exige `Membership(user, householdId)` (FR-013 — qualquer membro pode sair).
- **Efeito**: `handleAdminDeparture`; reatribui ativa se era a que saiu; revalida `/households`.
- **Uso**: "Sair da residência" na edição `[id]`. Cliente redireciona para `/households`.

### `removeMember({ membershipId })`
- **Guard**: solicitante é ADMIN da residência do membership alvo; não permite auto-remoção (FR-013).
- **Efeito**: remove membership; reatribui ativa do removido se necessário; revalida `/households`.
- **Uso**: tabela de membros na edição `[id]`.

## Alteração — `inviteMember`

### Antes
`inviteMember({ email })` — deriva `householdId` de `getActiveHousehold()` (acoplado à ativa).

### Depois — `inviteMember({ householdId, email })`
- **Schema** (`lib/validation/invitation.ts`): `inviteMemberSchema` ganha
  `householdId: z.string().min(1)`.
- **Guard**: `Membership(user, householdId).role === "ADMIN"` (papel **da rota**, não da ativa) —
  FR-011/FR-012/FR-013. Demais validações preservadas (e-mail próprio, usuário inexistente, já
  membro, convite pendente/recusado) passam a usar o `householdId` do input.
- **Efeito**: cria `Invitation` na residência da rota; `revalidatePath("/households")` (+
  `/households/[id]`).
- **Uso**: `InviteForm` na edição `[id]` passa a receber e enviar `householdId` da rota.
- **Impacto**: `components/households/invite-form.tsx` recebe prop `householdId` e o inclui no
  `execute`.

## Reuso — criação (sem alteração)

### `createHousehold({ name })`
- Fluxo `/households/new` inalterado; define a nova residência como ativa; revalida `/households`.
- **Uso**: botão "Criar nova residência" no cabeçalho da listagem aponta para `/households/new`.
