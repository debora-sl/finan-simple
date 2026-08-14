# Feature Specification: Cofrinho (valor guardado pela família)

**Feature Branch**: `007-household-savings`

**Created**: 2026-08-14

**Status**: Draft

**Input**: User description: "Spec 007 — Cofrinho. Permitir que a família registre quanto tem guardado ('cofrinho') e acompanhe esse total. O valor pertence à residência (household) e é compartilhado por todos os membros. Inclui nova opção de navegação, tela de gestão do valor guardado e um card no Dashboard exibindo o total. Fora de escopo: metas/objetivos de poupança; múltiplos cofrinhos por household; histórico de rendimentos ou gráficos de evolução."

## Clarifications

### Session 2026-08-14

- Q: Se dois membros salvarem valores diferentes quase ao mesmo tempo, qual comportamento adotar? → A: Last-write-wins — a submissão mais recente substitui o total, sem aviso de conflito.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar e atualizar o valor guardado da família (Priority: P1)

Um membro da família acessa uma nova opção no menu ("Cofrinho") e vê o valor atualmente guardado pela residência. Ele pode cadastrar o valor pela primeira vez ou atualizar o total sempre que a família guardar mais ou usar parte do dinheiro, mantendo um único número que representa quanto a família tem guardado hoje.

**Why this priority**: É o núcleo da funcionalidade e entrega valor sozinho. Sem a capacidade de registrar e atualizar o valor guardado, não há cofrinho. Uma tela que apenas exibe e edita o total já resolve o problema central.

**Independent Test**: Acessar a opção "Cofrinho" no menu, informar um valor em reais, salvar e confirmar que o valor persiste e é exibido corretamente ao recarregar a tela; em seguida, alterar o valor e confirmar que o total exibido reflete a atualização.

**Acceptance Scenarios**:

1. **Given** um membro autenticado cuja residência ainda não tem valor guardado, **When** ele acessa a tela do Cofrinho, **Then** o valor guardado é exibido como zero (R$ 0,00).
2. **Given** um membro na tela do Cofrinho, **When** ele informa um valor em reais e salva, **Then** o valor é persistido e passa a ser exibido formatado em Real.
3. **Given** um valor guardado já cadastrado, **When** o membro informa um novo valor e salva, **Then** o total anterior é substituído pelo novo valor informado.
4. **Given** um valor guardado cadastrado por um membro, **When** outro membro da mesma residência acessa a tela do Cofrinho, **Then** ele vê o mesmo valor guardado (o cofrinho é compartilhado por toda a residência).

---

### User Story 2 - Acompanhar o total guardado no Dashboard (Priority: P2)

Ao abrir o Dashboard, a família vê, entre os cards de resumo, um card com o total atualmente guardado no cofrinho, formatado em Real, no mesmo padrão visual dos demais cards de resumo. Isso dá visibilidade imediata do quanto a família tem reservado, sem precisar entrar na tela de gestão.

**Why this priority**: Amplia a visibilidade do valor guardado e integra o cofrinho à visão geral das finanças, mas não é indispensável para resolver o problema central — a US1 já entrega valor de forma autônoma. Depende de existir um valor guardado (US1).

**Independent Test**: Cadastrar um valor no cofrinho e abrir o Dashboard, confirmando que um card exibe exatamente esse total formatado em Real, alinhado aos demais cards de resumo.

**Acceptance Scenarios**:

1. **Given** um valor guardado cadastrado, **When** o membro abre o Dashboard, **Then** um card exibe o total guardado formatado em Real.
2. **Given** uma residência sem valor guardado cadastrado, **When** o membro abre o Dashboard, **Then** o card do cofrinho exibe R$ 0,00.
3. **Given** o valor guardado é atualizado na tela do Cofrinho, **When** o membro retorna ao Dashboard, **Then** o card reflete o novo total.

---

### Edge Cases

- **Valor zero**: a família zera o cofrinho (gastou tudo o que estava guardado). O sistema deve aceitar zero como valor válido e exibir R$ 0,00 tanto na tela de gestão quanto no card do Dashboard.
- **Valor negativo**: o usuário tenta informar um valor negativo. O sistema deve rejeitar a submissão com mensagem clara, pois um valor guardado não pode ser negativo.
- **Valor não numérico ou vazio**: o usuário submete o campo vazio ou com texto inválido. O sistema deve rejeitar e orientar o preenchimento de um valor monetário válido.
- **Centavos**: o usuário informa um valor com centavos (ex.: R$ 150,75). O total deve ser preservado com precisão de centavos, sem arredondamentos indevidos.
- **Usuário sem residência ativa**: um usuário autenticado que ainda não pertence a nenhuma residência tenta acessar o Cofrinho. O acesso à gestão do valor deve depender de haver uma residência ativa associada ao usuário.
- **Acesso de não-membro**: um usuário tenta salvar ou visualizar o cofrinho de uma residência à qual não pertence. A operação deve ser negada.
- **Edições concorrentes**: dois membros da mesma residência salvam valores diferentes quase ao mesmo tempo. O sistema aplica last-write-wins — a submissão mais recente substitui o total, sem aviso de conflito nem bloqueio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST manter, por residência, um único valor guardado ("cofrinho") compartilhado por todos os membros da residência.
- **FR-002**: O sistema MUST oferecer uma nova opção de navegação ("Cofrinho") que leve à tela de gestão do valor guardado.
- **FR-003**: A tela de gestão MUST exibir o valor atualmente guardado pela residência ativa, formatado em Real.
- **FR-004**: Usuários MUST poder cadastrar o valor guardado quando ainda não existir, informando um valor em reais.
- **FR-005**: Usuários MUST poder atualizar o valor guardado, substituindo o total anterior pelo novo valor informado.
- **FR-006**: O sistema MUST preservar valores com precisão de centavos, sem perda ou arredondamento indevido.
- **FR-007**: O sistema MUST aceitar zero como valor válido e rejeitar valores negativos, vazios ou não numéricos, exibindo mensagem clara de validação.
- **FR-008**: O sistema MUST persistir o valor guardado de forma que permaneça disponível entre sessões e para todos os membros da mesma residência.
- **FR-009**: O sistema MUST permitir cadastrar/atualizar o valor guardado apenas para usuários autenticados que pertençam à residência correspondente.
- **FR-010**: O Dashboard MUST exibir um card com o total guardado da residência ativa, formatado em Real, seguindo o mesmo padrão visual dos demais cards de resumo.
- **FR-011**: Quando a residência não tiver valor guardado cadastrado, o sistema MUST exibir R$ 0,00 tanto na tela de gestão quanto no card do Dashboard.
- **FR-012**: As alterações feitas na tela de gestão MUST refletir no card do Dashboard na próxima visualização.
- **FR-013**: Em edições concorrentes de membros da mesma residência, o sistema MUST aplicar last-write-wins, mantendo como total vigente o valor da submissão mais recente, sem exigir confirmação de conflito.

### Key Entities *(include if feature involves data)*

- **Cofrinho (valor guardado)**: representa o montante que a residência tem guardado no momento. Atributos essenciais: valor monetário (com precisão de centavos) e vínculo com a residência. Relaciona-se com a residência (Household) na proporção de um valor guardado por residência.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um membro consegue cadastrar ou atualizar o valor guardado e vê o total atualizado em menos de 5 segundos após salvar.
- **SC-002**: 100% dos valores salvos são exibidos com precisão de centavos, sem divergência entre o valor informado e o valor apresentado.
- **SC-003**: O total exibido na tela de gestão e no card do Dashboard é idêntico para todos os membros da mesma residência em qualquer acesso.
- **SC-004**: 100% das tentativas de salvar valores inválidos (negativos, vazios ou não numéricos) são rejeitadas com mensagem de erro compreensível.
- **SC-005**: Um novo usuário consegue localizar a opção "Cofrinho" no menu e concluir o primeiro cadastro do valor guardado em menos de 1 minuto.

## Assumptions

- **Modelagem por valor único**: o cofrinho é modelado como um único valor por residência (não como histórico de lançamentos que somam o total). Essa escolha decorre do escopo, que exclui histórico de rendimentos e gráficos de evolução; um número único atende ao objetivo com a menor complexidade de UI.
- **Edição por substituição**: atualizar o cofrinho significa definir/substituir o total atual diretamente, e não registrar depósitos/retiradas incrementais.
- **Escopo por residência**: o valor guardado pertence à residência (Household) e é compartilhado por todos os seus membros, seguindo o mesmo padrão já usado para despesas e categorias.
- **Residência ativa**: a resolução de qual residência é a "ativa" para o usuário reutiliza o padrão já existente nas demais telas do aplicativo.
- **Moeda**: os valores são exibidos em Real (BRL) e armazenados com precisão de centavos, reutilizando o padrão de formatação de moeda já adotado no projeto.
- **Fora de escopo**: metas/objetivos de poupança; múltiplos cofrinhos por residência; histórico de rendimentos ou gráficos de evolução do valor guardado.
