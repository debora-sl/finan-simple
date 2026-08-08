# Phase 0 — Research: Gestão de Residências

Documento consolida as decisões técnicas que resolvem as incógnitas do Technical Context. Não há
`NEEDS CLARIFICATION` em aberto — a spec e as Assumptions definem o comportamento; abaixo ficam as
escolhas de implementação.

## 1. Persistência da "casa ativa"

- **Decisão**: Armazenar `activeHouseholdId` (nullable) no modelo `User`. A casa ativa padrão é a
  última selecionada; na ausência, a residência disponível mais antiga (por `Membership.joinedAt`).
- **Rationale**: A Assumption da spec exige persistir a última seleção do usuário entre sessões —
  um cookie não sobrevive de forma confiável a múltiplos dispositivos nem é fonte única de verdade.
  Guardar no `User` mantém a resolução server-side e simples (SSR nas páginas de `(app)`).
- **Alternativas rejeitadas**: Cookie/localStorage (não persiste por conta, complica SSR);
  parâmetro de rota `/h/[id]/...` (reescreveria todas as rotas existentes — custo desproporcional).

## 2. Resolução da casa ativa e redirecionamento (FR-004, FR-008)

- **Decisão**: Helper `lib/active-household.ts` — `getActiveHousehold()` cacheado (`react.cache`),
  que verifica sessão (reusa `verifySession`), lê `User.activeHouseholdId`, valida a membership e
  retorna `{ userId, householdId, role }`. Se o usuário não tem nenhuma residência, redireciona
  para `/households/new`. Se o `activeHouseholdId` aponta para residência inexistente/removida,
  seleciona a mais antiga disponível (ou redireciona para criação).
- **Rationale**: Centraliza a autorização de pertencimento e a lógica de fallback num único ponto,
  seguindo o padrão de `lib/dal.ts` (`verifySession`) e o Princípio IV (DRY).
- **Alternativas rejeitadas**: Repetir a lógica em cada página; usar `middleware.ts` (não tem
  acesso trivial ao papel/membership sem consulta ao banco na edge — mantido fora do escopo).

## 3. Vinculação automática de convites no cadastro (FR-016)

- **Decisão**: Usar `databaseHooks.user.create.after` do Better Auth em `lib/auth.ts`. Após criar o
  usuário, buscar `Invitation` com `email` correspondente e `status = PENDING`; para cada uma, criar
  `Membership` (role MEMBER), marcar o convite como `ACCEPTED` e definir `User.activeHouseholdId`
  quando ainda nulo. Idempotente contra associação duplicada (FR-022).
- **Rationale**: Confirmado via Context7 — `user.create.after` recebe o objeto completo do usuário
  (incl. `email`) após a persistência, ideal para provisionamento pós-cadastro sem alterar o fluxo
  de signup (Assumption: a feature só estende o login/cadastro).
- **Alternativas rejeitadas**: Interceptar a rota de signup manualmente (frágil, duplica lógica do
  Better Auth); job/polling (excesso de engenharia para correspondência exata de e-mail).

## 4. Sucessão de administração e remoção da residência (FR-019, FR-020)

- **Decisão**: Encapsular a regra numa função reutilizável (ex.: `data/households.ts` →
  `handleAdminDeparture(householdId, leavingUserId)`), chamada tanto pela action `leave-household`
  quanto pelo hook `databaseHooks.user.delete.before` (cancelamento de cadastro). Em transação:
  se o usuário que sai é Administrador e há outro membro ativo, promover o de menor `joinedAt` a
  ADMIN e remover a membership do que sai; se for o único integrante, apagar a residência (cascata
  remove despesas/categorias). Executar dentro de `prisma.$transaction` para nunca haver intervalo
  com zero ou dois Administradores (SC-004, edge case).
- **Rationale**: Única fonte de verdade para saída voluntária e exclusão de conta (DRY). Transação
  garante a invariante "exatamente um Administrador".
- **Alternativas rejeitadas**: Lógica duplicada na action e no hook; constraint de banco (SQLite não
  expressa "exatamente um ADMIN por household" declarativamente).

## 5. Migração de dados existentes (Assumption de migração)

- **Decisão**: Migração Prisma que (a) cria as tabelas `household`, `membership`, `invitation`;
  (b) adiciona `householdId` a `expense`/`category` e `activeHouseholdId` a `user`; (c) num passo de
  dados, cria uma residência padrão por usuário existente ("Minha Casa"), uma `Membership` ADMIN,
  repointa as despesas/categorias daquele usuário para a residência, e define `activeHouseholdId`;
  (d) torna `householdId` obrigatório e remove `userId` de `expense`/`category`.
- **Rationale**: Preserva os dados atuais (Assumption). SQLite exige recriação de tabela para
  dropar coluna — Prisma gera isso automaticamente; o passo de dados vai numa migração dedicada.
- **Alternativas rejeitadas**: Manter `userId` além de `householdId` (redundância que viola FR-005 e
  DRY); descartar dados existentes (inaceitável).

## 6. Papéis e unicidade de vínculo (FR-003, FR-022)

- **Decisão**: `Membership.role` como `String` ("ADMIN" | "MEMBER") — SQLite não tem enum nativo;
  validado por zod nas actions. `@@unique([userId, householdId])` garante não-duplicidade.
- **Rationale**: Alinha com o schema atual (que já usa `String` e `@@unique`). Simples e suficiente.
- **Alternativas rejeitadas**: Enum Prisma (não suportado no provider sqlite); tabela de papéis
  separada (excesso para dois papéis fixos).

## 7. Landing estática para visitantes (FR-021, SC-007, US5)

- **Decisão**: `app/page.tsx` renderiza uma landing 100% estática (componentes em
  `components/marketing/`) quando não há sessão; usuários autenticados são redirecionados para
  `/dashboard`. Nenhuma função de `data/` é chamada nesse caminho. Imagens via `next/image`.
- **Rationale**: Cumpre SC-007 (zero acesso ao banco) e reaproveita o token de tema e componentes
  `Card` do shadcn para exemplos ilustrativos.
- **Alternativas rejeitadas**: Buscar dados "de exemplo" do banco (viola SC-007); rota `/landing`
  separada (a raiz é o ponto natural de entrada do visitante).

## 8. Autorização por papel nas Server Actions (FR-010–FR-013, FR-017, FR-018)

- **Decisão**: Cada action protegida resolve a membership do usuário na residência-alvo e valida o
  papel exigido antes de mutar. Ações de Membro (CRUD de despesa/categoria) exigem apenas
  pertencimento; ações de gestão (nome, convites, membros) exigem `role = ADMIN`. Falha lança erro
  tratado por `handleServerError`.
- **Rationale**: Segue o Princípio III (autorização conforme o usuário em toda action) e SC-006.
- **Alternativas rejeitadas**: Confiar apenas em checagem de UI (inseguro); um segundo action
  client "adminActionClient" (possível melhoria futura; não necessário agora, mantém simplicidade).

## Resumo das decisões

| Tema | Decisão |
|------|---------|
| Casa ativa | `User.activeHouseholdId`, fallback pela membership mais antiga |
| Resolução/guarda | Helper `lib/active-household.ts` cacheado, redireciona se sem residência |
| Convite no signup | `databaseHooks.user.create.after` |
| Sucessão/exclusão | Função transacional única + `databaseHooks.user.delete.before` |
| Migração | Migração Prisma com passo de dados (residência padrão por usuário) |
| Papéis | `String` ADMIN/MEMBER + `@@unique([userId, householdId])` |
| Landing | `app/page.tsx` estática, sem banco |
| Autorização | Checagem de papel/pertencimento em cada action |
