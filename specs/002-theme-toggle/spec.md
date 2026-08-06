# Feature Specification: Alternância de Tema Claro/Escuro

**Feature Branch**: `002-theme-toggle`

**Created**: 2026-08-06

**Status**: Draft

**Input**: User description: "Botão de alternância de tema claro/escuro. Um único botão (toggle) na interface permite ao usuário alternar entre o tema claro e o tema escuro da aplicação. A preferência escolhida deve persistir entre sessões e recarregamentos de página. Por padrão, na primeira visita, a aplicação deve respeitar o tema do sistema operacional do usuário. O botão exibe um ícone que reflete o estado atual (sol para claro, lua para escuro) e fica acessível na navegação lateral (sidebar), próximo ao botão 'Sair'. A transição de tema não deve causar 'flash' de cor incorreta ao carregar a página."

## Clarifications

### Session 2026-08-06

- Q: Quando o usuário não fez escolha explícita, quando a app deve refletir uma mudança do tema do SO feita durante o uso? → A: Em tempo real, com a tela aberta.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Alternar entre tema claro e escuro (Priority: P1)

Como usuário da aplicação de controle financeiro, quero clicar em um único botão para alternar
entre o tema claro e o tema escuro, de modo a usar a interface com o nível de brilho mais
confortável para o meu ambiente.

**Why this priority**: É o coração da funcionalidade. Sem a capacidade de alternar o tema, nenhuma
outra parte da feature entrega valor. Esta história sozinha já constitui um MVP utilizável.

**Independent Test**: Pode ser testada de ponta a ponta clicando no botão de tema e verificando que
toda a interface muda imediatamente do tema claro para o escuro (e vice-versa), com o ícone
refletindo o novo estado.

**Acceptance Scenarios**:

1. **Given** a aplicação exibida no tema claro, **When** o usuário aciona o botão de tema, **Then** toda a interface passa para o tema escuro e o ícone muda para representar o estado escuro (lua).
2. **Given** a aplicação exibida no tema escuro, **When** o usuário aciona o botão de tema, **Then** toda a interface passa para o tema claro e o ícone muda para representar o estado claro (sol).
3. **Given** a aplicação em qualquer tema, **When** o usuário aciona o botão, **Then** a mudança de cores é aplicada de forma imediata, sem recarregar a página.

---

### User Story 2 - Persistência da preferência entre sessões (Priority: P2)

Como usuário recorrente, quero que o tema escolhido continue valendo quando eu recarregar a página
ou voltar em outra sessão, para não precisar reconfigurá-lo a cada visita.

**Why this priority**: Aumenta significativamente a utilidade da feature ao remover atrito
repetitivo, mas depende da capacidade básica de alternância (P1) já existir.

**Independent Test**: Pode ser testada escolhendo um tema, recarregando a página e uma nova aba, e
confirmando que o tema escolhido é mantido em ambos os casos.

**Acceptance Scenarios**:

1. **Given** o usuário escolheu o tema escuro, **When** ele recarrega a página, **Then** a aplicação continua no tema escuro.
2. **Given** o usuário escolheu o tema claro, **When** ele abre a aplicação em uma nova sessão no mesmo navegador, **Then** a aplicação abre no tema claro.

---

### User Story 3 - Respeitar o tema do sistema na primeira visita (Priority: P3)

Como novo usuário, quero que a aplicação já apareça no tema que combina com a preferência do meu
sistema operacional na primeira vez que a acesso, para ter uma experiência coerente sem precisar
configurar nada.

**Why this priority**: Melhora a primeira impressão e a acessibilidade, mas é um refinamento sobre o
comportamento principal; a feature ainda entrega valor sem isso.

**Independent Test**: Pode ser testada acessando a aplicação pela primeira vez (sem preferência
salva) com o sistema configurado em modo escuro e confirmando que a aplicação abre no tema escuro.

**Acceptance Scenarios**:

1. **Given** um usuário sem preferência de tema salva e sistema em modo escuro, **When** ele acessa a aplicação, **Then** a aplicação é exibida no tema escuro.
2. **Given** um usuário sem preferência de tema salva e sistema em modo claro, **When** ele acessa a aplicação, **Then** a aplicação é exibida no tema claro.

---

### Edge Cases

- **Carregamento inicial sem flash**: Ao carregar ou recarregar a página, a interface DEVE já
  aparecer no tema correto, sem exibir momentaneamente o tema oposto ("flash of incorrect theme").
- **Preferência de sistema alterada durante o uso**: Se o usuário nunca escolheu um tema
  explicitamente e altera a preferência do sistema operacional, a aplicação DEVE refletir a mudança
  em tempo real, com a tela aberta, atualizando o tema imediatamente para acompanhar o sistema.
- **Armazenamento de preferência indisponível**: Caso não seja possível persistir a preferência
  (por exemplo, armazenamento do navegador bloqueado), a alternância ainda deve funcionar dentro da
  sessão atual, apenas sem persistir.
- **Acessibilidade do controle**: O botão deve ser identificável e acionável via teclado e leitores
  de tela, com um rótulo textual que descreva a ação, já que o conteúdo visível é apenas um ícone.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE fornecer um único controle (botão) que permita alternar entre o tema claro e o tema escuro.
- **FR-002**: O sistema DEVE aplicar a mudança de tema imediatamente a toda a interface ao acionar o controle, sem recarregar a página.
- **FR-003**: O controle DEVE exibir um ícone que reflita o estado atual do tema (sol para claro, lua para escuro).
- **FR-004**: O controle DEVE estar acessível na navegação lateral (sidebar), próximo ao botão "Sair".
- **FR-005**: O sistema DEVE persistir a preferência de tema do usuário e reaplicá-la em recarregamentos de página e em novas sessões no mesmo navegador.
- **FR-006**: Na ausência de uma preferência salva, o sistema DEVE adotar o tema correspondente à preferência do sistema operacional do usuário e, enquanto nenhuma preferência explícita existir, DEVE acompanhar em tempo real as mudanças dessa preferência do sistema, com a tela aberta.
- **FR-007**: O sistema DEVE exibir a interface já no tema correto no carregamento inicial, sem apresentar "flash" do tema incorreto.
- **FR-008**: O controle DEVE ser operável por teclado e possuir rótulo textual acessível para leitores de tela.
- **FR-009**: Todas as telas e componentes existentes da aplicação DEVEM ser legíveis e visualmente consistentes em ambos os temas.

### Key Entities *(include if feature involves data)*

- **Preferência de Tema**: Representa a escolha de tema do usuário. Valores possíveis: claro,
  escuro ou "seguir o sistema" (estado padrão quando nenhuma escolha explícita foi feita). Associada
  ao navegador/dispositivo do usuário e persistida localmente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um usuário consegue alternar o tema em uma única ação (um clique/toque ou ativação por teclado).
- **SC-002**: A mudança visual do tema ocorre de forma percebida como imediata (em menos de 1 segundo) após o acionamento.
- **SC-003**: Em 100% dos recarregamentos de página, o tema exibido corresponde à última preferência escolhida pelo usuário.
- **SC-004**: Em 100% dos carregamentos de página, nenhum "flash" perceptível do tema incorreto é exibido antes do tema correto.
- **SC-005**: Na primeira visita sem preferência salva, o tema inicial corresponde à preferência do sistema operacional do usuário.

## Assumptions

- A aplicação já possui os tokens de cor necessários para o tema claro e para o tema escuro, de modo
  que nenhuma nova paleta precisa ser definida — apenas o mecanismo de alternância e o controle.
- Apenas dois temas visíveis são oferecidos ao usuário (claro e escuro); o modo "seguir o sistema"
  existe como estado padrão inicial, mas não é uma terceira opção explícita no controle.
- A persistência da preferência ocorre no armazenamento local do navegador do usuário, por
  dispositivo/navegador, e não é sincronizada entre dispositivos.
- O controle será posicionado na sidebar existente, que já está presente nas telas autenticadas da
  aplicação.
- Usuários acessam a aplicação por navegadores modernos que expõem a preferência de tema do sistema
  operacional.
