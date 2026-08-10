# Phase 0 — Research: Pré-Deploy Refinements

Fonte primária de documentação: **Context7** (`/better-auth/better-auth`) e leitura direta do código existente. Todas as decisões abaixo resolvem os pontos de incerteza do Technical Context; nenhum marcador NEEDS CLARIFICATION permaneceu.

---

## R1 — Referência ao autor do convite e estado "Recusado"

**Decision**: Adicionar `invitedById String?` ao modelo `Invitation`, com relação para `User` e `onDelete: SetNull`; adicionar o estado `REJECTED` ao campo `status` (que permanece `String`, valores `PENDING` | `ACCEPTED` | `REJECTED`). A limpeza de convites pendentes do autor na exclusão de conta é feita no `beforeDelete` do Better Auth (remoção explícita), garantindo ausência de órfãos mesmo com `SetNull`.

**Rationale**:
- O `@@unique([householdId, email])` já existente deve ser preservado (FR-020 depende dele para bloquear reconvite de e-mail recusado). Manter `status` como `String` mantém compatibilidade com o adaptador Prisma do Better Auth e com o código atual, evitando migração para enum SQLite.
- `SetNull` evita falha de FK caso um convite `ACCEPTED`/`REJECTED` histórico referencie um autor excluído; o requisito de "sem órfãos" (FR-001/FR-010) é atendido removendo explicitamente os convites **pendentes** do autor no hook de exclusão, antes de o usuário sair.
- A mensagem amigável "convite de {nome}" lê o nome via join `invitedBy` na camada `data/`.

**Alternatives considered**:
- `onDelete: Cascade` no autor — rejeitado: apagaria também convites já aceitos/recusados, perdendo histórico e o registro que bloqueia reconvite.
- Migrar `status` para enum Prisma — rejeitado: SQLite não tem enum nativo, aumenta atrito de migração sem benefício sobre o `String` já em uso.

---

## R2 — Exclusão de conta (US2) com Better Auth

**Decision**: Habilitar `user.deleteUser` no `betterAuth({...})` e disparar a exclusão a partir de uma Server Action (`delete-account`) que chama `auth.api.deleteUser(...)` com verificação de senha, dentro de `protectedActionClient`. A lógica de cascata de residências permanece no hook `databaseHooks.user.delete.before` já existente (que chama `handleAdminDeparture` por residência); estende-se esse `before` para também remover convites pendentes cujo `invitedById` seja o usuário. Sessões, contas e memberships são removidos por `onDelete: Cascade` já definidos no schema.

**Rationale**:
- O projeto já possui `databaseHooks.user.delete.before` executando `handleAdminDeparture`, que aplica exatamente a regra de saída exigida (transferência ao membro ativo mais antigo; remoção da residência quando único integrante) — reuso direto (DRY, FR-009).
- `Session`, `Account`, `Membership` têm `onDelete: Cascade` para `User`; a exclusão do usuário remove-os automaticamente (FR-010, FR-015).
- A confirmação explícita (FR-008) é feita na UI via `Dialog` shadcn exigindo a senha; a senha é validada pelo próprio `deleteUser` do Better Auth.
- O encerramento de sessão (FR-010) é consequência da remoção das sessões + `callbackURL`/redirect para `/login`.

**Alternatives considered**:
- Excluir o usuário manualmente via Prisma em `data/` — rejeitado: duplicaria a limpeza de credenciais que o Better Auth já gerencia e violaria o Princípio III (operações de auth passam pelo Better Auth).
- Verificação por e-mail (`sendDeleteAccountVerification`) — rejeitado para este escopo: não há envio de e-mail no produto (fora de escopo na spec); a verificação por senha é suficiente para contas email/senha.

---

## R3 — Exclusão de residência (US3) e reajuste de residência ativa

**Decision**: Nova Server Action `delete-household` protegida: valida que o solicitante é `ADMIN` da residência (via `getActiveHousehold`/`getMembership`), executa `prisma.household.delete` (as relações `Membership`, `Invitation`, `Category`, `Expense` têm `onDelete: Cascade`), e reajusta `activeHouseholdId` de todos os usuários afetados para a próxima residência disponível (membership mais antigo) ou `null`. Um helper em `data/households.ts` encapsula a exclusão + reajuste em uma transação.

**Rationale**:
- Todas as dependências da `Household` já declaram `onDelete: Cascade` no schema → um único `delete` remove despesas, categorias, convites e memberships sem órfãos (FR-013, FR-015).
- `User.activeHouseholdId` usa `onDelete: SetNull` na relação `ActiveHousehold` → ao excluir a residência ativa de alguém, o campo vira `null` automaticamente; o reajuste "para outra disponível" replica a lógica de fallback já presente em `leave-household.ts`/`getActiveHousehold` (membership mais antigo). Quem ficar sem residência é levado ao fluxo `/households/new` pelo `getActiveHousehold` existente (FR-014).
- Autorização de ADMIN espelha o padrão de `invite-member.ts` (FR-011).

**Alternatives considered**:
- Deletar dependências manualmente antes da residência — rejeitado: redundante frente aos `Cascade` já existentes; mais código e risco de esquecer uma relação.

---

## R4 — Mensagens de erro em português (US4) e distinção login sem-conta vs. senha-incorreta

**Decision**: Criar `lib/auth-errors.ts` com um mapa único `código Better Auth → mensagem pt-BR`, consumido por login, signup e alteração de senha (canal padrão: `toast` para erros de submissão de auth; `FieldError` para validação de campo por zod). Para satisfazer FR-017 (distinguir "não há conta com este e-mail" de "senha incorreta"), o `login-form` faz um **pré-check** via Server Action/`data` (`getUserByEmail`) antes de exibir a mensagem: se não existir conta, mensagem "não há conta para este e-mail" + sugestão de cadastro; caso exista e o sign-in falhe, "senha incorreta". Conta não verificada é detectada pelo status 403 do Better Auth.

**Rationale**:
- Context7 confirmou que o Better Auth retorna **um único** `INVALID_EMAIL_OR_PASSWORD` para todas as falhas de credencial (usuário inexistente, sem conta credential, senha errada) — é anti-enumeração por design e **não permite** distinguir os casos apenas pela resposta do sign-in.
- A spec **assume explicitamente** que a enumeração de contas é um tradeoff aceito para este produto (seção Assumptions), autorizando o pré-check que revela a existência do e-mail. Sem isso, FR-017/SC-003 seriam impossíveis de cumprir.
- Um mapa central evita duplicação (DRY, FR-016/FR-022) e garante tom/idioma consistentes; `change-password.ts` já demonstra o padrão de tratar `APIError.body.code` — o novo módulo generaliza esse padrão.

**Códigos mapeados (base)**:
- Login: e-mail inexistente (via pré-check) → sugerir cadastro; senha incorreta; `EMAIL_NOT_VERIFIED` (403) → orientar verificação.
- Signup: `USER_ALREADY_EXISTS` → e-mail já cadastrado; senha fraca / e-mail inválido → validação de campo (zod, pt-BR).
- Alteração de senha: `INVALID_PASSWORD` → senha atual incorreta; nova senha inválida/igual → validação.
- Ações protegidas: sessão expirada/não autenticado → redirecionar ao login; permissão insuficiente; registro não encontrado.

**Alternatives considered**:
- Mensagem genérica única em pt-BR ("E-mail ou senha inválidos", como hoje) — rejeitado: viola FR-017 e SC-003, que exigem especificidade.
- Manter enumeração desabilitada e não distinguir — rejeitado: contraria decisão explícita registrada na spec.

---

## R5 — Detecção e resposta de convites pendentes na área autenticada (US1)

**Decision**: No `app/(app)/layout.tsx` (ou no dashboard), detectar convites pendentes pelo e-mail do usuário logado via `getPendingInvitationsForEmail` (já existente, estendido para incluir o **nome do autor**) e apresentá-los em um `Dialog` dedicado com a mensagem padronizada e as ações Aceitar (`accept-invitation`, já existe) e Recusar (nova `reject-invitation`). Concorrência (recusa vs. cancelamento) é resolvida no servidor: ambas as actions só agem se `status === "PENDING"`; a segunda falha com mensagem específica.

**Rationale**:
- `getPendingInvitationsForEmail` e `accept-invitation` já existem; falta apenas incluir o autor no retorno, adicionar a ação de recusar e trocar o `Card` atual por um `Dialog` com as duas ações e a mensagem amigável exata da FR-005.
- A checagem `status !== "PENDING"` já está presente em `accept-invitation.ts`; replicá-la em `reject-invitation` e `cancel-invitation` satisfaz a regra "a primeira operação que efetivar vence" (clarificação da sessão 2026-08-09) sem locking artificial.

**Alternatives considered**:
- Página dedicada `/invitations` — rejeitado: a spec pede um "dialog/tela dedicada" na entrada da área autenticada; o `Dialog` sobre o dashboard é mais direto e não adiciona rota.

---

## R6 — Saudação, landing e responsividade (US5, US6, US7)

**Decision**:
- **Saudação (FR-023)**: extrair um componente `app-header.tsx` (server-friendly, recebe `name`) renderizado no `(app)/layout.tsx`, exibindo "Olá, {nome}" no topo de todas as telas internas; nome vazio cai para saudação segura ("Olá!").
- **Navegação responsiva (FR-027)**: transformar `app-sidebar` para colapsar em um `Sheet` (shadcn) acionado por um botão de menu no `app-header` em larguras pequenas; o botão de fechar do `Sheet` é o nativo (não recriar).
- **Landing (FR-024/FR-025)**: os componentes `marketing/*` já são estáticos; ajustar o hero para destacar CTAs "Entrar"/"Cadastrar"; `app/page.tsx` redireciona usuário autenticado para `/dashboard`.
- **Design/responsividade (FR-026)**: aplicar utilidades responsivas do Tailwind e tokens de tema; tabelas/cards/gráficos em containers com rolagem própria quando necessário, sem rolagem horizontal da página.

**Rationale**: Reuso máximo de componentes shadcn (`Sheet`, `Card`, `Button`) e dos componentes de marketing já existentes; mudança é de composição/estilo, não de novas capacidades. Atende SC-006, SC-007, SC-008.

**Alternatives considered**:
- Biblioteca de layout/drawer externa — rejeitado: `Sheet` do shadcn já cobre o caso (Princípio I e Restrições de Stack).

---

## Resumo de decisões

| # | Área | Decisão-chave |
|---|------|---------------|
| R1 | Modelo Invitation | `invitedById` FK (`SetNull`) + status `REJECTED`; limpeza de pendentes no `beforeDelete` |
| R2 | Exclusão de conta | `user.deleteUser` do Better Auth + reuso de `handleAdminDeparture` no hook `before` |
| R3 | Exclusão de residência | `household.delete` via cascatas existentes + reajuste de `activeHouseholdId` |
| R4 | Mensagens de erro | `lib/auth-errors.ts` central + pré-check de e-mail no login (enumeração aceita) |
| R5 | Resposta de convites | `Dialog` na entrada autenticada + nova action `reject-invitation`; concorrência via guarda `PENDING` |
| R6 | Saudação/landing/responsivo | `app-header` com saudação, `Sheet` para nav mobile, CTAs do hero, tokens de tema |
