# Feature Specification: Calculador de Dívidas + card "Total Pagantes" no Dashboard

**Feature Branch**: `011-debt-calculator`

**Created**: 2026-08-20

**Status**: Draft

**Input**: User description: "Spec 011 — Calculador de Dívidas + card 'Total Pagantes' no Dashboard (Média). Entrega, numa spec única, duas partes acopladas: (1) uma nova página Calculador de Dívidas onde o usuário escolhe um mês, vê o total de despesas daquele mês e informa quantos pagantes vão dividir a conta, obtendo o valor por pagante; e (2) um card Total Pagantes no Dashboard que exibe o número de pagantes informado para o mês selecionado. As duas partes compartilham o mesmo armazenamento (o número de pagantes por mês): o Calculador grava o dado e o card do Dashboard lê."

## Clarifications

### Session 2026-08-20

- Q: Quando o número de pagantes deve ser persistido (gravado via server action) no Calculador? → A: O valor por pagante é calculado ao vivo no cliente enquanto o usuário digita; a persistência do número ocorre apenas por uma ação explícita (botão "Salvar").

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Calcular o valor por pagante de um mês (Priority: P1)

Um membro da residência abre a página **Calculador de Dívidas**, escolhe um mês entre os
disponíveis, visualiza o total de despesas daquele mês e informa quantos **pagantes** vão dividir
a conta. O sistema calcula e mostra imediatamente o **valor por pagante** e, ao **salvar**, guarda
o número de pagantes informado para aquele mês, de modo que o valor possa ser reaproveitado depois
(inclusive pelo Dashboard).

**Why this priority**: É o coração da funcionalidade e entrega valor sozinha — dividir a conta do
mês é a tarefa que motiva toda a spec. Sem ela, o card do Dashboard não teria dado algum para
exibir. Pode ser lançada de forma independente e já resolve o problema do usuário.

**Independent Test**: Com uma residência que tenha despesas em pelo menos um mês, abrir o
Calculador, selecionar esse mês, conferir o total exibido, informar um número de pagantes (ex.: 3)
e verificar que o valor por pagante mostrado é o total dividido por 3 e que o número informado
permanece salvo ao recarregar a página.

**Acceptance Scenarios**:

1. **Given** uma residência com R$ 1.000,00 de despesas em Julho, **When** o usuário seleciona
   Julho e informa 3 pagantes, **Then** o sistema exibe R$ 333,33 por pagante ao vivo e, ao clicar
   em "Salvar", guarda "3 pagantes em Julho".
2. **Given** o mesmo mês já com um número de pagantes salvo, **When** o usuário reabre o Calculador
   e seleciona esse mês, **Then** o campo de pagantes aparece preenchido com o número salvo e o
   valor por pagante é recalculado a partir dele.
3. **Given** um mês selecionado com pagantes salvos, **When** o usuário altera o número de pagantes
   e confirma, **Then** o novo número substitui o anterior para aquele mês e o valor por pagante é
   atualizado.
4. **Given** um mês selecionado, **When** o usuário informa 1 pagante, **Then** o valor por pagante
   é igual ao total do mês.

---

### User Story 2 - Ver o número de pagantes no Dashboard (Priority: P2)

Um membro da residência, ao consultar o Dashboard com um mês selecionado, vê um card **Total
Pagantes** exibindo o número inteiro de pagantes informado para aquele mês no Calculador. O card
acompanha o mês selecionado no Dashboard.

**Why this priority**: Depende do dado gravado pela História 1, mas agrega valor ao dar
visibilidade rápida de quantas pessoas dividem a conta do mês sem abrir o Calculador. É
independentemente testável desde que exista um número de pagantes salvo para o mês.

**Independent Test**: Com um número de pagantes já salvo para determinado mês, abrir o Dashboard,
selecionar esse mês e verificar que o card "Total Pagantes" mostra exatamente esse número inteiro;
selecionar um mês sem pagantes informado e verificar o estado vazio definido.

**Acceptance Scenarios**:

1. **Given** "3 pagantes em Julho" salvo, **When** o usuário abre o Dashboard com Julho
   selecionado, **Then** o card "Total Pagantes" exibe "3".
2. **Given** um mês sem número de pagantes informado, **When** o usuário seleciona esse mês no
   Dashboard, **Then** o card "Total Pagantes" exibe o estado vazio (ex.: "—").
3. **Given** o Dashboard com um mês selecionado, **When** o usuário troca para outro mês, **Then**
   o card "Total Pagantes" atualiza para o número (ou estado vazio) daquele mês.

---

### Edge Cases

- **Residência sem despesas com mês**: o Calculador não tem meses disponíveis para escolher; exibe
  estado vazio orientando que é preciso cadastrar despesas com data de vencimento.
- **Mês sem pagantes informado**: no Calculador o campo aparece vazio (sem valor por pagante até
  informar); no Dashboard o card exibe o estado vazio ("—").
- **Número de pagantes inválido**: valores menores que 1, zero, vazio ou não inteiros são
  rejeitados com mensagem clara; o sistema nunca divide por zero.
- **Divisão com resto (centavos não divisíveis)**: quando o total não é divisível igualmente, o
  valor por pagante é arredondado ao centavo mais próximo; o sistema exibe apenas o valor por
  pagante, sem "acerto de sobra" para nenhum pagante.
- **Despesas sem data de vencimento**: como o Calculador sempre opera sobre um mês específico,
  despesas sem data de vencimento não entram no total do mês (coerente com a spec 010).
- **Total do mês igual a zero**: se o mês selecionado tiver total R$ 0,00, o valor por pagante é
  R$ 0,00 independentemente do número de pagantes informado.
- **Autorização**: um usuário só pode ver e gravar pagantes da sua residência ativa; não pode
  gravar pagantes de uma residência da qual não é membro.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST oferecer uma página **Calculador de Dívidas** acessível por um item de
  menu próprio na navegação principal.
- **FR-002**: O Calculador MUST permitir escolher **um mês** entre os meses que possuem despesas com
  data de vencimento na residência ativa, reutilizando a lista de meses disponíveis já existente.
- **FR-003**: Ao selecionar um mês, o sistema MUST exibir o **total de despesas** daquele mês,
  usando a mesma regra de recorte por data de vencimento adotada no Dashboard (spec 010).
- **FR-004**: O Calculador MUST oferecer um campo para o **número de pagantes**, aceitando apenas
  inteiros **maiores ou iguais a 1**.
- **FR-005**: O sistema MUST calcular e exibir o **valor por pagante** **ao vivo no cliente**
  (enquanto o usuário digita um número válido) como o total do mês dividido pelo número de
  pagantes, sem depender de persistência para mostrar o resultado.
- **FR-006**: O valor por pagante MUST ser **arredondado ao centavo mais próximo**; o sistema MUST
  exibir apenas esse valor por pagante, **sem** distribuir ou destacar eventual resto/sobra.
- **FR-007**: O sistema MUST **persistir** o número de pagantes por residência e por mês, de forma
  que exista no máximo **um** número de pagantes por combinação de residência + mês.
- **FR-008**: A persistência do número de pagantes MUST ocorrer apenas por uma **ação explícita do
  usuário** (botão "Salvar"), e não automaticamente a cada digitação; ao gravar, o sistema MUST
  substituir (atualizar) o valor anterior daquele mês quando já existir, e criar quando ainda não
  existir.
- **FR-009**: O sistema MUST autorizar a gravação e a leitura de pagantes **apenas para membros da
  residência ativa**; tentativas fora da residência do usuário MUST ser rejeitadas.
- **FR-010**: Ao reabrir o Calculador em um mês que já tem pagantes salvos, o sistema MUST
  pré-carregar o número salvo e recalcular o valor por pagante a partir dele.
- **FR-011**: O Dashboard MUST exibir um card **Total Pagantes** que mostra o número inteiro de
  pagantes salvo para o mês atualmente selecionado no Dashboard.
- **FR-012**: O card "Total Pagantes" MUST acompanhar o mês selecionado no Dashboard e MUST exibir
  um **estado vazio** definido (ex.: "—") quando não houver número de pagantes informado para o
  mês, bem como quando o Dashboard estiver na visão **"Todos os meses"** (pagantes é um conceito por
  mês específico).
- **FR-013**: O card "Total Pagantes" MUST exibir uma **contagem inteira** (sem símbolo monetário),
  sem quebrar a exibição dos cards monetários já existentes no Dashboard.
- **FR-014**: O Calculador MUST exibir **estados vazios** apropriados: (a) quando a residência não
  tem nenhuma despesa com mês disponível e (b) quando o mês selecionado ainda não tem número de
  pagantes informado.
- **FR-015**: O sistema MUST validar a entrada de pagantes e apresentar mensagem de erro amigável
  para valores inválidos, sem realizar cálculo nesses casos.

### Key Entities *(include if feature involves data)*

- **Pagantes do mês**: representa quantas pessoas dividem as despesas de um determinado mês em uma
  residência. Atributos essenciais: residência à qual pertence, mês de referência (ano + mês) e a
  quantidade de pagantes (inteiro ≥ 1). É único por combinação residência + mês e deixa de existir
  se a residência for removida.
- **Mês disponível (bucket de relatório)**: um mês (ano + mês) que possui ao menos uma despesa com
  data de vencimento na residência ativa; base para o seletor do Calculador (reaproveitado do
  conceito já existente usado no Dashboard e na tela de Despesas).
- **Despesa**: valor a pagar da residência, com data de vencimento (que pode ser nula) usada para
  determinar a qual mês pertence; a soma das despesas de um mês compõe o total dividido pelos
  pagantes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A partir do Calculador, o usuário consegue obter o valor por pagante de um mês em no
  máximo 3 passos (selecionar mês → informar pagantes → ver resultado), em menos de 30 segundos.
- **SC-002**: Para qualquer total de mês e qualquer número de pagantes N ≥ 1, o valor por pagante
  exibido é o total dividido por N arredondado ao centavo, e N = 1 sempre resulta no valor igual
  ao total do mês.
- **SC-003**: Um número de pagantes informado no Calculador para um mês aparece de forma idêntica
  no card "Total Pagantes" do Dashboard quando o mesmo mês está selecionado, em 100% dos casos.
- **SC-004**: Nenhuma entrada de pagantes menor que 1, vazia ou não inteira é aceita; em 100% das
  tentativas inválidas o sistema exibe erro e não calcula.
- **SC-005**: Quando um mês não tem pagantes informado, tanto o Calculador quanto o card do
  Dashboard exibem o estado vazio definido, sem exibir "0" nem valores monetários incorretos.
- **SC-006**: Um usuário nunca consegue visualizar ou alterar o número de pagantes de uma
  residência da qual não faz parte.

## Assumptions

- **Arredondamento e resto**: o valor por pagante é arredondado ao centavo mais próximo
  (equivalente a arredondamento sobre o valor em centavos) e exibe-se apenas esse valor único por
  pagante, sem "acerto de sobra" atribuído a um pagante específico. Decisão intencional para manter
  a leitura simples, conforme recomendado no prompt da spec. O critério de desempate para o meio
  centavo (0,5) é arredondamento para cima (half-up), equivalente a `Math.round` sobre o valor em
  centavos.
- **Recorte por mês e fuso**: o total do mês usa a data de vencimento (`dueDate`) como referência e
  o mesmo fuso fixo da aplicação (`America/Sao_Paulo`) adotado na spec 010, reaproveitando a lógica
  de agregação já existente do Dashboard.
- **Despesas sem data de vencimento**: ficam fora do Calculador (que sempre opera sobre um mês
  específico), coerente com a spec 010, que as exclui de qualquer mês específico. Não há bucket
  "Sem data" no seletor do Calculador.
- **Escopo do mês no Dashboard**: o card "Total Pagantes" reflete o mês selecionado no Dashboard
  (spec 010). Não há definição de comportamento para uma visão "Todos os meses" além de exibir o
  estado vazio, já que pagantes são um conceito por mês específico.
- **Estado vazio do card**: representado por "—" (travessão) quando não há número de pagantes
  informado para o mês.
- **Limite de pagantes**: aceita qualquer inteiro ≥ 1; não há limite superior de negócio definido
  nesta spec.
- **Persistência exige mudança de dados**: guardar pagantes por mês requer uma nova estrutura de
  armazenamento (o conceito de "pagante" não existe hoje nas despesas), incluindo remoção em
  cascata quando a residência é excluída.

## Out of Scope

- Exibir "Total Pagantes" na tela de Despesas (mantido apenas no Calculador e no Dashboard).
- Comparação entre meses ou série temporal de pagantes.
- Exportação de relatório do Calculador.
- Rateio desigual entre pagantes (cada pagante paga um valor diferente).
- Edição do número de pagantes fora do Calculador.
