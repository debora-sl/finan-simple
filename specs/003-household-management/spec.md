# Feature Specification: Gestão de Residências (Households)

**Feature Branch**: `003-household-management`

**Created**: 2026-08-08

**Status**: Draft

**Input**: User description: "Gestão de residências (casas) com múltiplos usuários no controle financeiro. Organizar o sistema financeiro por residências, onde todo dado financeiro pertence à residência (não ao usuário), com papéis de Administrador e Membro, convites por e-mail, múltiplas residências por usuário e isolamento de dados."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Primeira residência e isolamento de dados (Priority: P1)

Um usuário recém-cadastrado, ao acessar o sistema pela primeira vez sem possuir nenhuma
residência, é direcionado a criar uma informando apenas o nome. Ao criar, ele se torna
Administrador dessa residência e passa a poder lançar despesas e categorias, que ficam
vinculadas àquela residência — não ao usuário.

**Why this priority**: É o pré-requisito de todo o restante. Sem uma residência ativa, o
usuário não consegue registrar nenhum dado financeiro. Entrega o menor produto viável:
controle financeiro isolado por residência para um único usuário.

**Independent Test**: Cadastrar um novo usuário, verificar que ele é direcionado à criação de
residência, criar "Casa Mãe", confirmar que ele vira Administrador e que uma despesa e uma
categoria criadas ficam vinculadas a "Casa Mãe" e não aparecem para usuários de outras
residências.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado sem nenhuma residência, **When** ele acessa a área
   financeira, **Then** o sistema o direciona para a criação de uma residência antes de
   permitir lançar despesas.
2. **Given** um usuário na tela de criação de residência, **When** ele informa o nome e
   confirma, **Then** a residência é criada e ele é registrado automaticamente como
   Administrador dela.
3. **Given** um usuário Administrador de uma residência, **When** ele cria uma despesa ou
   categoria, **Then** o registro é vinculado à residência ativa.
4. **Given** duas residências distintas com dados próprios, **When** um usuário consulta seus
   dados, **Then** ele vê apenas as despesas e categorias da residência à qual pertence.

---

### User Story 2 - Convidar membros e colaborar (Priority: P2)

O Administrador de uma residência convida outras pessoas por e-mail para colaborar no controle
financeiro da família. Quem aceita passa a ser Membro e pode criar, editar e excluir despesas e
categorias da residência — inclusive as criadas por outros membros. O Administrador pode
cancelar convites pendentes e remover membros existentes.

**Why this priority**: A colaboração familiar é o principal valor do produto. Sem convites, cada
residência fica limitada a um único usuário, reduzindo a proposta a um controle individual.

**Independent Test**: Como Administrador, convidar por e-mail um usuário já cadastrado; como o
convidado, aceitar e confirmar acesso às despesas e categorias da residência; editar uma
despesa criada pelo Administrador; e, como Administrador, remover o membro e cancelar um convite
pendente.

**Acceptance Scenarios**:

1. **Given** um Administrador em sua residência, **When** ele convida um e-mail já cadastrado na
   plataforma, **Then** um convite pendente é criado para aquele e-mail.
2. **Given** um convite pendente para um usuário já cadastrado, **When** o usuário aceita o
   convite, **Then** ele passa a ser Membro da residência e enxerga seus dados financeiros.
3. **Given** um e-mail convidado que ainda não possui conta, **When** a pessoa se cadastra na
   plataforma com aquele e-mail, **Then** ela é vinculada automaticamente como Membro da
   residência que a convidou.
4. **Given** um Membro de uma residência, **When** ele edita ou exclui uma despesa ou categoria
   criada por outro usuário da mesma residência, **Then** a operação é concluída com sucesso.
5. **Given** um Administrador com um convite pendente, **When** ele cancela o convite, **Then** o
   convite deixa de ser válido e não pode mais ser aceito.
6. **Given** um Administrador com um Membro na residência, **When** ele remove o Membro,
   **Then** o Membro perde o acesso aos dados daquela residência.

---

### User Story 3 - Múltiplas residências e casa ativa (Priority: P2)

Um usuário pode pertencer e/ou administrar várias residências ao mesmo tempo (ex.: "Casa Mãe",
"Apartamento", "Fazenda"). Ele usa um seletor de "casa ativa" para alternar entre elas, e todos
os dados exibidos (dashboard, despesas, categorias) refletem a residência selecionada.

**Why this priority**: Habilita o cenário real de quem participa de mais de uma residência,
garantindo que os dados nunca se misturem entre casas. Depende da existência de residências
(US1) mas é independente de convites (US2).

**Independent Test**: Com um usuário que pertence a duas residências, alternar a casa ativa pelo
seletor e confirmar que o dashboard, as despesas e as categorias mudam para refletir apenas a
residência selecionada.

**Acceptance Scenarios**:

1. **Given** um usuário que pertence a duas ou mais residências, **When** ele abre o seletor de
   residências, **Then** todas as residências às quais pertence são listadas.
2. **Given** um usuário com uma casa ativa selecionada, **When** ele troca a casa ativa,
   **Then** o dashboard, as despesas e as categorias passam a refletir a nova residência.
3. **Given** um usuário na residência A, **When** ele cria uma despesa, **Then** ela é vinculada
   à residência A e não aparece quando a residência B está ativa.

---

### User Story 4 - Papéis, permissões e sucessão de administração (Priority: P3)

Cada residência tem exatamente um Administrador. O Administrador pode editar o nome da residência
e gerenciar convites e membros, além de todas as ações de um Membro; o Membro não pode editar o
nome nem gerenciar convites/membros. Quando o Administrador sai da residência ou cancela seu
cadastro, a administração é transferida automaticamente para o membro ativo mais antigo; se ele
for o único integrante, a residência e todos os seus dados são removidos.

**Why this priority**: Garante governança e continuidade da residência ao longo do tempo. É
essencial para robustez, mas as regras de sucessão só se manifestam em eventos menos frequentes
(saída/cancelamento do Administrador).

**Independent Test**: Como Membro, tentar editar o nome da residência e gerenciar membros e
confirmar que a ação é bloqueada; como Administrador de uma residência com outros membros,
sair e confirmar que a administração passou ao membro mais antigo; como Administrador único de
uma residência, sair e confirmar que a residência e seus dados foram removidos.

**Acceptance Scenarios**:

1. **Given** um Membro (não Administrador), **When** ele tenta editar o nome da residência ou
   gerenciar convites/membros, **Then** a ação é negada.
2. **Given** um Administrador, **When** ele edita o nome da residência, **Then** o novo nome é
   salvo e refletido para todos os integrantes.
3. **Given** um Administrador de uma residência com pelo menos um outro membro ativo, **When**
   ele sai da residência ou cancela seu cadastro, **Then** a administração é transferida
   automaticamente ao membro ativo que ingressou há mais tempo.
4. **Given** um Administrador que é o único integrante da residência, **When** ele sai da
   residência ou cancela seu cadastro, **Then** a residência e todos os seus dados (despesas e
   categorias) são removidos.

---

### User Story 5 - Página inicial ilustrativa (Priority: P3)

Um visitante não autenticado, ao acessar o sistema, vê uma página inicial (landing) com exemplos
ILUSTRATIVOS e ESTÁTICOS de dashboard, categorias e resumos financeiros, cujo objetivo é
demonstrar o produto e incentivar o cadastro. Esses exemplos não representam dados reais nem vêm
do banco de dados.

**Why this priority**: Apoia a aquisição de novos usuários, mas não é pré-requisito para o
funcionamento do controle financeiro em si.

**Independent Test**: Acessar o sistema sem estar autenticado e confirmar que a landing exibe
exemplos estáticos de dashboard, categorias e resumos, com chamada para cadastro, sem consultar
o banco de dados.

**Acceptance Scenarios**:

1. **Given** um visitante não autenticado, **When** ele acessa o sistema, **Then** uma página
   inicial com exemplos estáticos de dashboard, categorias e resumos financeiros é exibida.
2. **Given** a página inicial ilustrativa, **When** ela é carregada, **Then** os exemplos
   apresentados são estáticos e não correspondem a dados reais de nenhuma residência.

---

### Edge Cases

- O que acontece quando um usuário é convidado para uma residência da qual já é membro? O convite
  não deve gerar associação duplicada.
- Como o sistema trata um convite pendente cujo e-mail se cadastra e é vinculado — o convite
  pendente deixa de existir após a vinculação automática.
- O que acontece quando o Administrador tenta convidar o próprio e-mail? A ação não deve criar um
  convite redundante.
- Como o sistema garante que sempre exista exatamente um Administrador por residência durante a
  sucessão automática (nenhum intervalo com zero ou dois Administradores)?
- O que acontece com a "casa ativa" de um usuário quando a residência atualmente ativa é removida
  ou ele é removido dela? O sistema deve selecionar outra residência disponível ou direcioná-lo à
  criação de uma nova.
- Como o sistema trata a tentativa de aceitar um convite já cancelado ou já utilizado? A operação
  deve ser rejeitada.
- O que acontece quando um usuário sem nenhuma residência tenta acessar diretamente uma rota de
  dados financeiros? Ele deve ser direcionado à criação de residência.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE permitir que um usuário autenticado crie uma residência informando
  um nome.
- **FR-002**: O sistema DEVE registrar automaticamente o criador da residência como seu
  Administrador.
- **FR-003**: O sistema DEVE garantir que cada residência tenha exatamente um Administrador em
  qualquer momento.
- **FR-004**: O sistema DEVE direcionar um usuário sem nenhuma residência para a criação de uma
  residência antes de permitir o lançamento de despesas ou categorias.
- **FR-005**: O sistema DEVE vincular toda despesa e toda categoria a uma residência, e não ao
  usuário que a criou.
- **FR-006**: O sistema DEVE restringir a visualização e a manipulação de despesas e categorias
  aos usuários que pertencem à residência correspondente.
- **FR-007**: O sistema DEVE permitir que um usuário pertença e/ou administre várias residências
  simultaneamente.
- **FR-008**: O sistema DEVE oferecer um seletor de "casa ativa" para o usuário alternar entre as
  residências às quais pertence.
- **FR-009**: O sistema DEVE fazer com que todos os dados exibidos (dashboard, despesas,
  categorias) reflitam a residência ativa selecionada.
- **FR-010**: O sistema DEVE permitir que um Membro crie, edite e exclua despesas e categorias da
  residência, inclusive as criadas por outros usuários da mesma residência.
- **FR-011**: O sistema DEVE impedir que um Membro (não Administrador) edite o nome da residência
  e gerencie convites ou membros.
- **FR-012**: O sistema DEVE permitir que apenas o Administrador edite o nome da residência.
- **FR-013**: O sistema DEVE permitir que apenas o Administrador convide membros para a
  residência.
- **FR-014**: O sistema DEVE permitir que o convite seja feito por e-mail.
- **FR-015**: O sistema DEVE permitir que apenas usuários já cadastrados na plataforma aceitem um
  convite.
- **FR-016**: O sistema DEVE vincular automaticamente como Membro da residência que a convidou a
  pessoa que, após ser convidada por e-mail sem possuir conta, se cadastra com aquele e-mail.
- **FR-017**: O sistema DEVE permitir que o Administrador cancele um convite pendente, tornando-o
  inválido para aceite.
- **FR-018**: O sistema DEVE permitir que o Administrador remova um membro existente, revogando o
  acesso desse usuário aos dados da residência.
- **FR-019**: O sistema DEVE transferir automaticamente a administração ao membro ativo que
  ingressou há mais tempo quando o Administrador sai da residência ou cancela seu cadastro,
  desde que haja pelo menos outro membro ativo.
- **FR-020**: O sistema DEVE remover a residência e todos os seus dados (despesas e categorias)
  quando o Administrador que é o único integrante sai da residência ou cancela seu cadastro.
- **FR-021**: O sistema DEVE exibir a visitantes não autenticados uma página inicial com exemplos
  ILUSTRATIVOS e ESTÁTICOS de dashboard, categorias e resumos financeiros, sem consultar o banco
  de dados.
- **FR-022**: O sistema DEVE impedir associações duplicadas de um mesmo usuário à mesma
  residência.
- **FR-023**: O sistema DEVE rejeitar a tentativa de aceitar um convite já cancelado ou já
  utilizado.

### Key Entities *(include if feature involves data)*

- **Residência (Household)**: Unidade de organização financeira (ex.: "Casa Mãe", "Apartamento",
  "Fazenda"). Possui um nome, exatamente um Administrador e um conjunto de membros. É a
  proprietária de todas as despesas e categorias associadas.
- **Associação de Membro (Membership)**: Relação entre um usuário e uma residência, com um papel
  (Administrador ou Membro) e a data de ingresso, usada para determinar a antiguidade na sucessão
  de administração.
- **Convite (Invitation)**: Solicitação para que um e-mail passe a integrar uma residência. Possui
  e-mail de destino, residência de origem e estado (pendente, aceito ou cancelado).
- **Despesa (Expense)**: Registro financeiro pertencente a uma residência. Reaproveita a entidade
  existente, agora vinculada à residência em vez de ao usuário.
- **Categoria (Category)**: Classificação de despesas pertencente a uma residência. Reaproveita a
  entidade existente, agora vinculada à residência em vez de ao usuário.
- **Usuário (User)**: Pessoa autenticada na plataforma que pode pertencer e administrar várias
  residências e possui uma residência ativa selecionada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um usuário recém-cadastrado consegue criar sua primeira residência e lançar a
  primeira despesa em menos de 2 minutos.
- **SC-002**: 100% das despesas e categorias exibidas pertencem à residência ativa selecionada;
  nenhum dado de outra residência aparece.
- **SC-003**: Um usuário que pertence a múltiplas residências consegue alternar a casa ativa e ver
  os dados corretos atualizados em até 2 segundos.
- **SC-004**: Toda residência mantém exatamente um Administrador em 100% dos casos, inclusive após
  saída ou cancelamento de cadastro do Administrador anterior.
- **SC-005**: 100% dos convites por e-mail resultam em vinculação como Membro apenas após aceite
  (usuário já cadastrado) ou após cadastro com o e-mail convidado (usuário novo).
- **SC-006**: Nenhum usuário consegue visualizar ou manipular dados de uma residência à qual não
  pertence (0 acessos indevidos).
- **SC-007**: Visitantes não autenticados veem a página inicial ilustrativa sem que nenhum dado
  real seja carregado do banco de dados.

## Assumptions

- A autenticação de usuários já existe no projeto (Better Auth) e será reutilizada; esta feature
  não redefine o fluxo de login/cadastro, apenas o estende com o vínculo automático de convites.
- As entidades de Despesa e Categoria já existem e serão migradas para pertencer a uma residência
  em vez de a um usuário; dados existentes serão associados a uma residência padrão do respectivo
  usuário durante a migração.
- A vinculação automática de um usuário novo a um convite ocorre por correspondência exata entre o
  e-mail convidado e o e-mail usado no cadastro.
- Um usuário pode sair voluntariamente de uma residência da qual é Membro; ao sair, perde o acesso
  aos dados daquela residência.
- A "antiguidade" para sucessão de administração é determinada pela data de ingresso do membro na
  residência (o que ingressou há mais tempo assume).
- Ao entrar no sistema, a residência ativa padrão é a última selecionada pelo usuário ou, na
  ausência de seleção prévia, a primeira residência disponível.
- Convites são endereçados por e-mail nesta versão; outros meios podem ser adicionados no futuro.
- Notificações de convite (ex.: envio de e-mail transacional) estão fora do escopo desta versão; o
  convite fica disponível para aceite dentro da plataforma.
