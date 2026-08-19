# Feature Specification: Residências — menu, listagem e edição por residência

**Feature Branch**: `009-household-navigation`

**Created**: 2026-08-18

**Status**: Draft

**Input**: User description: "Spec 009 — Residências: menu, listagem e edição por residência (Média/Alta). Reorganiza a navegação e a gestão de residências: move a lista e a criação de residências para dentro de 'Residência', transformando essa área em uma página que lista todas as residências do usuário e, por residência, uma página de edição com o conteúdo que hoje está na página de Residência. O switcher sai da sidebar; a residência ativa passa a aparecer no header; a troca de residência ativa acontece na listagem."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listar todas as residências do usuário (Priority: P1)

Um usuário que participa de uma ou mais residências abre o item "Residência" no menu e vê uma
página que lista **todas** as residências das quais é membro. Cada item mostra o nome, o papel do
usuário naquela residência (Admin ou Membro) e um indicador de qual é a residência ativa. A
residência ativa aparece destacada e no topo da lista. A partir desta página o usuário pode criar
uma nova residência por um botão/link no cabeçalho.

**Why this priority**: É a base da reorganização — sem a página de listagem, não há de onde trocar a
residência ativa nem de onde acessar a edição por residência. Entrega, sozinha, um ponto único de
gestão de residências e viabiliza remover o switcher da sidebar.

**Independent Test**: Com um usuário membro de duas ou mais residências, abrir "Residência" e
confirmar que todas aparecem com nome, papel e indicador de ativa, com a ativa destacada no topo, e
que o botão "Criar nova residência" está presente no cabeçalho.

**Acceptance Scenarios**:

1. **Given** um usuário membro de várias residências, **When** ele abre "Residência", **Then** a
   página lista todas as suas residências com nome e papel (Admin/Membro).
2. **Given** a lista de residências, **When** ela é exibida, **Then** a residência ativa aparece
   destacada e posicionada no topo, com indicador visual de "ativa".
3. **Given** a página de listagem, **When** o usuário procura como criar uma residência, **Then** o
   botão/link "Criar nova residência" está no cabeçalho da página (e não mais no menu lateral).
4. **Given** um usuário que participa de apenas uma residência, **When** ele abre "Residência",
   **Then** a lista é exibida sem fricção (sem ação redundante de "definir como ativa" para a única
   residência, que já é a ativa).

---

### User Story 2 - Trocar a residência ativa a partir da listagem (Priority: P1)

Como o switcher deixa de existir na sidebar, o usuário troca a residência ativa diretamente na
página de listagem: cada residência que não é a ativa oferece a ação "Definir como ativa". Ao
acionar, aquela residência passa a ser o contexto ativo em toda a aplicação, e a lista reflete a
mudança (novo destaque e reordenação).

**Why this priority**: A troca de contexto é função essencial que hoje mora no switcher; sem um novo
ponto de troca, remover o switcher regrediria a experiência. Precisa acompanhar a US1.

**Independent Test**: Com duas residências, acionar "Definir como ativa" na que não está ativa e
confirmar que o contexto ativo muda (refletido na listagem e no header) e que a ação some para a
residência que passou a ser a ativa.

**Acceptance Scenarios**:

1. **Given** uma residência que não é a ativa, **When** o usuário aciona "Definir como ativa",
   **Then** ela se torna a residência ativa e a lista se atualiza com o novo destaque/ordem.
2. **Given** a residência atualmente ativa, **When** a lista é exibida, **Then** ela não oferece a
   ação "Definir como ativa" (apenas o indicador de ativa).
3. **Given** um usuário que tenta definir como ativa uma residência da qual não é membro, **When** a
   ação é submetida, **Then** ela é rejeitada por falta de autorização.

---

### User Story 3 - Editar uma residência específica pela sua página (Priority: P1)

A partir da listagem, o usuário abre a página de edição de uma residência específica. Essa página
reúne o conteúdo que hoje está na página "Residência" — nome, membros, convidar, convites, sair e
zona de perigo/excluir —, porém sempre operando sobre a residência da rota (não sobre a ativa). As
permissões são derivadas do papel do usuário **naquela** residência: apenas ADMIN pode editar nome,
convidar/gerenciar convites e excluir; qualquer membro pode sair.

**Why this priority**: Preserva a capacidade de gestão que existe hoje, agora desacoplada da
residência ativa, permitindo administrar qualquer residência sem precisar trocar o contexto ativo
antes. É requisito para a reorganização não causar regressão.

**Independent Test**: Abrir a edição de uma residência que **não** é a ativa e confirmar que todas as
operações (nome, membros, convites, sair, excluir) atuam sobre a residência da rota, respeitando o
papel do usuário nela.

**Acceptance Scenarios**:

1. **Given** um usuário ADMIN de uma residência, **When** ele abre a edição dessa residência (mesmo
   que não seja a ativa), **Then** ele pode alterar o nome, gerenciar membros/convites e excluir a
   residência da rota.
2. **Given** um usuário MEMBRO (não admin) de uma residência, **When** ele abre a edição dessa
   residência, **Then** as ações de admin (editar nome, convidar/gerenciar convites, excluir) não
   ficam disponíveis, mas a ação de sair fica.
3. **Given** um usuário que **não** é membro da residência da rota, **When** ele tenta acessar a
   página de edição, **Then** o acesso é negado.
4. **Given** um ADMIN na edição de uma residência que não é a ativa, **When** ele altera o nome e
   salva, **Then** a mudança é persistida naquela residência específica, sem afetar a residência
   ativa.
5. **Given** um usuário na página de edição de uma residência, **When** ele exclui essa residência,
   **Then** ele é redirecionado para a lista de residências e a residência deixa de aparecer.

---

### User Story 4 - Saber qual residência está ativa pelo header (Priority: P2)

Com o switcher fora do menu, o usuário não pode perder o contexto de qual residência está vendo. O
cabeçalho da aplicação passa a exibir a residência ativa de forma persistente em todas as telas.

**Why this priority**: Evita perda de contexto após remover o switcher; é um complemento importante
de orientação, mas não bloqueia a listagem, a troca ou a edição.

**Independent Test**: Navegar por diferentes telas e confirmar que o header mostra sempre o nome da
residência ativa, e que ele reflete a troca feita na listagem.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado com residência ativa, **When** ele navega por qualquer tela da
   área logada, **Then** o header exibe o nome da residência ativa.
2. **Given** o usuário troca a residência ativa na listagem, **When** a navegação atualiza, **Then**
   o header passa a exibir a nova residência ativa.

---

### Edge Cases

- Como fica a **sidebar** (desktop e mobile) após a remoção do switcher? A lista de residências e o
  botão "Criar nova residência" deixam de aparecer no menu; o item "Residência" permanece e leva à
  nova página de listagem.
- O que acontece quando o usuário tem **apenas uma residência**? A listagem exibe essa residência sem
  ações redundantes de troca (ela já é a ativa) e mantém acessíveis a edição e a criação de nova
  residência.
- O que acontece ao **excluir a residência que está aberta** na página de edição? O usuário é levado
  de volta para a lista `/households` e a reatribuição de residência ativa existente é preservada
  (se a excluída era a ativa, outra residência do usuário assume como ativa).
- O que acontece quando um **ADMIN sai** de uma residência que ainda tem outros membros? A
  transferência de administração já existente é preservada (outro membro assume ADMIN) e o usuário é
  removido; se era o último membro, a residência é removida.
- Como o sistema trata o acesso à edição de uma residência por **id inexistente** ou da qual o
  usuário **não é membro**? O acesso é negado.
- O que acontece se, após remover o switcher, o usuário chegar por um **link antigo** para criar
  residência? O fluxo de criação continua acessível (a criação de residência não é removida, apenas
  seu ponto de entrada muda para o cabeçalho da listagem).
- O que acontece quando o usuário fica **sem nenhuma residência** (ao sair/excluir a última)? A página
  `/households` exibe um estado vazio com o CTA "Criar nova residência" e o header mostra um rótulo
  neutro (ex.: "Nenhuma residência"), sem residência ativa, sem bloquear a área logada.

## Clarifications

### Session 2026-08-18

- Q: Quando o usuário fica sem nenhuma residência (ao sair/excluir a última), o que a página `/households` e o header devem mostrar? → A: Estado vazio com CTA "Criar nova residência"; header com rótulo neutro (ex.: "Nenhuma residência") sem residência ativa.
- Q: Como ordenar as residências não-ativas na listagem? → A: Alfabética por nome (ativa no topo; demais A→Z).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A página "Residência" (`/households`) MUST listar **todas** as residências das quais o
  usuário autenticado é membro, e não apenas a residência ativa.
- **FR-002**: Cada item da lista MUST exibir o **nome** da residência e o **papel** do usuário naquela
  residência (Admin ou Membro).
- **FR-003**: A lista MUST identificar visualmente qual é a **residência ativa** e MUST exibi-la
  **destacada e no topo** da lista. As demais residências MUST ser ordenadas **alfabeticamente por
  nome** (A→Z).
- **FR-004**: Cada residência que **não** é a ativa MUST oferecer a ação "Definir como ativa"; a
  residência ativa MUST NOT oferecer essa ação.
- **FR-005**: Ao acionar "Definir como ativa", o sistema MUST tornar aquela residência o contexto
  ativo do usuário e MUST refletir a mudança na listagem (destaque e reordenação) e no header.
- **FR-006**: Cada item da lista MUST oferecer a ação "Editar", que leva à página de edição da
  respectiva residência.
- **FR-007**: O botão/link "Criar nova residência" MUST residir no **cabeçalho da página de
  listagem** e MUST NOT aparecer mais no menu lateral (desktop e mobile).
- **FR-008**: O sistema MUST remover a lista de residências (switcher) da **sidebar** tanto no desktop
  quanto no menu mobile, mantendo o item de menu "Residência".
- **FR-009**: O **header** da área logada MUST exibir a residência ativa de forma persistente em todas
  as telas, atualizando quando a residência ativa muda.
- **FR-010**: A página de edição por residência (`/households/[id]`) MUST reunir o conteúdo hoje
  existente na página de Residência: alteração de **nome**, listagem/gestão de **membros**,
  **convidar**, **convites**, **sair** e **zona de perigo/excluir**.
- **FR-011**: Todas as operações da página de edição MUST atuar sobre a residência da **rota**
  (`[id]`), nunca sobre a residência ativa.
- **FR-012**: O sistema MUST derivar o papel do usuário a partir **daquela** residência (`[id]`) e
  MUST NOT assumir o papel da residência ativa.
- **FR-013**: Apenas usuários com papel **ADMIN** na residência da rota MUST poder editar o nome,
  convidar/gerenciar convites e excluir a residência; **qualquer membro** MUST poder sair dela.
- **FR-014**: Se o usuário **não** for membro da residência da rota (`[id]`), o sistema MUST negar o
  acesso à página de edição e às respectivas operações.
- **FR-015**: As operações de servidor envolvidas MUST revalidar autenticação e autorização por
  `householdId` explícito da rota, e não pela residência ativa.
- **FR-016**: Ao **excluir** a residência aberta, o sistema MUST redirecionar o usuário para a lista
  `/households` e MUST preservar a reatribuição automática de residência ativa já existente quando a
  excluída era a ativa.
- **FR-017**: O sistema MUST atualizar as telas afetadas após trocar a residência ativa, editar ou
  excluir uma residência, de modo que o usuário veja o estado atualizado sem recarregar manualmente.
- **FR-018**: O acesso a dados das residências (listagem, detalhe com papel, pertencimento) MUST ser
  feito pela camada de dados, sem chamada direta de banco a partir de componentes.
- **FR-019**: O tratamento do estado de **primeiro acesso / única residência** MUST evitar fricção,
  não exigindo ações redundantes para a única residência (que já é a ativa).
- **FR-020**: A reorganização MUST NOT causar regressão nas capacidades atuais de gestão de
  residências (nome, membros, convites, sair, excluir) — apenas muda o alvo (residência da rota) e o
  ponto de acesso (listagem/edição em vez do switcher).
- **FR-021**: Quando o usuário **não** tiver nenhuma residência, a página `/households` MUST exibir um
  **estado vazio** com o CTA "Criar nova residência", e o **header** MUST exibir um rótulo neutro (ex.:
  "Nenhuma residência") sem residência ativa selecionada, sem bloquear o acesso à área logada. A
  leitura da residência ativa usada pela listagem e pelo header MUST tolerar ausência (`null`) e MUST
  NOT redirecionar nem reatribuir automaticamente a residência ativa nesse cenário.

### Key Entities *(include if feature involves data)*

- **Residência (Household)**: agrupamento ao qual o usuário pertence e sobre o qual as despesas e
  demais dados são organizados. Tem nome e um conjunto de membros. Esta feature não altera seu modelo
  de dados.
- **Vínculo/Participação (Membership)**: associa um usuário a uma residência com um **papel** (ADMIN
  ou MEMBRO). O papel usado nas telas de listagem e edição MUST ser o vínculo com a residência em
  questão (a da rota), não com a ativa.
- **Residência ativa (contexto do usuário)**: referência, por usuário, a qual residência é o contexto
  atual. É trocada na listagem e exibida no header; sua reatribuição ao excluir é preservada. Pode
  estar **ausente** quando o usuário não possui nenhuma residência (header exibe rótulo neutro).
- **Convite (Invite)**: convite para ingressar em uma residência específica, gerenciável apenas por
  ADMIN daquela residência. Comportamento preservado, agora operando por `householdId` da rota.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das residências das quais o usuário é membro aparecem na página "Residência", com
  nome e papel corretos.
- **SC-002**: A residência ativa é identificável imediatamente na lista (destacada e no topo) em 100%
  dos casos com pelo menos uma residência.
- **SC-003**: Trocar a residência ativa pela listagem reflete-se na própria lista e no header sem que
  o usuário precise recarregar manualmente.
- **SC-004**: 100% das operações de edição (nome, membros, convites, sair, excluir) atuam sobre a
  residência selecionada na rota, sem afetar a residência ativa quando esta é diferente.
- **SC-005**: 100% das tentativas de acessar ou operar sobre uma residência da qual o usuário não é
  membro são negadas.
- **SC-006**: 100% das ações restritas a ADMIN (editar nome, convidar/gerenciar convites, excluir) são
  bloqueadas para usuários que são apenas MEMBRO naquela residência.
- **SC-007**: A residência ativa é visível no header em 100% das telas da área logada.
- **SC-008**: Nenhuma capacidade de gestão de residências existente antes da feature deixa de
  funcionar (sem regressão).
- **SC-009**: O usuário consegue trocar a residência ativa a partir da listagem em menos de 15
  segundos, sem passar pelo menu lateral.

## Assumptions

- O modelo de dados de residências e vínculos **não muda**; não há migration nesta feature.
- Os papéis permanecem restritos a **ADMIN** e **MEMBRO**; não há novos papéis.
- A troca de residência ativa reutiliza o mecanismo já existente de "definir residência ativa".
- A criação de residência reutiliza o fluxo atual de criação (que já define a nova como ativa); apenas
  o ponto de entrada muda para o cabeçalho da listagem.
- As funções de leitura da camada de dados existentes (listagem por usuário, detalhe por id,
  vínculo/pertencimento) são reaproveitadas e, se necessário, estendidas para trazer o papel do
  usuário junto ao detalhe da residência.
- Para o estado vazio e o rótulo neutro do header (FR-021), a listagem e o layout usam uma leitura
  **tolerante a nulo** da residência ativa (lê `activeHouseholdId` diretamente, sem redirect nem
  reatribuição), distinta de `getActiveHousehold()` — que redireciona quando não há residências e é
  mantida para as demais telas fora do escopo desta feature.
- A reatribuição automática de residência ativa ao excluir a residência ativa já existe e é
  preservada.
- O header e as telas de listagem/edição usam exclusivamente componentes shadcn/ui e tokens de tema;
  botões só-ícone têm rótulo acessível.

## Out of Scope

- Alterações no **modelo de dados** (sem migration).
- Papéis além de **ADMIN/MEMBRO**.
- Transferência manual de titularidade/administração (a transferência automática ao sair de admin já
  existente é preservada, mas não há nova UI de transferência).
- Multi-seleção de residências.
- Qualquer alteração no **Dashboard** (tratada na spec 010).
