# Feature Specification: Cor da categoria

**Feature Branch**: `008-category-color`

**Created**: 2026-08-14

**Status**: Draft

**Input**: User description: "Spec 008 — Cor da categoria (Baixa). Permitir ao usuário escolher a cor de cada categoria em Categorias, a partir de uma paleta fechada derivada dos tokens de tema. A cor identifica a categoria de forma consistente na lista de categorias, nas despesas e no gráfico do Dashboard."

## Clarifications

### Session 2026-08-14

- Q: Quando uma categoria não tem cor escolhida (incluindo as pré-existentes), qual deve ser a "cor padrão" exibida na lista e no gráfico? → A: Derivada por categoria (hash do id) — cada categoria sem cor recebe automaticamente uma cor estável e distinta derivada do seu id, preservando a aparência atual.
- Q: Como as opções da paleta fechada devem ser apresentadas ao usuário no seletor de cor? → A: Rótulos neutros de cor (ex.: Azul, Verde…), sem vínculo semântico a um tipo de categoria.
- Q: O usuário pode remover a cor escolhida e voltar ao padrão do sistema (color = null)? → A: Sim, o seletor inclui ação para limpar/redefinir, retornando à cor padrão derivada.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Escolher a cor ao criar/editar uma categoria (Priority: P1)

Um membro da residência abre a tela de Categorias, cria ou edita uma categoria e escolhe uma cor
de uma paleta pré-definida. A cor fica salva e passa a representar aquela categoria para todos os
membros da mesma residência.

**Why this priority**: É a base da feature — sem a capacidade de selecionar e persistir a cor, nenhum
dos demais comportamentos (exibição consistente) tem valor. Entrega, sozinha, um MVP demonstrável.

**Independent Test**: Criar uma categoria escolhendo uma cor da paleta, salvar, reabrir a edição e
confirmar que a mesma cor aparece selecionada e persistida.

**Acceptance Scenarios**:

1. **Given** o formulário de nova categoria aberto, **When** o usuário escolhe uma cor da paleta e
   salva, **Then** a categoria é criada com a cor escolhida.
2. **Given** uma categoria existente, **When** o usuário abre a edição, altera a cor e salva,
   **Then** a nova cor é persistida e substitui a anterior.
3. **Given** o formulário de categoria, **When** o usuário não interage com o seletor de cor,
   **Then** a categoria é salva sem cor explícita (color = null) e passa a exibir a **cor padrão
   derivada por categoria**.
4. **Given** um usuário que não pertence à residência da categoria, **When** ele tenta alterar a cor,
   **Then** a operação é rejeitada por falta de autorização.
5. **Given** uma categoria com cor explícita definida, **When** o usuário aciona a opção de limpar a
   cor e salva, **Then** a categoria volta a exibir a cor padrão derivada (color = null).

---

### User Story 2 - Ver a cor da categoria na lista de categorias (Priority: P2)

Ao abrir a tela de Categorias, cada categoria exibe sua cor associada, permitindo identificação
visual rápida.

**Why this priority**: Fornece retorno visual imediato da escolha feita na US1 e valida a persistência
para o usuário, mas depende da capacidade de definir a cor.

**Independent Test**: Definir cores distintas em duas categorias e confirmar que a lista exibe cada
uma com sua respectiva cor.

**Acceptance Scenarios**:

1. **Given** categorias com cores diferentes, **When** o usuário abre a lista de categorias,
   **Then** cada categoria aparece com um indicador na sua cor.
2. **Given** uma categoria pré-existente sem cor previamente definida, **When** a lista é exibida,
   **Then** ela aparece com a cor padrão.

---

### User Story 3 - Ver a cor da categoria no gráfico do Dashboard (Priority: P3)

No Dashboard, o gráfico de gastos por categoria usa a cor de cada categoria para colorir suas fatias,
tornando a leitura consistente com o resto da aplicação.

**Why this priority**: Amplia a consistência visual para a análise de gastos, mas é um refinamento
sobre a base já entregue pelas US1 e US2.

**Independent Test**: Definir cores em categorias que possuem despesas no período e confirmar que as
fatias correspondentes no gráfico do Dashboard usam essas cores.

**Acceptance Scenarios**:

1. **Given** categorias com cores definidas e despesas no período, **When** o usuário abre o Dashboard,
   **Then** cada fatia do gráfico usa a cor da categoria correspondente.
2. **Given** categorias distintas com a mesma cor escolhida, **When** o gráfico é exibido, **Then**
   cada fatia ainda usa a cor definida por sua categoria (a repetição de cor é permitida).

---

### Edge Cases

- O que acontece com **categorias já existentes** antes desta feature? Continuam sem cor explícita
  (color = null) e exibem uma **cor padrão derivada por categoria** (determinística a partir do id),
  garantindo que nenhuma categoria fique sem cor e preservando a aparência atual.
- Como o sistema trata uma **cor enviada que não pertence à paleta permitida**? A operação é rejeitada
  na validação e a categoria não é criada/alterada.
- Como o gráfico do Dashboard se comporta quando **duas categorias têm a mesma cor**? Cada fatia usa
  a cor da sua categoria; a repetição é permitida e não gera erro.
- Como a cor se comporta em **tema claro e escuro**? A cor vem dos tokens `--cat-*` do tema e
  permanece legível, com contraste adequado, tanto no tema claro quanto no escuro.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que o usuário associe uma cor a cada categoria, escolhida a
  partir de uma paleta fechada e pré-definida.
- **FR-001a**: O seletor de cor MUST apresentar as opções da paleta com **rótulos neutros de cor**
  (ex.: "Azul", "Verde"), sem vínculo semântico a um tipo de categoria, evitando ambiguidade ao
  aplicar uma cor a uma categoria de tema diferente.
- **FR-002**: A paleta selecionável MUST ser composta exclusivamente por cores derivadas dos tokens de
  tema da aplicação (`app/globals.css`), sem cores livres (hex arbitrário) ou hard-coded.
- **FR-003**: O sistema MUST validar, no momento de salvar, que a cor escolhida pertence à paleta
  permitida, rejeitando qualquer valor fora dela.
- **FR-004**: O sistema MUST permitir definir a cor tanto na **criação** quanto na **edição** de uma
  categoria.
- **FR-005**: O sistema MUST exibir uma **cor padrão derivada por categoria** (determinística a partir
  do id da categoria) para toda categoria sem cor explícita, incluindo as já existentes antes desta
  feature, de modo que nenhuma categoria fique sem cor exibível.
- **FR-005a**: O sistema MUST permitir que o usuário **remova a cor explícita** de uma categoria
  (retornando a color = null), fazendo-a voltar a exibir a cor padrão derivada.
- **FR-006**: O sistema MUST persistir a cor da categoria de forma associada à residência, de modo que
  todos os membros da mesma residência vejam a mesma cor.
- **FR-007**: O sistema MUST restringir a alteração da cor a usuários autenticados que pertençam à
  residência dona da categoria.
- **FR-008**: O sistema MUST exibir a cor de cada categoria na **lista de categorias**.
- **FR-009**: O sistema MUST usar a cor da categoria para colorir as fatias correspondentes no
  **gráfico de gastos por categoria do Dashboard**.
- **FR-010**: A introdução da cor MUST NOT quebrar os consumidores atuais das categorias (leitura,
  criação, edição e exclusão continuam funcionando).
- **FR-011**: A cor MUST vir exclusivamente dos tokens de tema `--cat-*` e MUST permanecer legível,
  com contraste adequado, tanto no tema claro quanto no escuro.

### Key Entities *(include if feature involves data)*

- **Categoria**: representa uma categoria de despesa pertencente a uma residência. Passa a ter, além
  do nome, um atributo de **cor** que a identifica visualmente. A cor é representada por um
  identificador de um token de tema (não um valor de cor arbitrário) e é **opcional**: quando ausente
  (null), a cor de exibição é **derivada deterministicamente do id da categoria**. O usuário pode
  limpar a cor explícita para voltar a essa derivação. A unicidade e o pertencimento à residência
  permanecem inalterados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das categorias (novas e pré-existentes) possuem uma cor associada — nenhuma
  categoria fica sem cor.
- **SC-002**: Uma cor escolhida ao criar ou editar uma categoria aparece de forma consistente na lista
  de categorias e no gráfico do Dashboard sem que o usuário precise recarregar manualmente para
  situações onde os dados já são atualizados hoje.
- **SC-003**: 100% das tentativas de salvar uma cor fora da paleta permitida são rejeitadas.
- **SC-004**: O usuário consegue escolher e salvar a cor de uma categoria em menos de 30 segundos a
  partir da tela de Categorias.
- **SC-005**: Todas as cores exibidas permanecem legíveis e com contraste adequado tanto no tema claro
  quanto no escuro.

## Assumptions

- A paleta de cores selecionáveis é **fechada** e derivada dos tokens de tema em `app/globals.css`; a
  definição exata do conjunto de tokens que compõem a paleta será detalhada no planejamento.
- A cor é armazenada como um **identificador de token de tema** (não um hex livre), preservando a regra
  de usar apenas cores do tema.
- A cor é um atributo **por categoria** e compartilhado por toda a residência — não há cor por despesa
  nem cor por usuário.
- Categorias sem cor explícita (incluindo as existentes) exibem uma **cor padrão derivada
  deterministicamente do id** da categoria — não há backfill nem uma única cor fixa —, de forma que a
  experiência atual não é interrompida.
- No seletor, as cores da paleta são apresentadas com **rótulos neutros de cor** (ex.: "Azul",
  "Verde"), independentes do nome/tema da categoria.
- Os pontos de exibição obrigatórios são a **lista de categorias** e o **gráfico do Dashboard**; outros
  locais que exibam categorias podem adotar a cor posteriormente sem alterar o escopo desta feature.

## Out of Scope

- Cores customizadas fora da paleta de tokens (hex livre).
- Cor por despesa individual.
- Temas ou paletas configuráveis pelo usuário.
- Ícones por categoria além do que já existe hoje.
