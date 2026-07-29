# Feature Specification: Gestão de Despesas com Autenticação

**Feature Branch**: `001-expense-management`

**Created**: 2026-07-26

**Status**: Draft

**Input**: User description: "Crie um sistema de gestão de despesas, com autenticação de usuários. O usuário pode criar conta e fazer login (nome, e-mail e senha). O usuário pode criar despesas. O usuário pode criar categorias de despesas. O usuário pode, para cada despesa, marcar quais foram pagas. O usuário deve conseguir visualizar uma dashboard."

## Clarifications

### Session 2026-07-29

- Q: Qual a precisão dos valores monetários das despesas? → A: Exatamente 2 casas decimais (centavos), com teto amplo; entrada com mais casas é rejeitada/arredondada.
- Q: Qual o escopo temporal padrão dos totais da dashboard? → A: Todas as despesas do usuário (histórico completo), sem recorte de período nesta versão.
- Q: Qual o requisito mínimo de senha no cadastro? → A: Mínimo de 8 caracteres, sem exigência de complexidade.
- Q: Um usuário pode ter categorias com nome idêntico? → A: Não; nome de categoria é único por usuário (case-insensitive).
- Q: Qual a moeda padrão e formatação da UI? → A: BRL (R$) com formatação pt-BR (`R$ 1.234,56`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Autenticação de Usuário (Priority: P1)

Uma pessoa acessa o sistema pela primeira vez, cria uma conta informando nome, e-mail e senha e, em visitas seguintes, entra na sua conta com e-mail e senha para acessar suas informações financeiras privadas.

**Why this priority**: Sem conta e login não há isolamento de dados por pessoa; é o alicerce sobre o qual todo o restante do sistema depende. Cada usuário só pode ver e gerenciar as próprias despesas.

**Independent Test**: Pode ser testado de forma independente criando uma conta nova, saindo, e entrando novamente com as mesmas credenciais, confirmando o acesso à área autenticada e a rejeição de credenciais inválidas.

**Acceptance Scenarios**:

1. **Given** um visitante sem conta, **When** informa nome, e-mail válido e senha e confirma o cadastro, **Then** a conta é criada e ele passa a ter acesso à área autenticada.
2. **Given** um usuário já cadastrado, **When** informa e-mail e senha corretos, **Then** ele entra na sua conta e vê apenas seus próprios dados.
3. **Given** um visitante na tela de cadastro, **When** informa um e-mail já utilizado por outra conta, **Then** o cadastro é recusado com uma mensagem clara.
4. **Given** um usuário na tela de login, **When** informa senha incorreta, **Then** o acesso é negado com uma mensagem clara e sem revelar qual campo está errado.
5. **Given** um usuário autenticado, **When** encerra a sessão, **Then** ele deixa de ter acesso à área autenticada até entrar novamente.

---

### User Story 2 - Registro e Gestão de Despesas (Priority: P1)

Um usuário autenticado registra suas despesas informando os dados relevantes (descrição, valor, data e categoria) e consulta a lista das despesas que criou.

**Why this priority**: Registrar despesas é o propósito central do produto; é a principal ação de valor que justifica o uso do sistema no dia a dia.

**Independent Test**: Pode ser testado criando uma despesa como usuário autenticado e verificando que ela aparece na lista de despesas daquele usuário, e apenas dele.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado, **When** cria uma despesa com descrição, valor e data válidos, **Then** a despesa é salva e passa a aparecer na sua lista de despesas.
2. **Given** um usuário autenticado, **When** tenta salvar uma despesa com valor ausente ou inválido, **Then** o sistema recusa e informa o que precisa ser corrigido.
3. **Given** um usuário com despesas cadastradas, **When** acessa sua lista de despesas, **Then** vê apenas as despesas que ele mesmo criou.
4. **Given** uma despesa existente do usuário, **When** ele edita ou remove essa despesa, **Then** a alteração é refletida na sua lista.

---

### User Story 3 - Categorias de Despesas (Priority: P2)

Um usuário autenticado cria categorias (por exemplo, "Alimentação", "Transporte", "Moradia") e as associa às suas despesas para organizá-las.

**Why this priority**: Categorização agrega organização e é pré-requisito para uma dashboard significativa, mas as despesas já entregam valor mesmo antes das categorias estarem completas.

**Independent Test**: Pode ser testado criando uma categoria e associando-a a uma despesa, confirmando que a despesa passa a exibir a categoria escolhida.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado, **When** cria uma categoria informando um nome, **Then** a categoria fica disponível para ser associada às suas despesas.
2. **Given** um usuário com categorias cadastradas, **When** cria ou edita uma despesa, **Then** pode escolher uma das suas categorias para associar.
3. **Given** um usuário autenticado, **When** consulta suas categorias, **Then** vê apenas as categorias que ele mesmo criou.
4. **Given** uma categoria associada a despesas existentes, **When** o usuário tenta removê-la, **Then** o sistema trata as despesas afetadas de forma previsível (mantendo-as sem categoria em vez de excluí-las).

---

### User Story 4 - Marcar Despesas como Pagas (Priority: P2)

Um usuário autenticado marca cada despesa como paga ou não paga, acompanhando o que já foi quitado e o que ainda está pendente.

**Why this priority**: O acompanhamento de pagamento é uma diferenciação importante de controle financeiro, mas depende da existência prévia das despesas.

**Independent Test**: Pode ser testado marcando uma despesa como paga e verificando que seu estado é refletido na lista e revertível para não paga.

**Acceptance Scenarios**:

1. **Given** uma despesa não paga do usuário, **When** ele a marca como paga, **Then** a despesa passa a constar como paga.
2. **Given** uma despesa marcada como paga, **When** o usuário a marca novamente como não paga, **Then** a despesa volta a constar como pendente.
3. **Given** uma lista de despesas com estados variados, **When** o usuário a consulta, **Then** consegue distinguir claramente as despesas pagas das pendentes.

---

### User Story 5 - Visualização da Dashboard (Priority: P3)

Um usuário autenticado acessa uma dashboard que resume sua situação financeira, com totais de despesas, valores pagos e pendentes e uma visão por categoria.

**Why this priority**: A dashboard consolida os dados já registrados em insight; é altamente valiosa, mas depende de despesas, categorias e status de pagamento existentes.

**Independent Test**: Pode ser testado após registrar despesas em categorias distintas com estados de pagamento variados, verificando que os totais e agrupamentos exibidos correspondem aos dados registrados.

**Acceptance Scenarios**:

1. **Given** um usuário com despesas registradas, **When** acessa a dashboard, **Then** vê o total de despesas e a divisão entre valores pagos e pendentes.
2. **Given** um usuário com despesas em várias categorias, **When** acessa a dashboard, **Then** vê os gastos agrupados por categoria.
3. **Given** um usuário sem nenhuma despesa registrada, **When** acessa a dashboard, **Then** vê um estado vazio informativo em vez de valores incorretos.
4. **Given** um usuário, **When** acessa a dashboard, **Then** vê apenas dados derivados das suas próprias despesas.

---

### Edge Cases

- O que acontece quando um usuário tenta cadastrar-se com um e-mail em formato inválido ou senha que não atende aos requisitos mínimos?
- Como o sistema trata a tentativa de registrar uma despesa com valor negativo ou igual a zero?
- Como o sistema se comporta quando um usuário tenta acessar, editar ou remover uma despesa ou categoria que não lhe pertence?
- O que acontece com as despesas associadas a uma categoria que é removida?
- Como a dashboard se comporta quando há despesas mas nenhuma está paga (ou todas estão pagas)?
- Como o sistema trata valores monetários com muitas casas decimais ou montantes muito altos?
- O que acontece quando uma pessoa não autenticada tenta acessar diretamente a área de despesas ou a dashboard?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE permitir que um visitante crie uma conta informando nome, e-mail e senha, exigindo senha com no mínimo 8 caracteres (sem regra de complexidade obrigatória).
- **FR-002**: O sistema DEVE validar que o e-mail informado no cadastro tem formato válido e ainda não está associado a outra conta.
- **FR-003**: O sistema DEVE permitir que um usuário cadastrado entre na sua conta com e-mail e senha, e negar acesso quando as credenciais forem inválidas.
- **FR-004**: O sistema DEVE permitir que um usuário autenticado encerre a sua sessão.
- **FR-005**: O sistema DEVE restringir o acesso às despesas, categorias e dashboard a usuários autenticados.
- **FR-006**: O sistema DEVE garantir que cada usuário acesse e gerencie exclusivamente os próprios dados (despesas e categorias), impedindo acesso aos dados de outros usuários.
- **FR-007**: O sistema DEVE permitir que um usuário autenticado crie uma despesa contendo, no mínimo, descrição, valor monetário e data.
- **FR-008**: O sistema DEVE validar que o valor de uma despesa é um montante monetário positivo, com exatamente 2 casas decimais (centavos); entradas com mais casas decimais DEVEM ser rejeitadas ou arredondadas para 2 casas antes de serem persistidas.
- **FR-009**: O sistema DEVE permitir que um usuário autenticado consulte a lista das suas despesas.
- **FR-010**: O sistema DEVE permitir que um usuário autenticado edite e remova as suas despesas.
- **FR-011**: O sistema DEVE permitir que um usuário autenticado crie categorias de despesa informando um nome, garantindo que o nome seja único por usuário (comparação case-insensitive) e recusando nomes duplicados com mensagem clara.
- **FR-012**: O sistema DEVE permitir que um usuário autenticado consulte, edite e remova as suas categorias.
- **FR-013**: O sistema DEVE permitir associar uma categoria a uma despesa no momento da criação ou edição da despesa.
- **FR-014**: O sistema DEVE tratar de forma previsível as despesas de uma categoria removida, mantendo-as sem categoria em vez de excluí-las.
- **FR-015**: O sistema DEVE permitir que um usuário marque cada despesa como paga ou não paga, e alterne esse estado a qualquer momento.
- **FR-016**: O sistema DEVE exibir uma dashboard que apresente, no mínimo, o total das despesas do usuário, os totais pagos e pendentes e a distribuição de gastos por categoria, considerando todas as despesas do usuário (histórico completo), sem recorte de período.
- **FR-017**: A dashboard DEVE apresentar um estado vazio informativo quando o usuário não possuir despesas registradas.
- **FR-018**: O sistema DEVE exibir mensagens claras de erro e validação quando uma ação for recusada.

### Key Entities *(include if feature involves data)*

- **Usuário**: Pessoa que utiliza o sistema. Atributos principais: nome, e-mail (único) e credencial de acesso (senha). Possui muitas despesas e muitas categorias.
- **Categoria**: Rótulo de organização de despesas criado por um usuário. Atributos principais: nome (único por usuário, case-insensitive). Pertence a um usuário e pode estar associada a muitas despesas.
- **Despesa**: Registro de um gasto do usuário. Atributos principais: descrição, valor monetário (positivo, 2 casas decimais), data, estado de pagamento (paga ou não paga) e categoria opcional. Pertence a um usuário.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um novo usuário consegue criar uma conta e entrar na sua área autenticada em menos de 2 minutos na primeira tentativa.
- **SC-002**: Um usuário autenticado consegue registrar uma nova despesa em menos de 30 segundos.
- **SC-003**: 100% das despesas e categorias exibidas para um usuário pertencem exclusivamente a ele, sem vazamento de dados entre contas.
- **SC-004**: Tentativas de acesso não autenticado às áreas de despesas ou dashboard são bloqueadas em 100% dos casos.
- **SC-005**: Os totais de pago, pendente e por categoria exibidos na dashboard correspondem exatamente às despesas registradas pelo usuário em 100% das verificações.
- **SC-006**: 90% dos usuários conseguem concluir o fluxo de registrar uma despesa e marcá-la como paga na primeira tentativa, sem ajuda externa.

## Assumptions

- A autenticação é baseada em e-mail e senha, sem provedores externos (SSO/OAuth) nesta versão.
- Cada despesa possui no máximo uma categoria; categorias compartilhadas entre múltiplas despesas do mesmo usuário são permitidas.
- A categoria em uma despesa é opcional: uma despesa pode existir sem categoria.
- Valores monetários são registrados e exibidos em Real brasileiro (BRL), com formatação no locale pt-BR (ex.: `R$ 1.234,56`); conversão entre moedas está fora de escopo nesta versão.
- Relatórios exportáveis, orçamentos, receitas/entradas e despesas recorrentes estão fora de escopo nesta versão, que trata apenas de despesas avulsas.
- A dashboard apresenta a situação financeira consolidada do usuário considerando todo o histórico de despesas (sem recorte de período); filtros avançados por período estão fora de escopo nesta versão.
- Suporte a múltiplos idiomas está fora de escopo; a interface é apresentada em português.
