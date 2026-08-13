# Feature Specification: Regras de Senha no Cadastro

**Feature Branch**: `006-signup-password-rules`

**Created**: 2026-08-13

**Status**: Draft

**Input**: User description: "Spec 006 — Regras de senha no cadastro. Na tela de cadastro, exibir ao usuário as regras de senha de forma clara, para que ele saiba o que é exigido antes de submeter o formulário. Regra mínima: 'ao menos 8 caracteres'. Se novas regras forem adotadas, aplicá-las no schema Zod e alinhadas ao Better Auth. Apresentar como texto de apoio abaixo do campo e/ou checklist de requisitos em tempo real, usando apenas shadcn/ui e tokens de tema. Fora de escopo: recuperação/troca de senha; alteração de política para usuários já cadastrados."

## Clarifications

### Session 2026-08-13

- Q: Como a senha deve ser tratada quanto a espaços em branco na contagem de caracteres? → A: Sem trim — a senha é validada exatamente como digitada; espaços (inclusive nas bordas) contam como caracteres, de forma idêntica no cliente, no servidor e no checklist (alinhado ao comportamento padrão do Better Auth).
- Q: Como apresentar a regra de tamanho máximo de 128 caracteres ao usuário? → A: Apenas o mínimo de 8 aparece como item do checklist em tempo real; o máximo de 128 é comunicado como texto de apoio e vira mensagem de erro somente quando excedido (não é um item de checklist).
- Q: Quando a mensagem de erro inline da senha (erro de campo) deve aparecer? → A: Apenas após o submit; o checklist de requisitos em tempo real é a única superfície de feedback enquanto o usuário digita, evitando feedback duplicado.
- Q: O botão "Criar conta" deve ser desabilitado até a senha atender à política? → A: Não; o botão permanece habilitado e a validação ocorre no submit (bloqueando a chamada de autenticação se inválido), preservando acessibilidade e alinhado ao comportamento atual.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Conhecer as regras de senha antes de submeter (Priority: P1)

Ao chegar no formulário de cadastro, o usuário vê, junto ao campo de senha, um texto de apoio que descreve claramente o que é exigido de uma senha válida (no mínimo: "ao menos 8 caracteres"). Ele lê a exigência **antes** de digitar e de tentar submeter, evitando a frustração de descobrir a regra somente após um erro de validação.

**Why this priority**: É o núcleo da funcionalidade e entrega valor sozinho. Sem essa informação visível, o usuário só descobre a política ao errar, aumentando abandono no cadastro. Exibir a regra de forma estática já resolve o problema central com o menor esforço.

**Independent Test**: Abrir a tela de cadastro e confirmar que as regras de senha estão visíveis e legíveis junto ao campo de senha, sem depender de digitar nada nem submeter o formulário.

**Acceptance Scenarios**:

1. **Given** um usuário na tela de cadastro, **When** a tela é carregada, **Then** as regras de senha exigidas são exibidas de forma legível próximas ao campo de senha, antes de qualquer interação.
2. **Given** as regras exibidas, **When** o usuário as lê, **Then** o texto descreve pelo menos a exigência de "ao menos 8 caracteres" em linguagem clara e sem jargão técnico.
3. **Given** um campo de senha com erro de validação após submissão, **When** o erro é exibido, **Then** a mensagem de erro é consistente com as regras apresentadas (não introduz nem contradiz nenhuma regra).

---

### User Story 2 - Acompanhar em tempo real quais regras já foram atendidas (Priority: P2)

Enquanto digita a senha, o usuário vê um checklist de requisitos que marca automaticamente cada regra conforme ela passa a ser atendida (ex.: o item "ao menos 8 caracteres" fica visualmente concluído ao alcançar o 8º caractere). Isso guia o usuário a montar uma senha válida na primeira tentativa.

**Why this priority**: Melhora a experiência e reduz tentativas com erro, mas não é indispensável para resolver o problema central — a US1 já entrega valor. Depende da US1 estar no lugar.

**Independent Test**: Digitar progressivamente uma senha no campo e confirmar que cada requisito muda de estado (pendente → atendido) no momento em que passa a ser satisfeito, e volta a pendente se o usuário apagar caracteres.

**Acceptance Scenarios**:

1. **Given** o campo de senha vazio, **When** a tela é carregada, **Then** todos os requisitos aparecem no estado "pendente".
2. **Given** o usuário digitando a senha, **When** um requisito passa a ser atendido, **Then** aquele item do checklist muda para o estado "atendido" imediatamente, sem necessidade de submeter.
3. **Given** um requisito já atendido, **When** o usuário apaga caracteres e ele deixa de ser satisfeito, **Then** o item volta ao estado "pendente".
4. **Given** todos os requisitos atendidos, **When** o usuário observa o checklist, **Then** todos os itens aparecem como concluídos, indicando que a senha satisfaz a política.

---

### Edge Cases

- **Senha acima do limite máximo**: o usuário digita mais de 128 caracteres. O sistema deve impedir o cadastro e exibir uma mensagem de erro específica de tamanho máximo (o máximo não é um item do checklist, apenas texto de apoio). O limite deve ser aplicado de forma idêntica no cliente e no servidor, rejeitando consistentemente.
- **Divergência cliente/servidor**: se uma regra existir apenas na validação do cliente e não na do servidor (ou vice-versa), o usuário pode ser aprovado num lugar e rejeitado no outro. Toda regra exibida DEVE ser efetivamente aplicada de forma idêntica na validação do cliente e do servidor.
- **Espaços em branco**: o usuário digita apenas espaços ou espaços nas bordas. A senha é validada exatamente como digitada, sem trim: espaços — inclusive nas bordas — contam como caracteres. A contagem para "ao menos 8" é idêntica no checklist, na validação do cliente e na do servidor (ex.: 8 espaços formam uma senha válida de 8 caracteres). Nenhum recorte silencioso é aplicado que faça o checklist divergir do resultado da submissão.
- **Acessibilidade**: usuários que navegam por teclado ou leitor de tela precisam perceber as regras e as mudanças de estado do checklist (o feedback não pode depender apenas de cor).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A tela de cadastro DEVE exibir as regras de senha próximas ao campo de senha, visíveis antes de qualquer interação do usuário e antes da submissão.
- **FR-002**: As regras exibidas DEVEM incluir, no mínimo, "a senha deve ter ao menos 8 caracteres", em linguagem clara para usuários não técnicos.
- **FR-003**: As regras exibidas DEVEM comunicar o limite máximo de 128 caracteres como texto de apoio (não como item do checklist em tempo real), coerente com a política de autenticação vigente.
- **FR-004**: Toda regra comunicada ao usuário DEVE ser aplicada de forma idêntica na validação do cliente e na validação do servidor, de modo que uma senha aceita/rejeitada num lado seja igualmente aceita/rejeitada no outro.
- **FR-005**: O sistema DEVE fornecer feedback em tempo real (checklist de requisitos) que reflita, enquanto o usuário digita, quais regras já foram atendidas e quais permanecem pendentes. O checklist DEVE conter o requisito de mínimo ("ao menos 8 caracteres"); o limite máximo de 128 caracteres NÃO é um item do checklist e DEVE ser sinalizado por mensagem de erro somente quando excedido. O momento em que o erro inline de campo aparece é definido em FR-010.
- **FR-006**: O feedback de requisitos DEVE atualizar-se tanto ao adicionar quanto ao remover caracteres, refletindo sempre o estado atual do campo.
- **FR-007**: As mensagens de erro de validação da senha DEVEM ser consistentes com as regras exibidas, sem introduzir exigências não comunicadas nem contradizer as apresentadas.
- **FR-008**: A apresentação das regras e do checklist DEVE comunicar o estado de cada requisito por um meio que não dependa exclusivamente de cor (ex.: ícone e/ou texto), garantindo percepção por leitores de tela e por usuários com baixa distinção de cores.
- **FR-009**: O escopo DEVE limitar-se à tela de cadastro; fluxos de recuperação/troca de senha e alteração de política para usuários já cadastrados estão fora de escopo.
- **FR-010**: A mensagem de erro inline do campo de senha (erro de campo) DEVE aparecer somente após a tentativa de submissão; enquanto o usuário digita, o checklist de requisitos em tempo real (FR-005) é a única superfície de feedback, evitando feedback duplicado.
- **FR-011**: O botão de submissão do cadastro DEVE permanecer habilitado independentemente do estado da senha (exceto durante o carregamento); a validação da política ocorre na submissão, bloqueando a chamada de autenticação quando a senha for inválida e exibindo o erro correspondente. O botão NÃO DEVE ser desabilitado por requisitos de senha não atendidos.

### Key Entities

- **Política de Senha**: conjunto de regras que definem uma senha válida no cadastro. Atributos: tamanho mínimo (8 caracteres) e tamanho máximo (128 caracteres), medidos sobre a senha exatamente como digitada (sem trim; espaços contam). É a fonte única da verdade que alimenta tanto o texto exibido, quanto o checklist em tempo real (que expõe o mínimo), quanto a validação de cliente e servidor (que aplicam mínimo e máximo).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos usuários que abrem a tela de cadastro conseguem ver as regras de senha sem precisar submeter o formulário nem interagir com o campo.
- **SC-002**: Ao digitar uma senha que atende à política, o usuário vê todos os requisitos marcados como atendidos, e ao submeter a senha é aceita — sem divergência entre o checklist e o resultado da submissão em nenhum caso testado.
- **SC-003**: Nenhuma senha exibida como "atendendo todas as regras" pelo checklist é rejeitada pelo servidor, e nenhuma senha marcada como pendente é aceita — consistência cliente/servidor de 100%.
- **SC-004**: Redução mensurável de submissões de cadastro rejeitadas por senha inválida após a introdução das regras visíveis e do feedback em tempo real.
- **SC-005**: As mudanças de estado do checklist são percebidas por tecnologias assistivas (leitor de tela) e não dependem apenas de cor, verificável em teste de acessibilidade.

## Assumptions

- **Política vigente mantida**: a política de senha efetiva permanece a atual — mínimo 8 e máximo 128 caracteres — herdada do default do provedor de autenticação e já refletida no schema de validação (`min(8)`). A feature foca em **comunicar** essa política com clareza, não em endurecê-la. O limite máximo de 128, hoje aplicado apenas pelo provedor de autenticação, passa a ser explicitado também na validação do cliente para manter cliente e servidor alinhados (FR-004).
- **Sem novas regras de complexidade nesta entrega**: exigências adicionais (ex.: obrigar letra e número, evitar sequências óbvias) NÃO são introduzidas nesta spec para não endurecer a política sem decisão explícita. Caso sejam desejadas no futuro, reutilizam o mesmo mecanismo (fonte única de política → texto + checklist + validação de cliente e servidor).
- **Componentes de UI**: a exibição das regras e do checklist usa exclusivamente componentes shadcn/ui e tokens de tema, conforme a constituição do projeto.
- **Idioma**: os textos exibidos ao usuário seguem o idioma da aplicação (pt-BR), consistente com o restante das telas de autenticação.
- **Cadastro por e-mail e senha**: a feature aplica-se ao fluxo de cadastro por e-mail e senha existente; outros métodos de autenticação estão fora de escopo.
