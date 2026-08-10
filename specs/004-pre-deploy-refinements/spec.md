# Feature Specification: Melhorias de Experiência e Visual Antes do Deploy

**Feature Branch**: `004-pre-deploy-refinements`

**Created**: 2026-08-09

**Status**: Draft

**Input**: User description: "Conjunto de refinamentos de UX, mensagens de convite e responsividade a serem aplicados sobre o sistema de controle financeiro por residências já existente, preparando o produto para publicação (deploy)."

## Clarifications

### Session 2026-08-09

- Q: Ao tentar convidar um e-mail que já possui um convite RECUSADO na mesma residência (dado o `@@unique([householdId, email])`), o que deve acontecer? → A: Bloquear e informar com mensagem específica; o registro recusado é mantido e nenhum novo convite é criado.
- Q: Onde/como a pessoa convidada visualiza e responde a um convite pendente? → A: Ao acessar a área autenticada, o sistema detecta convites pendentes pelo e-mail e os apresenta em um dialog/tela dedicada com as ações Aceitar/Recusar.
- Q: Como preservar a identidade do autor do convite considerando que ele pode excluir a conta? → A: O convite referencia o usuário autor (FK); ao excluir a conta do autor, seus convites pendentes são cancelados/removidos junto (sem órfãos).
- Q: Como resolver cancelamento do administrador concorrente com a resposta do convidado? → A: A primeira operação que efetivar vence; ambas só agem se o convite estiver pendente, e a segunda falha com mensagem específica (sem prioridade artificial entre atores).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fluxo de convites compreensível de ponta a ponta (Priority: P1)

Um administrador de residência convida uma pessoa por e-mail e passa a acompanhar o status de cada convite (enviado, aceito ou recusado). A pessoa convidada, ao acessar o sistema, vê uma mensagem amigável identificando quem convidou e qual residência, e pode aceitar ou recusar. Após responder, ambos os lados enxergam o resultado.

**Why this priority**: É o principal vazio funcional para o lançamento — hoje o convite não registra quem convidou, não distingue "recusado", e a experiência de quem recebe não é clara. Também é o item com maior impacto no modelo de dados, então precede o polimento visual.

**Independent Test**: Criar um convite como administrador e verificar que ele aparece com status "Enviado" e mensagem amigável; acessar como convidado e recusar; confirmar que o administrador passa a ver "Recusado" e o convidado vê o status resultante — tudo sem depender das demais histórias.

**Acceptance Scenarios**:

1. **Given** um administrador em uma residência, **When** ele convida um e-mail que possui conta na plataforma, **Then** o convite aparece na lista do administrador com o status "Enviado", identificando a residência e o destinatário.
2. **Given** um convite pendente, **When** o convidado abre o sistema, **Then** ele vê uma mensagem no formato "Olá, você recebeu um convite de {nome de quem convidou} para colaborar com o controle financeiro da residência: {nome da residência}." com os botões "Aceitar" e "Recusar".
3. **Given** um convite pendente, **When** o convidado clica em "Aceitar", **Then** ele passa a ter acesso à residência e o administrador vê o status "Aceito".
4. **Given** um convite pendente, **When** o convidado clica em "Recusar", **Then** o convite fica com status "Recusado" para ambos e o convidado não ganha acesso à residência.
5. **Given** um convite com status "Enviado", **When** o administrador cancela o convite, **Then** o convite pendente é removido e deixa de aparecer para o convidado.

---

### User Story 2 - Excluir a própria conta (Priority: P1)

A pessoa usuária, na tela de perfil, pode excluir permanentemente a própria conta, com confirmação explícita. Ao confirmar, ela é removida de todas as residências (aplicando as regras já existentes de saída de residência), tem seus dados pessoais apagados e a sessão é encerrada.

**Why this priority**: Requisito de conformidade e confiança para publicação; envolve remoção em cascata e reajuste de administração/residência ativa, que precisa estar correto antes do deploy.

**Independent Test**: A partir do perfil, solicitar exclusão, confirmar, e verificar que a sessão é encerrada, o login com aquela conta deixa de funcionar e as residências afetadas foram ajustadas conforme as regras de saída.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada na tela de perfil, **When** ela solicita excluir a conta, **Then** o sistema exige uma confirmação explícita antes de executar.
2. **Given** a pessoa é administradora de uma residência com outros membros, **When** ela confirma a exclusão da conta, **Then** a administração é transferida automaticamente para o membro ativo mais antigo dessa residência.
3. **Given** a pessoa é a única integrante de uma residência, **When** ela confirma a exclusão da conta, **Then** essa residência e todos os seus dados (despesas e categorias) são removidos.
4. **Given** a exclusão foi confirmada, **When** o processo termina, **Then** os dados pessoais (sessões, credenciais de autenticação e vínculos de membro) são removidos e a sessão é encerrada.

---

### User Story 3 - Excluir uma residência (Priority: P1)

O administrador de uma residência pode excluí-la permanentemente, com confirmação explícita. Ao confirmar, todos os dados da residência são removidos, os membros perdem o acesso e a residência ativa de quem a tinha selecionada é reajustada.

**Why this priority**: Complementa a gestão de residências para o lançamento e compartilha a lógica de remoção em cascata e reajuste de residência ativa com a US2.

**Independent Test**: Como administrador, excluir uma residência após confirmação e verificar que ela some para todos os membros, que os dados dependentes foram removidos e que a residência ativa dos afetados foi ajustada.

**Acceptance Scenarios**:

1. **Given** um administrador de residência, **When** ele solicita excluir a residência, **Then** o sistema exige confirmação explícita antes de executar.
2. **Given** um membro (não administrador), **When** ele tenta excluir a residência, **Then** a ação é negada com mensagem de permissão insuficiente.
3. **Given** uma residência com despesas, categorias, convites e vários membros, **When** o administrador confirma a exclusão, **Then** todos esses dados são removidos e todos os membros perdem o acesso.
4. **Given** a residência excluída estava selecionada como ativa para um usuário, **When** a exclusão ocorre, **Then** o sistema ajusta a residência ativa desse usuário para outra disponível, ou o direciona ao fluxo de criação de residência caso não reste nenhuma.

---

### User Story 4 - Mensagens de erro claras e em português (Priority: P2)

Em toda interação sujeita a falha (login, cadastro, alteração de senha, convites, ações protegidas e validação de formulários), a pessoa recebe mensagens claras em português, que explicam o que houve e o que fazer, em vez de mensagens genéricas ou técnicas em inglês vindas do provedor de autenticação.

**Why this priority**: Impacta diretamente a percepção de qualidade no primeiro contato do público, mas depende de fluxos já existentes e pode ser entregue após as capacidades funcionais centrais.

**Independent Test**: Reproduzir cada caso de erro mapeado (ex.: login com e-mail inexistente, senha incorreta, convite duplicado) e verificar que a mensagem exibida é específica, em português e orientadora.

**Acceptance Scenarios**:

1. **Given** a tela de login, **When** a pessoa informa um e-mail sem conta cadastrada, **Then** o sistema informa que não existe conta para aquele e-mail e sugere o cadastro.
2. **Given** a tela de login, **When** a pessoa informa a senha incorreta para um e-mail existente, **Then** o sistema informa especificamente que a senha está incorreta.
3. **Given** o cadastro, **When** a senha não atende aos critérios mínimos ou o e-mail está em formato inválido, **Then** a mensagem correspondente é exibida em português junto ao campo.
4. **Given** a alteração de senha no perfil, **When** a senha atual está incorreta ou a nova senha é inválida/igual à atual, **Then** a mensagem específica é exibida.
5. **Given** o envio de convite, **When** o e-mail ainda não tem conta, já é membro, ou já possui convite pendente, **Then** a mensagem específica orienta a pessoa administradora sobre o caso.
6. **Given** uma ação protegida, **When** a sessão expirou, falta permissão, ou o registro não existe/foi removido, **Then** a mensagem correspondente é clara e, quando aplicável, redireciona ao login.

---

### User Story 5 - Saudação personalizada do usuário logado (Priority: P2)

Dentro da área autenticada, a pessoa vê de forma consistente uma saudação "Olá, {nome}" na parte superior das telas internas.

**Why this priority**: Toque de acolhimento simples e de baixo esforço, mas não bloqueia funcionalidades centrais.

**Independent Test**: Autenticar-se e navegar entre dashboard, despesas, categorias, residência e perfil, verificando que a saudação com o nome aparece consistentemente no topo.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada, **When** ela acessa qualquer tela interna, **Then** vê no topo a saudação "Olá, {nome}" com seu nome.
2. **Given** a pessoa navega entre as telas internas, **When** troca de página, **Then** a saudação permanece consistente em posição e formato.

---

### User Story 6 - Entrada clara para o visitante na página inicial (Priority: P2)

Um visitante não autenticado cai na página inicial com exemplos ilustrativos (dashboard, resumo, categorias) que comunicam o produto, com as ações "Entrar" e "Cadastrar" evidentes na área superior/hero.

**Why this priority**: Primeira impressão do público, mas a landing já existe; trata-se de enriquecer e destacar CTAs, sem novas capacidades funcionais.

**Independent Test**: Abrir o app sem estar logado e verificar que a landing exibe exemplos ilustrativos (sem dados reais/consulta ao banco) e que "Entrar" e "Cadastrar" estão em destaque no hero.

**Acceptance Scenarios**:

1. **Given** um visitante não autenticado, **When** ele abre o aplicativo, **Then** vê a página inicial com exemplos fictícios de dashboard, resumo e categorias que não representam dados reais.
2. **Given** a página inicial, **When** o visitante observa a área superior/hero, **Then** as ações "Entrar" e "Cadastrar" estão claramente visíveis e acionáveis.
3. **Given** um usuário já autenticado, **When** ele acessa a raiz do aplicativo, **Then** é redirecionado para a área autenticada (dashboard).

---

### User Story 7 - Design moderno e responsivo em todo o produto (Priority: P3)

Toda a interface — landing e área logada — adota um visual moderno, limpo e consistente no estilo de aplicativos de controle financeiro (seguindo o design system existente) e é totalmente responsiva para celular, tablet e desktop.

**Why this priority**: Eleva a percepção de qualidade e alcança usuários móveis, mas é polimento aplicado sobre as capacidades já entregues nas histórias anteriores.

**Independent Test**: Percorrer landing e telas internas em larguras de celular, tablet e desktop, verificando consistência visual, legibilidade, destaque de valores financeiros e ausência de quebras de layout.

**Acceptance Scenarios**:

1. **Given** qualquer tela do produto, **When** exibida em desktop, tablet e celular, **Then** o layout se reorganiza sem quebras e permanece legível.
2. **Given** a navegação lateral, **When** a tela é pequena, **Then** ela se adapta (por exemplo, recolhendo em um menu acessível).
3. **Given** tabelas, cards e gráficos, **When** a largura reduz, **Then** eles se reorganizam sem estourar o layout.
4. **Given** landing e área logada, **When** comparadas, **Then** mantêm consistência de cores de tema, tipografia, espaçamento e componentes, com destaque para valores financeiros.

---

### Edge Cases

- **Convite sem conta**: e-mail convidado que ainda não possui conta na plataforma deve orientar que a pessoa precisa se cadastrar primeiro; não pode gerar convite "fantasma".
- **Convite inválido**: convite inexistente, já respondido, expirado ou que não pertence à conta do usuário deve exibir mensagem específica e não permitir ação.
- **Exclusão de conta de único administrador com outros membros**: a administração deve ser transferida ao membro ativo mais antigo antes de remover o vínculo do usuário.
- **Exclusão da residência ativa**: se a residência excluída (via US2 ou US3) era a ativa de alguém, o sistema deve reajustar para outra disponível ou levar ao fluxo de criação.
- **Confirmação abandonada**: se a pessoa não confirmar a exclusão (conta ou residência), nenhum dado é alterado.
- **Nome de usuário ausente/vazio** na saudação: o sistema deve exibir uma saudação segura sem quebrar o layout.
- **Recusa vs. cancelamento simultâneos**: administrador cancela enquanto o convidado responde — ambas as operações só têm efeito enquanto o convite estiver pendente; a primeira a efetivar vence e a segunda falha com mensagem específica (ex.: "este convite não está mais pendente"), sem estados órfãos e sem prioridade artificial entre os atores.
- **Login de conta não verificada** (caso a verificação de e-mail esteja ativa): mensagem específica orientando a verificação.

## Requirements *(mandatory)*

### Functional Requirements

**Convites**

- **FR-001**: O sistema DEVE registrar, para cada convite, uma referência ao usuário que o criou (administrador autor), de modo a exibir "convite de {nome de quem convidou}". Ao excluir a conta do autor, seus convites pendentes DEVEM ser cancelados/removidos junto, sem deixar referência órfã.
- **FR-002**: O sistema DEVE suportar os estados de convite: pendente/enviado, aceito e recusado.
- **FR-003**: O administrador DEVE visualizar cada convite enviado com mensagem amigável identificando a residência e o destinatário, e com seu status atual.
- **FR-004**: O administrador DEVE poder cancelar convites que estejam pendentes.
- **FR-005**: Ao acessar a área autenticada, a pessoa convidada DEVE ter seus convites pendentes detectados pelo e-mail e apresentados em um dialog/tela dedicada com a mensagem amigável no formato "Olá, você recebeu um convite de {nome de quem convidou} para colaborar com o controle financeiro da residência: {nome da residência}." e as ações "Aceitar" e "Recusar".
- **FR-006**: A pessoa convidada DEVE dispor de duas ações — aceitar e recusar — e, após responder, DEVE ver o status resultante (aceito ou recusado).

**Exclusão de conta**

- **FR-007**: A pessoa usuária DEVE poder excluir a própria conta a partir da tela de perfil.
- **FR-008**: O sistema DEVE exigir confirmação explícita antes de executar a exclusão de conta, tratando-a como ação irreversível.
- **FR-009**: Ao excluir a conta, o sistema DEVE remover a pessoa de todas as suas residências aplicando as regras existentes de saída de residência (transferência de administração ao membro ativo mais antigo quando houver outros membros; remoção da residência e seus dados quando for a única integrante).
- **FR-010**: Ao excluir a conta, o sistema DEVE remover todos os dados vinculados exclusivamente à pessoa (sessões, credenciais/autenticação, vínculos de membro e convites pendentes que a pessoa criou como autora) e encerrar a sessão ao final.

**Exclusão de residência**

- **FR-011**: Somente o administrador da residência DEVE poder excluí-la; membros DEVEM ser impedidos com mensagem de permissão insuficiente.
- **FR-012**: O sistema DEVE exigir confirmação explícita antes de excluir a residência, tratando-a como ação irreversível.
- **FR-013**: Ao excluir a residência, o sistema DEVE remover todos os seus dados dependentes (despesas, categorias, convites e vínculos de membros) e revogar o acesso de todos os membros.
- **FR-014**: Ao excluir uma residência que estava selecionada como ativa para algum usuário, o sistema DEVE reajustar a residência ativa desse usuário para outra disponível ou direcioná-lo ao fluxo de criação de residência quando não houver nenhuma.
- **FR-015**: O sistema DEVE garantir que nenhuma exclusão (conta ou residência) deixe registros órfãos.

**Mensagens de erro**

- **FR-016**: O sistema DEVE exibir mensagens de erro claras, em português, orientando o que houve e o que fazer, mapeando os códigos do provedor de autenticação para mensagens amigáveis (sem exibir texto cru do backend).
- **FR-017**: No login, o sistema DEVE distinguir "não há conta com este e-mail" (sugerindo cadastro) de "senha incorreta", e informar conta não verificada quando aplicável.
- **FR-018**: No cadastro, o sistema DEVE tratar e-mail já cadastrado, senha fraca/fora dos critérios mínimos e e-mail em formato inválido.
- **FR-019**: Na alteração de senha, o sistema DEVE tratar senha atual incorreta e nova senha inválida ou igual à atual.
- **FR-020**: Nos convites, o sistema DEVE tratar: e-mail sem conta na plataforma, e-mail que já é membro, convite duplicado (pendente já existente), e-mail que já recusou um convite anterior nessa residência (o sistema DEVE bloquear o novo convite com mensagem específica, mantendo o registro recusado e sem reabri-lo), e convite inexistente/já respondido/expirado/de outra conta.
- **FR-021**: Nas ações protegidas, o sistema DEVE tratar não autenticado/sessão expirada (com redirecionamento ao login quando aplicável), falta de permissão e registro não encontrado/já removido.
- **FR-022**: O sistema DEVE padronizar as mensagens de validação de formulário (campos obrigatórios, limites de tamanho, formatos) em português, exibidas junto ao campo correspondente, e padronizar o canal de exibição (toast x erro no campo) e o tom em todo o app.

**Saudação e entrada**

- **FR-023**: A área autenticada DEVE exibir de forma consistente, no topo das telas internas (dashboard, despesas, categorias, residência, perfil), a saudação "Olá, {nome}" com o nome da pessoa logada.
- **FR-024**: A página inicial DEVE exibir, para visitantes não autenticados, exemplos ilustrativos e estáticos (dashboard, resumo, categorias) que não representam dados reais nem consultam o banco, com as ações "Entrar" e "Cadastrar" evidentes na área superior/hero.
- **FR-025**: O sistema DEVE redirecionar o usuário autenticado da raiz do aplicativo para a área autenticada (dashboard).

**Design e responsividade**

- **FR-026**: Toda a interface (landing e área logada) DEVE adotar visual moderno, limpo e consistente, seguindo o design system existente (cores de tema, tipografia, espaçamento e componentes), com destaque para valores financeiros.
- **FR-027**: Toda a interface DEVE ser responsiva para celular, tablet e desktop; a navegação lateral DEVE se adaptar em telas pequenas (ex.: recolher em menu acessível) e tabelas, cards e gráficos DEVEM reorganizar-se sem quebrar o layout.

### Key Entities *(include if feature involves data)*

- **Convite (Invitation)**: Representa o convite de uma pessoa para colaborar em uma residência. Atributos-chave: residência associada, e-mail/destinatário convidado, **referência ao usuário autor** (administrador que o criou) e **status** (pendente/enviado, aceito, recusado). Restrição de unicidade por (residência, e-mail): existe no máximo um registro de convite por e-mail em cada residência; um convite recusado bloqueia novos convites ao mesmo e-mail nessa residência. Ao excluir a conta do autor, seus convites pendentes são cancelados/removidos. Relaciona-se com Residência e com Usuário (autor e destinatário).
- **Usuário (User)**: Pessoa autenticada. Relevante aqui pelo nome (saudação), pelas credenciais/sessões (removidas na exclusão de conta) e pelos vínculos de membro.
- **Residência (Household)**: Agrupamento de dados financeiros compartilhados. Relaciona-se com membros, convites, despesas e categorias; é alvo de exclusão em cascata e de reajuste de residência ativa.
- **Vínculo de Membro (Membership)**: Associação entre Usuário e Residência, com papel (Administrador/Membro) e antiguidade (usada para transferência de administração ao membro ativo mais antigo).
- **Residência Ativa**: Seleção, por usuário, da residência atualmente em foco; deve ser reajustada quando a residência ativa é excluída.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos convites enviados, o administrador consegue identificar destinatário, residência e status (enviado/aceito/recusado) sem sair da tela de gestão de convites.
- **SC-002**: Uma pessoa convidada consegue entender de quem e para qual residência é o convite e responder (aceitar ou recusar) em menos de 30 segundos a partir do primeiro acesso ao convite.
- **SC-003**: 100% das mensagens de erro nos fluxos mapeados (login, cadastro, senha, convites, ações protegidas e validação) são exibidas em português, específicas ao caso, sem qualquer texto cru do provedor de autenticação em inglês.
- **SC-004**: Uma pessoa consegue localizar e concluir a exclusão da própria conta a partir do perfil, com confirmação, em menos de 1 minuto, e a exclusão não deixa nenhum registro órfão.
- **SC-005**: 100% das exclusões de conta e de residência aplicam corretamente a transferência de administração/limpeza em cascata e reajustam a residência ativa dos usuários afetados.
- **SC-006**: A saudação "Olá, {nome}" aparece em 100% das telas internas listadas, de forma consistente.
- **SC-007**: Um visitante não autenticado identifica e aciona "Entrar" ou "Cadastrar" na página inicial em menos de 10 segundos, sem que nenhum dado real seja exibido.
- **SC-008**: Todas as telas (landing e área logada) são utilizáveis sem quebras de layout e sem rolagem horizontal indevida em larguras representativas de celular (≈360px), tablet (≈768px) e desktop (≥1024px).

## Assumptions

- O sistema de residências, papéis (Administrador/Membro), múltiplas residências, seletor de residência ativa e isolamento de dados já está implementado e será reutilizado.
- As regras de saída de residência (transferência de administração ao membro ativo mais antigo; remoção da residência quando há um único integrante) já estão definidas e servem de base para a exclusão de conta e de residência.
- "Membro ativo mais antigo" refere-se ao vínculo de membro mais antigo entre os membros ativos da residência.
- A verificação de e-mail pode estar ativa ou não; a mensagem de "conta não verificada" só se aplica quando a verificação estiver habilitada.
- A escolha consciente de revelar, no login, se um e-mail está ou não cadastrado (enumeração de contas) é aceita para este produto, priorizando a experiência amigável, conforme decisão registrada no prompt.
- O design system em `design/` é a referência de cores de tema, tipografia, espaçamento e componentes; nenhuma nova identidade visual será criada fora dele.
- Estão fora de escopo: reenvio de convites recusados, notificações por e-mail e integrações externas de envio; e quaisquer mudanças nas regras de papéis, transferência de administração e isolamento de dados já implementadas.
- Os exemplos da landing permanecem estáticos e nunca consultam o banco de dados.
