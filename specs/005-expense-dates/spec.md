# Feature Specification: Datas de Vencimento e Pagamento em Despesas

**Feature Branch**: `005-expense-dates`

**Created**: 2026-08-11

**Status**: Draft

**Input**: User description: "Datas em Despesas: adicionar Data de Vencimento, Data do Pagamento e a opção 'Sem data de vencimento' ao cadastro/edição de despesas. Incluir também a correção do bug de timezone/UTC em que a data cadastrada aparece um dia antes na listagem (ex.: usuário informa 20/08/2026 e a lista mostra 19/08/2026) — a data deve ser exibida exatamente como informada. Referência: docs/proximos-passos-melhorias.md item 7 (absorve o antigo item 8)."

## Clarifications

### Session 2026-08-11

- Q: Como a Data do Pagamento se relaciona com o estado "pago" da despesa? → A: A Data do Pagamento controla o estado — preenchê-la marca a despesa como paga; limpá-la volta a "em aberto". Não há marcador manual de pago separado.
- Q: As despesas legadas têm hoje uma única data. Como interpretá-la? → A: A data atual passa a ser a Data de Vencimento; nenhuma despesa legada recebe Data do Pagamento automaticamente.
- Q: Data do Pagamento no futuro deve ser permitida? → A: Não; a Data do Pagamento não pode ser posterior ao dia atual — datas futuras são rejeitadas com mensagem.
- Q: Contra qual "hoje" a rejeição de Data do Pagamento futura deve ser medida? → A: O dia atual do calendário local do usuário (não o UTC do servidor), coerente com exibir a data exatamente como informada.
- Q: Onde as despesas "Sem data de vencimento" aparecem na ordenação da listagem? → A: Ao final da lista, após todas as despesas com data de vencimento (que seguem ordenadas por vencimento).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar despesa com data de vencimento ou marcá-la como sem vencimento (Priority: P1)

Ao cadastrar ou editar uma despesa, o usuário informa a **Data de Vencimento** — quando aquela despesa precisa ser paga. Para despesas que não têm um prazo definido (ex.: uma compra à vista já quitada, uma despesa avulsa), o usuário pode marcar **"Sem data de vencimento"**, e o campo de data deixa de ser exigido.

**Why this priority**: É o núcleo da funcionalidade. Sem a data de vencimento a família não consegue se organizar sobre o que está por vencer, e a opção "sem vencimento" evita forçar uma data artificial em despesas que não têm prazo.

**Independent Test**: Cadastrar uma despesa informando uma data de vencimento e confirmar que ela é salva e listada com essa data; cadastrar outra marcando "Sem data de vencimento" e confirmar que ela é salva sem data e assim identificada na listagem — tudo sem depender das demais histórias.

**Acceptance Scenarios**:

1. **Given** um usuário no formulário de nova despesa, **When** ele informa a Data de Vencimento e salva, **Then** a despesa é criada e aparece na listagem com a data de vencimento informada.
2. **Given** um usuário no formulário de nova despesa, **When** ele marca "Sem data de vencimento", **Then** o campo de data de vencimento deixa de ser obrigatório e a despesa é salva sem data de vencimento.
3. **Given** uma despesa marcada como "Sem data de vencimento", **When** ela é exibida na listagem, **Then** o sistema a identifica claramente como sem data de vencimento (em vez de mostrar uma data em branco ou inválida).
4. **Given** o formulário sem "Sem data de vencimento" marcado, **When** o usuário tenta salvar sem informar a Data de Vencimento, **Then** o sistema impede o salvamento e orienta o usuário a informar a data ou marcar "Sem data de vencimento".
5. **Given** uma despesa existente, **When** o usuário a edita e altera a Data de Vencimento (ou marca "Sem data de vencimento"), **Then** a alteração é persistida e refletida na listagem.

---

### User Story 2 - Data exibida exatamente como informada (correção do bug de um dia antes) (Priority: P1)

Ao informar uma data (ex.: 20/08/2026), a data exibida na listagem e no formulário de edição é exatamente a que o usuário digitou — nunca um dia antes ou depois — independentemente do fuso horário do usuário ou do servidor.

**Why this priority**: É um bug de correção que já afeta usuários em produção: datas cadastradas aparecem um dia antes. Compromete a confiança no sistema e distorce a organização financeira. Deve ser corrigido junto com a evolução das datas para não reintroduzir o problema nos novos campos.

**Independent Test**: Cadastrar uma despesa com a data 20/08/2026 e confirmar que a listagem e a tela de edição exibem 20/08/2026 (não 19/08/2026), repetindo o teste com o fuso horário do dispositivo ajustado para um fuso negativo (ex.: UTC-3) e para um fuso positivo. Observação: esta história é validável de forma isolada, mas compartilha os campos de data e os componentes de formulário/listagem introduzidos na US1; na implementação, a correção de fuso é aplicada sobre esses mesmos artefatos (ver ordem de dependências em `tasks.md`).

**Acceptance Scenarios**:

1. **Given** um usuário informando a data 20/08/2026 em uma despesa, **When** ele salva e visualiza a listagem, **Then** a data exibida é 20/08/2026.
2. **Given** uma despesa salva com data 20/08/2026, **When** o usuário abre a despesa para edição, **Then** o campo de data mostra 20/08/2026.
3. **Given** usuários em fusos horários diferentes, **When** cada um visualiza a mesma despesa, **Then** todos veem a mesma data de vencimento, igual à que foi informada no cadastro.
4. **Given** despesas já existentes antes desta melhoria, **When** o usuário as visualiza após a correção, **Then** a data exibida corresponde ao dia que se pretendia registrar (sem deslocamento de um dia).

---

### User Story 3 - Registrar a data de pagamento da despesa (Priority: P2)

Ao pagar uma despesa, o usuário registra a **Data do Pagamento** — quando ela foi efetivamente quitada. Isso permite distinguir o que já foi pago do que está em aberto e quando cada pagamento ocorreu.

**Why this priority**: Agrega valor ao acompanhamento financeiro (histórico de quando cada conta foi paga), mas depende conceitualmente da existência dos campos de data já introduzidos e é menos crítico que o vencimento e a correção do bug.

**Independent Test**: Registrar a data de pagamento em uma despesa e confirmar que ela é salva, exibida corretamente (sem deslocamento de dia) e que o estado de pagamento da despesa reflete essa informação de forma consistente.

**Acceptance Scenarios**:

1. **Given** uma despesa em aberto, **When** o usuário informa a Data do Pagamento e salva, **Then** a despesa passa a exibir a data de pagamento informada.
2. **Given** uma despesa com Data do Pagamento preenchida, **When** o usuário a visualiza, **Then** a data de pagamento é exibida exatamente como informada (sem deslocamento de dia).
3. **Given** uma despesa sem Data do Pagamento, **When** ela é exibida, **Then** o sistema a identifica como ainda não paga / sem data de pagamento.
4. **Given** uma despesa com Data do Pagamento preenchida, **When** o usuário remove a data de pagamento e salva, **Then** a despesa volta a constar como não paga / sem data de pagamento.
5. **Given** um usuário informando uma Data do Pagamento posterior ao dia atual, **When** ele tenta salvar, **Then** o sistema rejeita a data futura e orienta o usuário a informar uma data até hoje.

---

### Edge Cases

- **Data do Pagamento anterior à Data de Vencimento**: pagamento antecipado é válido e deve ser permitido.
- **Data do Pagamento muito posterior ao vencimento**: pagamento em atraso é válido e deve ser permitido.
- **"Sem data de vencimento" + data de pagamento preenchida**: uma despesa sem prazo definido pode ainda assim ter sido paga; a combinação deve ser permitida.
- **Datas futuras**: informar uma data de vencimento futura é esperado (contas a vencer). Uma Data do Pagamento no futuro, porém, é rejeitada (só se paga o que já ocorreu); "futuro" é avaliado contra o dia atual do calendário local do usuário, de modo que uma data que o usuário vê como hoje nunca seja rejeitada.
- **Alternar "Sem data de vencimento" com uma data já preenchida**: ao marcar a opção, a data informada deve ser descartada de forma clara; ao desmarcar, o campo volta a ser exigido.
- **Despesas legadas** criadas antes desta melhoria: precisam continuar visíveis e coerentes após a introdução dos novos campos — sua data atual passa a ser a Data de Vencimento (ver Assumptions).
- **Despesas legadas anteriormente pagas**: como o estado "pago" deixa de ter marcador próprio e passa a derivar da presença da Data do Pagamento, e nenhuma despesa legada recebe Data do Pagamento automaticamente (clarificação 2026-08-11), as despesas que hoje constam como pagas passam a ser exibidas como **em aberto ("Pendente")** após a migração. Essa é uma consequência **aceita e esperada** desta melhoria; o usuário pode registrar a Data do Pagamento novamente para marcá-las como pagas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir informar uma Data de Vencimento ao criar e ao editar uma despesa.
- **FR-002**: O sistema MUST oferecer a opção "Sem data de vencimento"; quando marcada, a Data de Vencimento deixa de ser exigida e a despesa é registrada sem data de vencimento.
- **FR-003**: O sistema MUST exigir a Data de Vencimento quando "Sem data de vencimento" não estiver marcada, impedindo o salvamento e orientando o usuário caso ela não seja informada.
- **FR-004**: O sistema MUST identificar claramente, na listagem, as despesas sem data de vencimento, distinguindo-as das que possuem data; e MUST ordená-las ao final da lista, após todas as despesas com data de vencimento (que permanecem ordenadas por vencimento em ordem crescente — a vencer mais próxima primeiro).
- **FR-005**: O sistema MUST permitir informar, limpar e alterar uma Data do Pagamento ao criar e ao editar uma despesa.
- **FR-006**: O sistema MUST tratar a presença da Data do Pagamento como o estado "pago" da despesa: preenchê-la marca a despesa como paga e limpá-la a marca como em aberto, sem um marcador manual de pago separado. O atalho de marcação rápida na listagem (alternar entre Paga/Pendente) MUST operar exclusivamente sobre a Data do Pagamento — marcar como paga grava a data do dia atual (calendário local do usuário) e marcar como pendente a limpa; não é um estado independente. Quando a data efetiva do pagamento diferir de hoje, o usuário a ajusta no formulário de edição.
- **FR-007**: O sistema MUST exibir toda data (vencimento e pagamento) exatamente como informada pelo usuário, sem deslocamento de dias, independentemente do fuso horário do usuário ou do servidor.
- **FR-008**: O sistema MUST corrigir as despesas já existentes de modo que suas datas passem a ser exibidas sem o deslocamento de um dia observado atualmente.
- **FR-009**: O sistema MUST validar que a Data do Pagamento, quando informada, é uma data válida e não posterior ao dia atual — o "dia atual" sendo a data de calendário local do usuário, não o UTC do servidor — e MUST permitir pagamentos antes ou depois da data de vencimento (desde que não no futuro).
- **FR-010**: Todas as operações sobre datas de despesas MUST respeitar as regras de autorização existentes (o usuário só cria/edita despesas da residência à qual pertence).

### Key Entities *(include if feature involves data)*

- **Despesa (Expense)**: representa um gasto da residência. Passa a distinguir dois momentos no tempo:
  - **Data de Vencimento**: quando a despesa precisa ser paga. Pode estar ausente quando marcada como "Sem data de vencimento".
  - **Data do Pagamento**: quando a despesa foi efetivamente paga. Ausente enquanto não paga.
  - Mantém os atributos existentes (descrição, valor, categoria, residência). O estado "pago" deixa de ser um marcador próprio e passa a ser determinado pela presença da Data do Pagamento.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das despesas recém-cadastradas exibem, na listagem e na edição, exatamente a data informada — sem deslocamento de dia — em qualquer fuso horário de usuário.
- **SC-002**: 100% das despesas legadas passam a exibir a data pretendida (sem o deslocamento de um dia) após a correção.
- **SC-003**: O usuário consegue cadastrar uma despesa "sem data de vencimento" sem precisar informar nenhuma data de prazo.
- **SC-004**: Uma despesa pode ser identificada como paga ou em aberto com base na presença/ausência da Data do Pagamento, de forma consistente em toda a interface.
- **SC-005**: O usuário completa o cadastro de uma despesa com data de vencimento e data de pagamento sem instruções adicionais além dos rótulos e mensagens da própria tela.

## Assumptions

- A funcionalidade se aplica ao cadastro, edição e listagem de despesas existentes; relatórios, gráficos do dashboard e filtros por data ficam fora do escopo desta melhoria, salvo o necessário para não exibir datas deslocadas. O dashboard atual apenas agrega somas (valores) e não exibe datas de despesa, portanto FR-007/FR-008 não exigem alteração de formatação nele — a única mudança é derivar o estado "pago" de `paidDate` em vez de `isPaid`.
- A Data de Vencimento assume o papel da data única de despesa que existe hoje; para despesas legadas, a data atual é interpretada como Data de Vencimento, e nenhuma delas recebe Data do Pagamento automaticamente. Consequentemente, o antigo marcador de "pago" das despesas legadas não é preservado: elas passam a constar como em aberto até que o usuário registre uma Data do Pagamento (ver Edge Cases).
- Datas são registradas com granularidade de dia (sem horário relevante para o usuário).
- As convenções do projeto (shadcn/ui, tokens de tema, `rem`, ícones `lucide-react`, Prisma restrito à camada de dados, mutações via Server Actions protegidas) permanecem válidas — detalhes de implementação serão tratados no `/speckit-plan`.
