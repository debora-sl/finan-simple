# Phase 0 — Research: Residências (navegação, listagem, edição por residência)

Nenhum item ficou marcado como NEEDS CLARIFICATION: o spec e a base de código atual determinam as
decisões. Abaixo, cada decisão relevante com racional e alternativas consideradas.

## 1. Rota de edição por residência

- **Decision**: Criar segmento dinâmico `app/(app)/households/[id]/page.tsx` como Server Component
  assíncrono, lendo `params: Promise<{ id: string }>` e usando `const { id } = await params`.
- **Rationale**: Convenção obrigatória do Next.js 16 (App Router) — `params` é assíncrono
  (`node_modules/next/dist/docs/01-app/.../dynamic-routes.md`). Mantém `/households` livre para a
  listagem e desacopla a edição da residência ativa (FR-011).
- **Alternatives considered**:
  - Query string `/households?id=...` — rejeitado: menos semântico, dificulta guard de acesso e
    revalidação por rota.
  - Manter tudo em `/households` com estado de UI — rejeitado: viola o objetivo de "página de edição
    por residência" e mistura contextos.

## 2. Guard de acesso na página `[id]`

- **Decision**: A página busca `getHouseholdForUserWithRole(userId, id)`; se retornar `null`
  (não membro ou id inexistente), chamar `notFound()`/redirect e negar acesso (FR-014, SC-005).
  O papel exibido/aplicado vem **dessa** consulta (FR-012).
- **Rationale**: Centraliza pertencimento + papel numa única leitura da camada de dados, evitando
  duplicar `getHouseholdById` + `getMembership` na página e evitando vazar Prisma para a UI (FR-018).
- **Alternatives considered**: Combinar `getHouseholdById` + `getMembership` na página — funciona, mas
  duplica chamadas e lógica de "não membro"; preferimos uma função de dados coesa e reutilizável.

## 3. Escopo das operações por `householdId` da rota

- **Decision**: Reusar as actions que já recebem `householdId`/`membershipId` explícitos
  (`switchActiveHousehold`, `updateHousehold`, `deleteHousehold`, `leaveHousehold`, `removeMember`).
  Ajustar **apenas** `inviteMember`, que hoje deriva de `getActiveHousehold()`, para receber
  `householdId` no input e validar papel ADMIN **naquela** residência.
- **Rationale**: Cumpre FR-011/FR-015 com mudança mínima. `inviteMember` é a única action acoplada à
  residência ativa; as demais já revalidam autorização por `householdId` explícito.
- **Alternatives considered**: Reescrever todas as actions — desnecessário e arriscado (regressão),
  contraria DRY e o princípio de mudança mínima.

## 4. Listagem: destaque, ordenação e caso de residência única

- **Decision**: `getHouseholdsForUser` já retorna `{ id, name, role }`. Na página de listagem,
  ordenar colocando a residência ativa no topo e marcá-la com `Badge` "Ativa"; itens não ativos
  exibem "Definir como ativa" + "Editar"; o ativo exibe apenas "Editar" (FR-003, FR-004). Com uma
  única residência, ela é a ativa e não mostra "Definir como ativa" (FR-019).
- **Rationale**: Reaproveita a leitura existente; ordenação/badge são responsabilidade de
  apresentação. Evita ação redundante no caso de residência única.
- **Alternatives considered**: Ordenar no banco por "ativa" — rejeitado: o `activeHouseholdId` é do
  usuário, não da residência; ordenar em memória é trivial e mais claro.

## 5. Header com residência ativa persistente

- **Decision**: `getActiveHousehold()` já expõe `householdId`; o `layout.tsx` busca o nome da
  residência ativa (via `getHouseholdById` ou reutilizando a lista já carregada) e passa ao
  `AppHeader`, que exibe o nome de forma persistente em todas as telas (FR-009, SC-007).
- **Rationale**: O layout já carrega `households` e `householdId`; derivar o nome ativo dali evita
  nova consulta. Como o header é renderizado pelo layout do grupo `(app)`, aparece em todas as telas.
- **Alternatives considered**: Client component lendo contexto global — desnecessário; o dado já está
  disponível no Server Component de layout e revalida com `router.refresh()`.

## 6. Remoção do switcher e ponto de criação

- **Decision**: Remover `HouseholdSwitcher` de `SidebarContent` (desktop e mobile) e o arquivo
  `household-switcher.tsx`. Mover "Criar nova residência" para o cabeçalho da listagem, apontando
  para o fluxo existente `/households/new` (FR-007, FR-008). O item de menu "Residência" permanece.
- **Rationale**: O fluxo de criação (`/households/new` + `createHousehold`) permanece intacto; só o
  ponto de entrada muda. Links antigos para criar continuam válidos (Edge Case do spec).
- **Alternatives considered**: Manter switcher e apenas duplicar na listagem — rejeitado: o spec exige
  remoção do switcher da sidebar (FR-008) para não regredir a experiência com dois pontos de troca.

## 7. Atualização de tela sem reload (revalidação)

- **Decision**: Manter o padrão atual: actions chamam `revalidatePath` das rotas afetadas e os
  componentes cliente usam `router.refresh()`/`router.push()` no `onSuccess` do `useAction`
  (FR-017). Incluir `revalidatePath("/households")` onde faltar e revalidar o header via layout.
- **Rationale**: Consistente com o código existente (ex.: `HouseholdSwitcher`, botões de excluir/sair)
  e com `next-safe-action` + `useAction`.
- **Alternatives considered**: Estado otimista no cliente — desnecessário para a escala; server
  revalidation é mais simples e já adotado.

## 8. Exclusão a partir da edição `[id]`

- **Decision**: Após excluir, redirecionar para `/households` (não mais `/dashboard`) e preservar a
  reatribuição automática de residência ativa já existente em `deleteHouseholdById` (FR-016).
- **Rationale**: A lista é o novo "hub" de residências; a reatribuição já é feita na camada de dados
  e não muda.
- **Alternatives considered**: Redirecionar para dashboard — rejeitado pelo spec (FR-016 exige lista).
