# Prompt para o `/speckit-specify`

> Cole o bloco abaixo como argumento do `/speckit-specify` e siga o fluxo completo do Spec Kit
> (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`) em PR próprio.
> Este arquivo contém **apenas a spec ativa** (uma por vez). As próximas da fila e o detalhamento completo
> ficam em `docs/proximos-passos-melhorias.md`.
>
> Restrições da constituição (`CLAUDE.md` / `AGENTS.md`) valem para toda spec: shadcn/ui como única lib de
> componentes; cores só via tokens de `app/globals.css`; medidas em `rem`; ícones `lucide-react`; Prisma
> só em `data/`; mutações via Server Actions (`next-safe-action` + `protectedActionClient`, com `.inputSchema`);
> ESLint limpo; não rodar `npm run dev`.

---

## Spec 009 — Residências: menu, listagem e edição por residência (Média/Alta)

Reorganiza a navegação e a gestão de residências. Hoje o menu lateral concentra tudo: o
`HouseholdSwitcher` (lista de residências + botão "Criar nova residência") vive na sidebar, e o item
"Residência" leva a uma **única** página que sempre mostra o detalhe da residência **ativa**. Esta spec
move a lista e a criação para **dentro de "Residência"** e transforma essa área em: uma **página que lista
todas as residências do usuário** e, por residência, uma **página de edição** com o conteúdo que hoje está
em Residência.

Contexto atual (já verificado):

- A sidebar (`components/layout/app-sidebar.tsx`) renderiza o `HouseholdSwitcher`
  (`components/layout/household-switcher.tsx`) acima do `nav`. O switcher é um `Select` que troca a
  residência ativa (action `actions/switch-active-household.ts`) e tem a opção "Criar nova residência"
  (link para `/households/new`). O item de menu "Residência" aponta para `/households`.
- `app/(app)/households/page.tsx` mostra o detalhe da residência **ativa** (via `getActiveHousehold`):
  nome (`HouseholdNameForm`, só admin), membros (`MembersTable`), convidar/convites (só admin), sair
  (`LeaveHouseholdButton`) e zona de perigo/excluir (`DeleteHouseholdButton`, só admin).
- `data/households.ts` já expõe `getHouseholdsForUser(userId)` (id, name, role por membership),
  `getHouseholdById`, `getMembership(userId, householdId)`, além de `deleteHouseholdById` e
  `handleAdminDeparture`. `app/(onboarding)/households/new/page.tsx` cria residências e a action
  `actions/create-household.ts` já define a nova como ativa.
- O layout (`app/(app)/layout.tsx`) carrega `getHouseholdsForUser` e passa para a sidebar; o switcher
  também aparece no menu mobile (`AppSidebarMobileNav`). O `AppHeader` (`components/layout/app-header.tsx`)
  hoje não mostra qual residência está ativa.

O que a spec precisa definir:

- **Sidebar sem a lista de residências**: remover o `HouseholdSwitcher` da sidebar (desktop e mobile) em
  `components/layout/app-sidebar.tsx`. O item "Residência" permanece no `NAV_ITEMS`. Decidir se o
  `HouseholdSwitcher` é descontinuado ou reaproveitado dentro da nova página; se sair do layout, limpar as
  props/consumidores que só existiam para ele.
- **Como trocar a residência ativa após remover o switcher**: definir o novo ponto de troca. A troca passa a
  acontecer na página de listagem de residências (cada residência tem ação "Definir como ativa" quando não
  é a ativa, com indicador visual de qual é a ativa). Reutilizar `actions/switch-active-household.ts`.
- **Feedback de residência ativa no header**: com o switcher saindo do menu, o usuário não pode perder o
  contexto de qual residência está vendo. Exibir a residência ativa no `AppHeader`
  (`components/layout/app-header.tsx`), usando apenas shadcn/ui e tokens de tema.
- **Página que lista as residências (`/households`)**: passa a listar **todas** as residências do usuário
  (`getHouseholdsForUser`), com nome, papel (Admin/Membro via `Badge`), indicador de residência ativa, e
  ações por item: "Definir como ativa" e "Editar" (leva à página de edição). A residência **ativa** aparece
  **destacada/no topo** da lista. Botão/​link **"Criar nova residência"** (para `/households/new`) mora no
  cabeçalho desta página — não mais no menu. Tratar o **estado de primeiro acesso / única residência** para
  não gerar fricção (ex.: quando o usuário só tem uma residência). Usar apenas componentes shadcn/ui e
  tokens de tema; medidas em `rem`; ícones `lucide-react`; botões só-ícone com `aria-label`/`sr-only`.
- **Página de edição por residência (`/households/[id]`)**: recebe o conteúdo que hoje está em Residência
  (nome, membros, convidar, convites, sair, zona de perigo/excluir), **mantendo a lógica atual sem
  regressão**. A diferença é que o alvo é a residência da **rota** (`[id]`), não a ativa.
- **Autorização por residência (não pela ativa)**: validar que o usuário é membro de `[id]` e derivar o
  papel **daquela** residência via `getMembership`/`getHouseholdsForUser` (nunca assumir o papel da
  residência ativa). Um usuário só pode **editar nome, convidar/gerenciar convites e excluir** residências
  em que é **ADMIN**; qualquer membro pode **sair**. Se não for membro de `[id]`, negar acesso. As Server
  Actions envolvidas (`update-household`, `invite-member`, `delete-household`, `leave-household`, etc.) já
  devem revalidar as permissões — confirmar e ajustar para operar por `householdId` explícito.
- **Leitura via `data/`**: reaproveitar/estender as funções de `data/households.ts` e `data/memberships.ts`
  (Prisma nunca é chamado de componente). Se necessário, adicionar um leitor que traga o detalhe de uma
  residência já com o papel do usuário.
- **Revalidação e navegação**: garantir `revalidatePath` corretos após trocar ativa, editar e excluir; ao
  excluir a residência aberta, voltar para a lista `/households`. Manter o comportamento de reatribuição de
  residência ativa que já existe em `deleteHouseholdById`.

Fora de escopo: mudar o modelo de dados (sem migration); papéis além de ADMIN/MEMBRO; transferência de
titularidade/admin manual; multi-seleção de residências; qualquer alteração no Dashboard (fica na spec 010,
detalhada em `docs/proximos-passos-melhorias.md`).
