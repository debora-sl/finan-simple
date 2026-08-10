# Contrato — Server Actions de Convites

Todas as actions usam `next-safe-action` com `protectedActionClient`, `.inputSchema(...)`, e reportam erros como `serverError` (string pt-BR) consumido via `useAction`.

## `inviteMember` (AJUSTADO) — `actions/invite-member.ts`

- **Autorização**: solicitante deve ser `ADMIN` da residência ativa.
- **Input**: `{ email: string }` (zod: trim + lowercase + email válido).
- **Mudança de comportamento**: registrar `invitedById = ctx.user.id` no convite criado. **Não reabrir** convite `REJECTED` — se existir registro `(householdId, email)` com status `REJECTED`, falhar com mensagem específica (FR-020), mantendo o registro. Substituir o `upsert` que reabre por: bloquear em `PENDING` (já existe), bloquear em `REJECTED` (novo), criar apenas quando não houver registro.
- **Erros (serverError)**: "Apenas o Administrador pode convidar membros."; "Você não pode convidar seu próprio e-mail."; "Esse e-mail já pertence a um membro da residência."; "Já existe um convite pendente para esse e-mail."; "Este e-mail recusou um convite anterior para esta residência."; (e-mail sem conta na plataforma → mensagem orientando cadastro).
- **Sucesso**: convite `PENDING` visível ao admin como "Enviado"; `revalidatePath("/households")`.

## `rejectInvitation` (NOVO) — `actions/reject-invitation.ts`

- **Base**: espelhar `accept-invitation.ts`.
- **Input**: `{ invitationId: string }` (`invitationIdSchema` existente).
- **Regras**: convite deve existir e estar `PENDING`; `invitation.email` deve bater com o e-mail do usuário logado. Atualiza `status → REJECTED`.
- **Erros**: "Convite não encontrado ou não está mais pendente."; "Esse convite não pertence à sua conta."
- **Sucesso**: status "Recusado" para ambos os lados; convidado **não** ganha acesso; `revalidatePath("/households")`.

## `cancelInvitation` (VERIFICAR) — `actions/cancel-invitation.ts`

- **Autorização**: `ADMIN` da residência.
- **Regra de concorrência**: só cancela se `status === "PENDING"`; se já respondido, falha com "Este convite não está mais pendente." (alinha com clarificação 2026-08-09).

## `acceptInvitation` (EXISTENTE, sem mudança funcional)

- Mantém guarda `status === "PENDING"`; primeira operação a efetivar vence.

## Leituras (camada `data/`)

- `getPendingInvitations(householdId)` → lista do admin, com `status` e destinatário (para exibir Enviado/Aceito/Recusado, incluir também aceitos/recusados recentes se a UI exigir histórico).
- `getPendingInvitationsForEmail(email)` (AJUSTADO) → incluir `invitedByName` (join `invitedBy.name`, fallback quando nulo) e `householdName` para montar a mensagem: "Olá, você recebeu um convite de {nome} para colaborar com o controle financeiro da residência: {nome da residência}."
