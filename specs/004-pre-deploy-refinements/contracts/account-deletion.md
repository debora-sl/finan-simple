# Contrato — Exclusão de Conta (US2)

## Configuração Better Auth — `lib/auth.ts`

- Habilitar `user.deleteUser.enabled = true`.
- Estender `databaseHooks.user.delete.before(user)` (já existente) para, além de `handleAdminDeparture` por residência, remover convites pendentes de autoria do usuário:
  `prisma.invitation.deleteMany({ where: { invitedById: user.id, status: "PENDING" } })`.
- Cascatas já garantem remoção de `Session`, `Account`, `Membership` (todas `onDelete: Cascade` → User).

## `deleteAccount` (NOVO) — `actions/delete-account.ts`

- **Client**: `protectedActionClient`.
- **Input**: `{ password: string }` (novo schema em `lib/validation/profile.ts`).
- **Execução**: `auth.api.deleteUser({ body: { password }, headers: await headers() })`.
- **Erros (serverError, pt-BR via `lib/auth-errors.ts`)**:
  - senha incorreta → "Senha incorreta."
  - falha genérica → "Não foi possível excluir a conta."
- **Efeitos**: aplica regras de saída de residência (transferência/limpeza) via hook `before`; remove dados pessoais; encerra sessão.
- **Pós-sucesso (UI)**: redirecionar para `/login` (sessão já invalidada).

## UI — `components/profile/delete-account-card.tsx` (NOVO)

- Cartão "zona de perigo" na página de perfil.
- Ação de excluir abre um `Dialog` (shadcn) de **confirmação explícita** (FR-008) solicitando a senha; só executa após confirmação.
- Confirmação abandonada não altera nada (edge case).

## Cobertura de requisitos
FR-007, FR-008, FR-009, FR-010, FR-015; edge cases: único admin com outros membros → transferência; residência ativa excluída → reajuste via `getActiveHousehold`/`SetNull`.
